import { logger } from "@/state/utils";
import { signTransaction } from "@stellar/freighter-api";
import {
  Account,
  Address,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  rpc,
  StrKey,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { networkRpc } from "./web3";

export function xdrToTransaction(signedTxXdr: string, networkPassphrase: string) {
  const tx = new Transaction(signedTxXdr, networkPassphrase);
  return tx;
}

async function uploadWasm(contract: Buffer, deployer: Keypair, network: Networks, server: rpc.Server) {
  const account = await server.getAccount(deployer.publicKey());
  const operation = Operation.uploadContractWasm({ wasm: contract });
  return await buildAndSendTransaction(account, operation, network, server, deployer);
}
async function deployContract(
  response: rpc.Api.GetSuccessfulTransactionResponse,
  deployer: Keypair,
  network: Networks,
  server: rpc.Server,
) {
  const account = await server.getAccount(deployer.publicKey());
  const operation = Operation.createCustomContract({
    wasmHash: response?.returnValue?.bytes() as any,
    address: Address.fromString(deployer.publicKey()),
    // @ts-ignore
    salt: response?.hash as any,
  });
  const responseDeploy = await buildAndSendTransaction(account, operation, network, server, deployer);
  const contractAddress = StrKey.encodeContract(
    Address.fromScAddress(responseDeploy?.returnValue?.address?.() as any).toBuffer(),
  );
  
  return contractAddress;
}
export async function buildAndSendTransaction(
  account: Account,
  operations: xdr.Operation,
  network: Networks,
  server: rpc.Server,
  deployer: Keypair,
) {
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: network,
  })
    .addOperation(operations)
    .setTimeout(30)
    .build();

  const signedTx = await server.prepareTransaction(transaction);
  signedTx.sign(deployer);

  logger.info("Submitting transaction...");
  // const signedTx = xdrToTransaction(signedTxXdr, network);
  let response = await server.sendTransaction(signedTx);

  const hash = response.hash;
  logger.info(`Transaction hash: ${hash}`);
  logger.info("Awaiting confirmation...");

  let getResponse;

  while (true) {
    getResponse = await server.getTransaction(hash);
    if (getResponse.status !== "NOT_FOUND") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (getResponse.status === "SUCCESS") {
    logger.info("Transaction successful.");
    return getResponse;
  } else {
    logger.error("Transaction failed.");
    throw new Error("Transaction failed");
  }
}

async function deployStellerContract(contract: Buffer, deployer: Keypair, network: Networks) {
  try {
    logger.info("Starting Contract Deployment to Steller Network...");
    const server = new rpc.Server(networkRpc[network]);
    await server.requestAirdrop(deployer.publicKey());
    logger.info(`Got airdrop address: ${deployer.publicKey()}`);
    let uploadResponse = await uploadWasm(contract, deployer, network, server);
    const address = await deployContract(uploadResponse, deployer, network, server);

    return address;
  } catch (error) {
    console.error(error);
  }
}

export default deployStellerContract;

// export async function submitSignedXdr(signedTxXdr: string) {
//   const tx = xdrToTransaction(signedTxXdr, network);

//   console.log("Submitting transaction...");
//   let response = await server.sendTransaction(tx);
//   const hash = response.hash;
//   console.log(`Transaction hash: ${hash}`);
//   console.log("Awaiting confirmation...");

//   let getResponse;

//   while (true) {
//     getResponse = await server.getTransaction(hash);
//     if (getResponse.status !== "NOT_FOUND") {
//       break;
//     }
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   }

//   if (getResponse.status === "SUCCESS") {
//     console.log("Transaction successful.");
//     return getResponse;
//   } else {
//     console.log("Transaction failed.");
//     throw new Error("Transaction failed");
//   }
// }
