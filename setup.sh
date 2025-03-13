#!/bin/bash

echo "Setting up BusinessFlow application..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the application and server
echo "Starting the application and JSON Server..."
npm run dev

echo "Setup complete!" 