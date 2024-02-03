# Solang Playground - A Solidity web editor for [Hyperledger Solang](https://github.com/hyperledger/solang)


Welcome to Solang Playground, a Solidity web editor for that enables editing, compiling, deploying and interacting with Solidity smart contracts on Solana or Polkadot.



## Demo

You can experiment with a live demo of the example server integrated with an in-browser editor here:

https://labs.hyperledger.org/solang-playground/

## Building

```sh
cargo install cargo-make
cargo make deps
cargo make build
```

## Running

```sh
cargo make run
```



## Roadmap and Status

### V0.1

| Milestone                                                                    | Related Feature                                                                                                                | Status      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| Compile Solang language server to WASM, and integrate it to a Monaco editor. | Allow editing Solidity source files in the browser, with smarts provided from the server (Diagnostics, code completion, etc..) | Completed   |
| Host Solang on a backend service                                             | Allow compiling smart contracts on the web editor                                                                              | In progress |
| Support Polkadot API                                                         | Allow the deployment and interaction with Solidity contracts on Polkadot                                                       | Not Started |
| IDE Improvements                                                             | Improve developer experience when trying out the IDE, making it a more attractive option for Solidity devs                     | Not started |




## Acknowledgments

This project started out as a fork of https://github.com/silvanshade/tower-lsp-web-demo. [Darin Morrison](https://github.com/silvanshade) created a demo project where an example tower-lsp language server was compiled to WASM and integrated in a Monaco web editor.
