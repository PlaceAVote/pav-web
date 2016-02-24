#!/usr/bin/env bash

set -e

echo "-- Creating Stack... $1"
aws cloudformation create-stack --stack-name $1"-frontend" --template-body file://../infrastructure/frontend.json ParameterKey=Environment,ParameterValue=$1

echo "-- Patching CDN... "
node ./patch.js $1

echo "-- Stack Created... "
