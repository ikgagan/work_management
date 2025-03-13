#!/bin/bash

echo "Starting BusinessFlow development environment..."

# Check if concurrently is installed
if ! command -v npx concurrently &> /dev/null; then
  echo "Installing concurrently..."
  npm install --save-dev concurrently
fi

# Start both the React app and the JSON Server
echo "Starting React app and JSON Server..."
npx concurrently "npm run start" "npm run start:server"

echo "Development environment started!" 