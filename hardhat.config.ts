import { HardhatUserConfig } from "hardhat/config"

import "@nomicfoundation/hardhat-toolbox"
import "hardhat-jest"

import network from "./network"

const alchemyApiKey = process.env.ALCHEMY_API_KEY

if (!alchemyApiKey) {
  throw new Error("ALCHEMY_API_KEY is required")
}

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
}

export default config
