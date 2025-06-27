#!/bin/bash

# Build script for Vercel deployment
echo "Building 3D Modeling Application..."

# Install dependencies
npm install

# Build the client
echo "Building client..."
npm run build

echo "Build complete!"