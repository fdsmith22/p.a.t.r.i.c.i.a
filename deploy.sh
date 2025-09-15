#!/bin/bash

# Neurlyn deployment script with aggressive cache busting

# Generate timestamp for cache busting
TIMESTAMP=$(date +%s)
echo "Deploying with timestamp: $TIMESTAMP"

# Update service worker cache version
sed -i "s/const CACHE_NAME = 'neurlyn-v[0-9]*'/const CACHE_NAME = 'neurlyn-v$TIMESTAMP'/" sw.js

# Update script version in index.html
sed -i "s/neurlyn-integrated.js?v=[0-9]*/neurlyn-integrated.js?v=$TIMESTAMP/" index.html

# Update script version in dist/index.html if it exists
if [ -f "dist/index.html" ]; then
    sed -i "s/neurlyn-integrated.js?v=[0-9]*/neurlyn-integrated.js?v=$TIMESTAMP/" dist/index.html
fi

# Clean build
echo "Cleaning dist folder..."
rm -rf dist/*

# Build project
echo "Building project..."
npm run build

# Copy service worker to dist
cp sw.js dist/

# Git operations
echo "Committing changes..."
git add -A
git commit -m "Deploy with cache bust v$TIMESTAMP"
git push origin main

echo "Deployment complete! Cache version: v$TIMESTAMP"
echo "Wait 2-3 minutes for GitHub Pages to update, then test in incognito mode."