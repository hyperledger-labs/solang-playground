#!/bin/bash

# dockerd start
dockerd > /var/log/dockerd.log 2>&1 &
sleep 2

# pull solang image version v0.3.3
docker pull ghcr.io/hyperledger/solang:v0.3.3

# start backend server
./app/target/release/backend --port 9000 --host 0.0.0.0 --frontend_folder /app/packages/app/dist 
