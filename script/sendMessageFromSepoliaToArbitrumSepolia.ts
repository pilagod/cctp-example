import {
  Contract,
  JsonRpcProvider,
  keccak256,
  TransactionResponse,
  Wallet,
  zeroPadValue,
} from "ethers"
import { ethers } from "hardhat"

import MessageTransmitterAbi from "../abi/cctp/MessageTransmitter.json"
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
  const arbitrumSepoliaMessageHandler = await ethers.getContractAt(
    "MessageHandler",
    "0x437b79f1C3B4E0619e315d8fD9C7AaA005f608b1",
  )

  /* Source domain */

  const sepoliaMessenger = new Wallet(
    config.operator.privateKey,
    sepoliaProvider,
  )
  const sepoliaMessageTransmitter = new Contract(
    network.sepolia.address.cctp.MessageTransmitter,
    MessageTransmitterAbi,
    sepoliaMessenger,
  )

  // This is the caller to receive message on Arbitrum Sepolia
  const arbitrumSepoliaCaller = new Wallet(
    config.operator.privateKey,
    arbitrumSepoliaProvider,
  )

  const messageTx: TransactionResponse =
    await sepoliaMessageTransmitter.sendMessage(
      network.arbitrumSepolia.domain,
      zeroPadValue(await arbitrumSepoliaMessageHandler.getAddress(), 32),
      "0x1234",
    )
  const messageReceipt = await messageTx.wait()

  if (!messageReceipt) {
    throw new Error(`Cannot get message receipt: ${messageTx.hash}`)
  }

  const [messageSent] = messageReceipt.logs
    .map((log) => sepoliaMessageTransmitter.interface.parseLog(log))
    .filter((log) => log && log.name === "MessageSent")

  if (!messageSent) {
    throw new Error(
      `Cannot find MessageSent event in message receipt: ${messageTx.hash}`,
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
  const receiveReceipt = await receiveTx.wait()

  if (!receiveReceipt) {
    throw new Error(`Cannot get receive receipt: ${receiveTx.hash}`)
  }

  const [messageReceived] = receiveReceipt.logs
    .map((log) => arbitrumSepoliaMessageHandler.interface.parseLog(log))
    .filter((log) => log && log.name === "MessageReceived")

  if (!messageReceived) {
    throw new Error(`Cannot find MessageReceived event: ${receiveTx.hash}`)
  }

  console.log(
    `MessageReceived(sourceDomain = ${messageReceived.args[0]}, sender = ${messageReceived.args[1]}, messageBody = ${messageReceived.args[2]})`,
  )
}

main()
