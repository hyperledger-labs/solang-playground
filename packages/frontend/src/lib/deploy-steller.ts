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

const server = new rpc.Server("https://soroban-testnet.stellar.org:443");

export function xdrToTransaction(signedTxXdr: string, networkPassphrase: string) {
  const tx = new Transaction(signedTxXdr, networkPassphrase);
  return tx;
}

async function uploadWasm(contract: Buffer, deployer: string) {
  const account = await server.getAccount(deployer);
  const operation = Operation.uploadContractWasm({ wasm: contract });
  return await buildAndSendTransaction(account, operation);
}
async function deployContract(response: rpc.Api.GetSuccessfulTransactionResponse, deployer: string) {
  const account = await server.getAccount(deployer);
  const operation = Operation.createCustomContract({
    wasmHash: response?.returnValue?.bytes()!,
    address: Address.fromString(deployer),
    // @ts-ignore
    salt: response?.hash!,
  });
  const responseDeploy = await buildAndSendTransaction(account, operation);
  const contractAddress = StrKey.encodeContract(
    Address.fromScAddress(responseDeploy?.returnValue?.address?.()!).toBuffer(),
  );
  console.log(contractAddress);
}
async function buildAndSendTransaction(account: Account, operations: xdr.Operation) {
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(operations)
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(transaction);
  const { signedTxXdr } = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase: Networks.TESTNET
  });

  console.log("Submitting transaction...");
  const signedTx = xdrToTransaction(signedTxXdr, Networks.TESTNET);
  let response = await server.sendTransaction(signedTx);

  const hash = response.hash;
  console.log(`Transaction hash: ${hash}`);
  console.log("Awaiting confirmation...");

  let getResponse;

  while (true) {
    getResponse = await server.getTransaction(hash);
    if (getResponse.status !== "NOT_FOUND") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (getResponse.status === "SUCCESS") {
    console.log("Transaction successful.");
    return getResponse;
  } else {
    console.log("Transaction failed.");
    throw new Error("Transaction failed");
  }
}

async function deployStellerContract(contract: Buffer, deployer: string) {
  try {
    let uploadResponse = await uploadWasm(contract, deployer);
    await deployContract(uploadResponse, deployer);
  } catch (error) {
    console.error(error);
  }
}

export default deployStellerContract;

// export async function submitSignedXdr(signedTxXdr: string) {
//   const tx = xdrToTransaction(signedTxXdr, Networks.TESTNET);

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
