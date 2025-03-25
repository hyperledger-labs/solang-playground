import { Networks } from "@stellar/stellar-sdk";

export const networkRpc = {
  [Networks.TESTNET]: "https://soroban-testnet.stellar.org:443",
  [Networks.PUBLIC]: "https://soroban.stellar.org:443",
  [Networks.FUTURENET]: "https://horizon-futurenet.stellar.org:443",
} as Record<Networks, string>;
