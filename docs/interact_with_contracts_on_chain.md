## Interacting with Smart Contracts on Chain

This tutorial will guide you through the process of interacting with smart contracts compiled using Solang Playground. Solang Playground uses the official [Solang Docker image](https://github.com/hyperledger/solang/pkgs/container/solang) to compile your contracts. You can easily deploy and interact with these compiled contracts using Contracts UI. Please follow these steps:

### Prerequisites

Before you start, ensure you have the necessary setup to run a local node if you choose to deploy on a local network. You can install and run `substrate-contracts-node` as follows:

1. Follow the installation guide here: [Substrate Contracts Node Installation](https://github.com/use-ink/substrate-contracts-node?tab=readme-ov-file#installation).
2. After installation, run the local dev node with the command:

   ```bash
    substrate-contracts-node
   ```

   This will create a new chain in a temporary directory each time the command is executed.

Once your local node is running, you can connect to it with frontends like [Contracts UI](https://contracts-ui.substrate.io/#/?rpc=ws://127.0.0.1:9944) or [Polkadot-JS Apps](https://polkadot.js.org/apps/#/explorer?rpc=ws://localhost:9944). This tutorial will focus on using Contracts UI due to its user-friendly interface.

### Compiling Smart Contracts

1. **Open Solang Playground:** Navigate to [Solang Playground](http://labs.hyperledger.org/solang-playground/).
2. **Write and Compile:** Write your smart contract code in the editor. You can use the provided example or write your own solidity code.
3. **Compile:** Click on the "Compile" button to compile your smart contract. This will generate and download a `result.contract` bundle that you can upload to the chain.
4. **Interact with Compiled Contract:** Click on the "Deploy/Interact with Compiled Contracts on chain" button to interact with the compiled contract. This will redirect you to Contracts UI.

### Uploading a Contract to the Chain

1. **Open Contracts UI:** Navigate to [Contracts UI](https://ui.use.ink/).
2. **Select Network:** From the drop-down menu, choose the network you want to deploy your contract on. This could be a live network, a test network, or a local node.
3. **Upload Contract Bundle:** Click on the "Upload a new contract" button. In the "Upload Contract Bundle" section, select the `result.contract` bundle that was generated when you compiled your smart contracts using Solang Playground.
4. **View Contract Information:** You will see information about the compiled contract, including the compiler details and available contract functions.
5. **Upload and Instantiate:** Follow the instructions to upload and instantiate the contract on the chosen network.

### Interacting with Deployed Contracts

Once your contract is deployed and instantiated, you will be redirected to a page where you can interact with it. Here’s how to call a specific function on the deployed smart contract:

1. **Choose Caller Account:** Select the account you want to use to call the contract.
2. **Select Message:** Choose the message to send, which corresponds to the function you want to call on the contract.
3. **Call Contract:** Click "Call contract" to execute the function.

You can also browse the metadata of the contract to view details about its structure and available functions.

### Support

If you encounter any issues during this process, please do not hesitate to file a GitHub issue. Your feedback is valuable, and we are here to help ensure a smooth experience.
