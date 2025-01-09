// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IMessageHandler } from "./interface/IMessageHandler.sol";

contract MessageHandler is IMessageHandler {
    event MessageReceived(
        uint32 sourceDomain,
        bytes32 sender,
        bytes messageBody
    );

    function handleReceiveMessage(
        uint32 sourceDomain,
        bytes32 sender,
        bytes calldata messageBody
    ) external returns (bool) {
        emit MessageReceived(sourceDomain, sender, messageBody);
        return true;
    }
}
