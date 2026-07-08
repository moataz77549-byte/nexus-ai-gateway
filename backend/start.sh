#!/bin/sh

# Nexus AI Gateway Backend Startup Script
# This script ensures that database migrations are applied before the app starts.

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
node dist/main.js
