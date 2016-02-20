#!/usr/bin/env bash

set -e

bucket="$1"

echo "-- Deploying to Envionrment... $1"

echo "Uploading zip to S3"
aws s3 sync ./css s3://${bucket}/css --acl "public-read" --content-type "text/css"
aws s3 sync ./dist s3://${bucket}/dist --acl "public-read"
aws s3 sync ./font s3://${bucket}/font --acl "public-read"
aws s3 sync ./img s3://${bucket}/img --acl "public-read"
aws s3 sync ./partials s3://${bucket}/partials --acl "public-read" --content-type "text/html"
aws s3api put-object --bucket ${bucket} --key index.html --body index.html --content-type text/html --acl public-read
