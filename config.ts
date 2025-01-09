import "dotenv/config"

const config = {
  alchemyApiKey: process.env.ALCHEMY_API_KEY as string,
  depositorPrivateKey: process.env.DEPOSITOR_PRIVATE_KEY as string,
  etherscan: {
    apiKey: {
      arbitrum: process.env.ETHERSCAN_ARBITRUM_API_KEY as string,
    },
  },
}

export default config
