import {
  Contract,
  JsonRpcProvider,
  keccak256,
  TransactionResponse,
  Wallet,
  zeroPadValue,
} from "ethers"

import MessageTransmitterAbi from "../abi/cctp/MessageTransmitter.json"
import TokenMessengerAbi from "../abi/cctp/TokenMessenger.json"
import UsdcAbi from "../abi/Usdc.json"
import config from "../config"
import network from "../network"

async function main() {
  const sepoliaProvider = new JsonRpcProvider(
    network.sepolia.url,
    network.sepolia.chainId,
  )
  const arbitrumSepoliaProvider = new JsonRpcProvider(
    network.arbitrumSepolia.url,
    network.arbitrumSepolia.chainId,
  )

  /* Source domain */

  const sepoliaDepositor = new Wallet(
    config.depositorPrivateKey,
    sepoliaProvider,
  )
  const sepoliaUsdc = new Contract(
    network.sepolia.address.token.Usdc,
    UsdcAbi,
    sepoliaDepositor,
  )
  const sepoliaTokenMessenger = new Contract(
    network.sepolia.address.cctp.TokenMessenger,
    TokenMessengerAbi,
    sepoliaDepositor,
  )
  const sepoliaMessageTransmitter = new Contract(
    network.sepolia.address.cctp.MessageTransmitter,
    MessageTransmitterAbi,
    sepoliaDepositor,
  )

  const decimals: bigint = await sepoliaUsdc.decimals()
  const allowance: bigint = await sepoliaUsdc.allowance(
    sepoliaDepositor.address,
    await sepoliaTokenMessenger.getAddress(),
  )
  const transferAmount = 1n * 10n ** (decimals - 2n)

  if (allowance < transferAmount) {
    const approvedTx: TransactionResponse = await sepoliaUsdc.approve(
      sepoliaTokenMessenger.getAddress(),
      transferAmount * 100n,
    )
    await approvedTx.wait()
  }

  // This is the caller and recipient on Arbitrum Sepolia
  const arbitrumSepoliaCaller = new Wallet(
    config.depositorPrivateKey,
    arbitrumSepoliaProvider,
  )

  // Deposit usdc to the caller on Arbirtrum Sepolia
  const depositTx: TransactionResponse =
    await sepoliaTokenMessenger.depositForBurn(
      transferAmount,
      network.arbitrumSepolia.domain,
      // Type of dest domain recipient is bytes32
      zeroPadValue(arbitrumSepoliaCaller.address, 32),
      sepoliaUsdc.getAddress(),
    )
  const depositReceipt = await depositTx.wait()

  if (!depositReceipt) {
    throw new Error(`Cannot get deposit receipt: ${depositTx.hash}`)
  }

  const [messageSent] = depositReceipt.logs
    .map((log) => sepoliaMessageTransmitter.interface.parseLog(log))
    .filter((log) => log && log.name === "MessageSent")

  if (!messageSent) {
    throw new Error(
      `Cannot find MessageSent event in deposit receipt: ${depositTx.hash}`,
    )
  }

  const messageBytes: string = messageSent.args[0]
  const messageHash = keccak256(messageBytes)

  console.log(`Message bytes: ${messageBytes}`)
  console.log(`Message hash: ${messageHash}`)

  // Polling the attestation from attestation service
  console.log("Start polling for attestation...")

  let attestationResponse = {
    attestation: "PENDING",
    status: "pending_confirmations",
  }
  while (true) {
    const response = await fetch(
      `https://iris-api-sandbox.circle.com/v1/attestations/${messageHash}`,
    )
    attestationResponse = await response.json()
    console.log("Attestation response:", attestationResponse)
    if (attestationResponse.status === "complete") {
      break
    }
    await new Promise((r) => setTimeout(r, 60 * 1000))
  }
  const { attestation } = attestationResponse

  if (!attestation || attestation === "PENDING") {
    throw new Error(
      `Attestaion invalid: ${JSON.stringify(attestationResponse)}`,
    )
  }

  console.log(`Attestation: ${attestation}`)

  /* Dest domain */

  const arbitrumSepoliaUsdc = new Contract(
    network.arbitrumSepolia.address.token.Usdc,
    UsdcAbi,
    arbitrumSepoliaCaller,
  )
  const arbitrumSepoliaUsdcCallerBalanceBefore: bigint =
    await arbitrumSepoliaUsdc.balanceOf(arbitrumSepoliaCaller.address)

  console.log(
    `Caller ${arbitrumSepoliaCaller.address} usdc balance before: ${arbitrumSepoliaUsdcCallerBalanceBefore}`,
  )

  const arbitrumSepoliaMessageTransmitter = new Contract(
    network.arbitrumSepolia.address.cctp.MessageTransmitter,
    MessageTransmitterAbi,
    arbitrumSepoliaCaller,
  )

  const receiveTx: TransactionResponse =
    await arbitrumSepoliaMessageTransmitter.receiveMessage(
      messageBytes,
      attestation,
    )
  await receiveTx.wait()

  const arbitrumSepoliaUsdcCallerBalanceAfter: bigint =
    await arbitrumSepoliaUsdc.balanceOf(arbitrumSepoliaCaller.address)

  console.log(
    `Caller ${arbitrumSepoliaCaller.address} usdc balance after: ${arbitrumSepoliaUsdcCallerBalanceAfter}`,
  )

  const receiveAmount =
    arbitrumSepoliaUsdcCallerBalanceAfter -
    arbitrumSepoliaUsdcCallerBalanceBefore

  if (receiveAmount === transferAmount) {
    console.log(
      `Caller ${arbitrumSepoliaCaller.address} receives ${transferAmount} usdc successfully`,
    )
  } else {
    console.error(
      `Caller ${arbitrumSepoliaCaller.address} receives ${receiveAmount} usdc, instead of ${transferAmount} usdc`,
    )
  }
}

main()
