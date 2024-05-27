# Start from a rust base image
FROM rust:1.76.0 as base

# Set the current directory
WORKDIR /app

# Copy everthing that is not dockerignored to the image
COPY . .

# Start from base image
FROM base as builder

# Rust setup
RUN rustup toolchain install stable
RUN rustup toolchain install nightly-2024-02-04
RUN rustup target add wasm32-unknown-unknown
RUN cargo install cargo-make

# Install Node
RUN apt-get --yes update
RUN apt-get --yes upgrade
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v18.16.1
RUN mkdir -p /usr/local/nvm && apt-get update && echo "y" | apt-get install curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/bin
ENV PATH $NODE_PATH:$PATH

# Install dependencies
RUN cargo make deps-wasm
RUN cargo make deps-npm

# Build 
RUN cargo make build-server
RUN cargo make build-bindings
RUN cargo make build-app
RUN cargo make build-backend


# Final image

# Start from a base image (comes with docker)
FROM nestybox/ubuntu-jammy-systemd-docker:latest

# Copy the built files
COPY --from=builder /app/packages/app/dist /app/packages/app/dist
COPY --from=builder /app/target/release/backend /app/target/release/backend

# Startup scripts
COPY sysbox/on-start.sh /usr/bin
RUN chmod +x /usr/bin/on-start.sh

# Entrypoint
ENTRYPOINT [ "on-start.sh" ]
