#!/bin/bash

VERSION=$(grep -E 'var version = ".*"' "spoonmaster.go" | awk -F '"' '{print $2}')

cp spoonmaster.dockerignore .dockerignore
docker build -f website.Dockerfile -t spoonmaster:${VERSION} .
rm .dockerignore