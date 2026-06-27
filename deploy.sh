#!/bin/bash

# Deployment Script for Nak Makan Apa App
# This script increments build number and deploys to production

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "src/App.jsx" ]; then
    echo "❌ Error: src/App.jsx not found. Are you in the project root?"
    exit 1
fi

# Get commit message from user
read -p "📝 Enter commit message (or press Enter for default): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Deploy: Update build number"
fi

# Increment build number
echo "🔢 Incrementing build number..."
node increment-build.js

if [ $? -ne 0 ]; then
    echo "❌ Failed to increment build number"
    exit 1
fi

# Get the new build number for display
NEW_BUILD=$(grep "const BUILD_NUMBER" src/App.jsx | grep -o "'[0-9]*'" | tr -d "'")

echo "📦 New version: 2.2.0 Build $NEW_BUILD"

# Git operations
echo "📤 Committing changes..."
git add .
git commit -m "$COMMIT_MSG (Build $NEW_BUILD)"

echo "🌐 Pushing to GitHub..."
git push

echo "✅ Deployment complete!"
echo "🎉 Version 2.2.0 Build $NEW_BUILD is now live!"
echo "🔗 Check your app at: https://nak-makan-apa-next.vercel.app"