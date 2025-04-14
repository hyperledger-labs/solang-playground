import { BASE_FEE, Contract, Keypair, nativeToScVal, Networks, TransactionBuilder } from "@stellar/stellar-sdk";
import { networkRpc } from "./web3";
import { Server } from "@stellar/stellar-sdk/rpc";

function buildOperation({
  contractId,
  method,
  args,
}: {
  method: string;
  contractId: string;
  args: { type: string; value: string; subType: string }[];
}) {
  const contract = new Contract(contractId);
  
  const scArgs = args.map(({ type, value, subType }) => {
    if (type === "vec") {
      value = JSON.parse(value).map((x: any) => nativeToScVal(x, { type: subType }));
    }

    return nativeToScVal(value, { type });
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
  args: { type: string; value: string; subType: string }[];
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
