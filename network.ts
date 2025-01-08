import "dotenv/config"

const alchemyApiKey = process.env.ALCHEMY_API_KEY

if (!alchemyApiKey) {
  throw new Error("ALCHEMY_API_KEY is required")
}

const network = {
  sepolia: {
    chainId: 11155111,
    domain: 0,
    url: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: {
      USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    },
  },
  arbitrumSepolia: {
    chainId: 421614,
    domain: 3,
    url: `https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: {
      USDC: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    },
  },
  baseSepolia: {
    chainId: 84532,
    domain: 6,
    url: `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: {
      USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    },
  },
}

export default network
