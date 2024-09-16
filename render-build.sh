#!/bin/bash

# Update package list
apt-get update

# Install g++
apt-get install -y g++

# Build the project
npm install
npm run build
