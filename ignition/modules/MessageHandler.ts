import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("MessageHandlerModule", (m) => {
  const messageHandler = m.contract("MessageHandler")
  return { messageHandler }
})
