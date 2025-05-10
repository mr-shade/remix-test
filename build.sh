#!/bin/bash

# Exit on error
set -e

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Build the application
npm run build

echo "Build completed successfully!"
