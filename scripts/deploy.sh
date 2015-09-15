#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

#rm /src/config/endpoints.js
gulp live-config
gulp browserify-web

echo "-- Deploying to environment..."


label=$(date +%s)
file="pav-web-dev.zip"
bucket="pav-web-app"
application="pav-web-dev"
reg="us-west-2"

zip -r ${file} ./* -x '*.git*' -x '*node_modules/*' -x '*scripts/*' -x '*test/*' -x '*scss/*' -x '*src/*' -x '*gulpfile.js' -x '*README.md*' -x '*circle.yml*'


echo "Uploading zip to S3"
#aws s3api put-object --bucket ${bucket} --key ${file} --body ${file}

echo "Creating Application Version Elasticbeanstalk Instance"
#aws --region ${reg} elasticbeanstalk create-application-version --application-name ${application} --version-label ${label} --source-bundle S3Bucket=${bucket},S3Key=${file} --auto-create-application 

echo "Updating Environment"
#aws --region ${reg} elasticbeanstalk update-environment --environment-name ${application} --version-label ${label}
