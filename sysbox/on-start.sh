#!/bin/bash

# dockerd start
dockerd > /var/log/dockerd.log 2>&1 &
sleep 2

# pull latest solang image
docker pull ghcr.io/hyperledger/solang:latest

# start backend server
./app/target/release/backend --port 9000 --host 0.0.0.0 --frontend_folder /app/packages/app/dist 
