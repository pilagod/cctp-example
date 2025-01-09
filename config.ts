import "dotenv/config"

const config = {
  alchemyApiKey: process.env.ALCHEMY_API_KEY as string,
  depositorPrivateKey: process.env.DEPOSITOR_PRIVATE_KEY as string,
}

export default config
