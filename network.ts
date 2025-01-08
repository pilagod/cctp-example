import "dotenv/config"

const alchemyApiKey = process.env.ALCHEMY_API_KEY

if (!alchemyApiKey) {
  throw new Error("ALCHEMY_API_KEY is required")
}

const network = {
  sepolia: {
    chainId: 11155111,
    url: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  },
  arbitrumSepolia: {
    chainId: 421614,
    url: `https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  },
}

export default network
