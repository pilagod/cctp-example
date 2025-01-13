import config from "./config"

const { alchemyApiKey } = config

if (!alchemyApiKey) {
  throw new Error("ALCHEMY_API_KEY is required")
}

export enum Network {
  Sepolia = "sepolia",
  ArbitrumSepolia = "arbitrumSepolia",
  BaseSepolia = "baseSepolia",
}

const network = {
  [Network.Sepolia]: {
    chainId: 11155111,
    domain: 0,
    url: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: {
      token: {
        Usdc: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      },
      cctp: {
        TokenMessenger: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
        MessageTransmitter: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
      },
    },
  },
  [Network.ArbitrumSepolia]: {
    chainId: 421614,
    domain: 3,
    url: `https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: {
      token: {
        Usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      },
      cctp: {
        TokenMessenger: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
        MessageTransmitter: "0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872",
      },
    },
  },
  [Network.BaseSepolia]: {
    chainId: 84532,
    domain: 6,
    url: `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
    address: {
      token: {
        Usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      },
      cctp: {
        TokenMessenger: "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5",
        MessageTransmitter: "0x7865fAfC2db2093669d92c0F33AeEF291086BEFD",
      },
    },
  },
}

export default network
