#!/bin/bash

echo "Building BusinessFlow application..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React application
echo "Building React application..."
npm run build

# Setup for deployment
echo "Setting up for deployment..."
mkdir -p deploy
cp -r build/* deploy/
cp db.json deploy/
cp Caddyfile deploy/ 2>/dev/null || echo "Caddyfile not found, skipping..."

echo "Build complete! Deploy the 'deploy' directory to your server."
echo "To start locally with Caddy, navigate to the deploy directory and run:"
echo "caddy file-server --root . --listen :8080" 