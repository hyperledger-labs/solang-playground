import { Address, BASE_FEE, Contract, Keypair, Networks, TransactionBuilder, xdr } from "@stellar/stellar-sdk";
import { assembleTransaction, Server } from "@stellar/stellar-sdk/rpc";
import { networkRpc } from "./web3";
import { buildAndSendTransaction } from "./deploy-steller";

function buildOperation({ contractId, method, args }: { method: string; contractId: string; args: any[] }) {
  const contract = new Contract(contractId);
  const scArgs = args.map((arg) => {
    if (typeof arg === "string" && arg.startsWith("G")) {
      return Address.fromString(arg).toScVal(); // Address
    } else if (typeof arg === "number") {
      return xdr.ScVal.scvI32(arg); // Integer
    } else {
      return xdr.ScVal.scvString(arg); // String (adjust as needed)
    }
  });
  const operation = contract.call(method, ...scArgs);
  return operation;
}

export async function invokeContract({
  contractId,
  method,
  args,
}: {
  method: string;
  contractId: string;
  args: any[];
}) {
  const sourceKeypair = Keypair.random();
  const rpcUrl = networkRpc[Networks.TESTNET];
  const server = new Server(rpcUrl);
  const sourcePublicKey = sourceKeypair.publicKey();
  await server.requestAirdrop(sourcePublicKey);
  const sourceAccount = await server.getAccount(sourcePublicKey);

  const operation = buildOperation({ contractId, method, args });

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(transaction);
  preparedTx.sign(sourceKeypair);
  const txResult = await server.sendTransaction(preparedTx);
  return txResult;
}
