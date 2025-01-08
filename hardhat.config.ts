import "dotenv/config"

import { HardhatUserConfig } from "hardhat/config"

import "@nomicfoundation/hardhat-toolbox"
import "hardhat-jest"

const config: HardhatUserConfig = {
  solidity: "0.8.28",
}

export default config
