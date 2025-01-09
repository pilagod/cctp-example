declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALCHEMY_API_KEY?: string
      DEPOSITOR_PRIVATE_KEY?: string
      ETHERSCAN_ARBITRUM_API_KEY?: string
    }
  }
}

export {}
