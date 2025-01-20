#!/bin/bash

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

echo "${PACKAGE_VERSION}"

cp website.dockerignore .dockerignore
docker build -f website.Dockerfile -t docker.prorickey.xyz/prorickey/spoons-website:"${PACKAGE_VERSION}" .
rm .dockerignore

docker push docker.prorickey.xyz/prorickey/spoons-website:"${PACKAGE_VERSION}"

echo "Complete"
read -r