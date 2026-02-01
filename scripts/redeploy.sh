#!/bin/bash
set -e

docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
