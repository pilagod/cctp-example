import { HardhatUserConfig } from "hardhat/config"

import "@nomicfoundation/hardhat-toolbox"
import "hardhat-jest"

import config from "./config"
import network, { Network } from "./network"

const hardhatConfig: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    ...Object.entries(network).reduce(
      (r, [n, c]) => {
        r[n] = {
          ...c,
          accounts: [config.operator.privateKey],
        }
        return r
      },
      ({} as HardhatUserConfig["networks"])!,
    ),
  },
  paths: {
    sources: "./contract",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifact",
  },
  etherscan: {
    apiKey: {
      [Network.ArbitrumSepolia]: config.etherscan.apiKey.arbitrum,
    },
    customChains: [
      {
        network: Network.ArbitrumSepolia,
        chainId: network[Network.ArbitrumSepolia].chainId,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
    ],
  },
}

export default hardhatConfig
