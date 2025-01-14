import { Wallet } from "ethers"

import "dotenv/config"

const config = {
  alchemyApiKey: process.env.ALCHEMY_API_KEY as string,
  operator: new Wallet(process.env.OPERATOR_PRIVATE_KEY as string),
  etherscan: {
    apiKey: {
      arbitrum: process.env.ETHERSCAN_ARBITRUM_API_KEY as string,
    },
  },
}

export default config
