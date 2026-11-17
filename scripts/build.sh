#!/usr/bin/env bash

set -e

rm -rf dist/public
mkdir -p dist/public
cp -r src/public/. dist/public/

mkdir -p dist/config
cp src/config/.env* dist/config/