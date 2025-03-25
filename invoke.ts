import { Server } from "@stellar/stellar-sdk/rpc";
import { BASE_FEE, Contract, Keypair, Networks, TransactionBuilder, xdr } from "@stellar/stellar-sdk";

async function main() {
  const server = new Server("https://soroban-testnet.stellar.org:443");
  const keypair = Keypair.random();
  const account = await server.requestAirdrop(keypair.publicKey());

  const contract = new Contract("CBT42OCEG6ECN74FRMI4CBXOAZWXCQNJE2UC3RNNB3VNFIUHULJCP242");
  const operation = contract.call("hello", xdr.ScVal.scvString("he ll"));

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(transaction);
  preparedTx.sign(keypair);
  const txResult = await server.sendTransaction(preparedTx);
  console.log(txResult);
}

main();
