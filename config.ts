import "dotenv/config"

const config = {
  alchemyApiKey: process.env.ALCHEMY_API_KEY,
  depositorPrivateKey: process.env.DEPOSITOR_PRIVATE_KEY,
}

export default config
