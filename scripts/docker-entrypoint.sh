#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed || echo "Seeding skipped or already complete"

echo "Starting server..."
exec node server.js
