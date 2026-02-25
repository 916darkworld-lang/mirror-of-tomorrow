#!/bin/bash

# deploy_to_github.sh
# Simple GitHub auto-deployment script

echo "Starting GitHub deployment..."

# Ensure script stops on error
set -e

# Add all changes
git add .

# Commit with timestamp
git commit -m "Auto-deploy: $(date)"

# Push to main branch
git push origin main

echo "Deployment complete."
