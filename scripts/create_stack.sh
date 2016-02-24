#!/usr/bin/env bash

set -e

stack="${1}"
fe="frontend"
stackName=${1}${fe}

echo "-- Creating Stack... ${stackName}"
aws cloudformation create-stack --stack-name ${stackName} --template-body file://./infrastructure/frontend.json --parameters ParameterKey=Environment,ParameterValue=${stack}

echo "-- Patching CDN... "
node ./scripts/patch.js ${stack}

echo "-- Stack ${stackName} Created... "
