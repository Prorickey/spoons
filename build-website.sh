#!/bin/bash

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

cp website.dockerignore .dockerignore
docker build -f website.Dockerfile -t docker.prorickey.xyz/prorickey/spoons-website:${PACKAGE_VERSION} .
rm .dockerignore

docker push docker.prorickey.xyz/prorickey/spoons-website:${PACKAGE_VERSION}

read