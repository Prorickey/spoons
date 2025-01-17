#!/bin/bash

VERSION=$(grep -E 'var version = ".*"' "spoonmaster.go" | awk -F '"' '{print $2}')

cp spoonmaster.dockerignore .dockerignore
docker build -f spoonmaster.Dockerfile -t docker.prorickey.xyz/prorickey/spoonmaster:${VERSION} .
rm .dockerignore

docker push docker.prorickey.xyz/prorickey/spoonmaster:${VERSION}

echo "Complete"
read