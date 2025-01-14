declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALCHEMY_API_KEY?: string
      OPERATOR_PRIVATE_KEY?: string
      ETHERSCAN_ARBITRUM_API_KEY?: string
    }
  }
}

export {}
