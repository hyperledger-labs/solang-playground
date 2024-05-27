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

## Project Structure

This repository has two main parts:

- **`crates`**: Rust code, including:
  - `backend`: Actix Web server for the frontend.
  - `generate_bindings`: Generates TypeScript bindings for API endpoints.
  - `solang`: Contains the `solang-parser`
  - `browser`: Contains the monaco editor web server
- **`packages`**: TypeScript project for the frontend app, served by the Rust backend.

## Docker Setup

Our Dockerfile for Solang Playground relies on Nestybox's Sysbox runtime. This helps compile Solang Smart Contracts within a protected Docker environment. We also use a multi-stage build process to improve image size.

## Roadmap and Status

### V0.1

| Milestone                                                                    | Related Feature                                                                                                                | Status      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| Compile Solang language server to WASM, and integrate it to a Monaco editor. | Allow editing Solidity source files in the browser, with smarts provided from the server (Diagnostics, code completion, etc..) | Completed   |
| Host Solang on a backend service                                             | Allow compiling smart contracts on the web editor                                                                              | Completed   |
| Support Polkadot API                                                         | Allow the deployment and interaction with Solidity contracts on Polkadot                                                       | In progress |
| IDE Improvements                                                             | Improve developer experience when trying out the IDE, making it a more attractive option for Solidity devs                     | Not started |

## Acknowledgments

- This project started out as a fork of https://github.com/silvanshade/tower-lsp-web-demo. [Darin Morrison](https://github.com/silvanshade) created a demo project where an example tower-lsp language server was compiled to WASM and integrated in a Monaco web editor.
- The structure of `solang-playground` is significantly inspired by `ink-playground`. This includes, but is not limited to, the implementation of running the Solang compiler functionality in a sandboxed environment.
