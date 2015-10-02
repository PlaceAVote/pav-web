#!/usr/bin/env bash

set -e

echo "-- Building Website..."

gulp build-site

mv ./app.js ./web/dist/app.js
mv ./package.json ./web/dist/package.json

label=$(date +%s)
file="pav-web-site.zip"
bucket="pav-web-site"
environment="pavWebFront-env"
reg="us-west-2"
application="pav-web-front"

cd ./web/dist/
zip -r ${file} ./*

echo "-- Deploying to envionrment..."

echo "Uploading zip to S3"
aws s3api put-object --bucket ${bucket} --key ${file} --body ${file}

echo "Creating Application Version Elasticbeanstalk Instance"
aws --region ${reg} elasticbeanstalk create-application-version --application-name ${application} --version-label ${label} --source-bundle S3Bucket=${bucket},S3Key=${file} --auto-create-application

echo "Updating Environment"
aws --region ${reg} elasticbeanstalk update-environment --environment-name ${environment} --version-label ${label}
