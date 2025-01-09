import { HardhatUserConfig } from "hardhat/config"

import "@nomicfoundation/hardhat-toolbox"
import "hardhat-jest"

import network from "./network"

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    ...network,
  },
  paths: {
    sources: "./contract",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifact",
  },
  etherscan: {
    apiKey: {
      ...Object.entries(network).reduce(
        (result, [network, config]) => {
          const { etherscan } = config as { etherscan?: { apiKey: string } }
          if (!etherscan?.apiKey) {
            return result
          }
          result[network] = etherscan.apiKey
          return result
        },
        {} as Record<string, string>,
      ),
    },
  },
}

export default config
