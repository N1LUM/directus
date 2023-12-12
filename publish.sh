#!/bin/sh

REGISTRY=dockerprivate.apps.okd.sebbia.org
IMAGE=chernomorets/directus-backend
VERSION=$(git describe --tags)

docker buildx build --platform linux/amd64 -t ${REGISTRY}/${IMAGE}:${VERSION} . && docker push ${REGISTRY}/${IMAGE}:${VERSION}
