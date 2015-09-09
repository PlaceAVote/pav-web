#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

gulp browserify-web

echo "-- Deploying to environment..."

timestamp() {
  date +"%s"
}

label=timestamp
file="pav-web-dev.zip"
bucket="pav-web-app"
application="pav-web-dev"
reg="us-west-2"

zip -r ${file} ./* -x '*.git*' -x '*node_modules/*' -x '*scripts/*' -x '*test/*' -x '*scss/*' -x '*src/*' -x '*gulpfile.js' -x '*README.md*' -x '*circle.yml*'


echo "Uploading zip to S3"
aws s3api put-object --bucket ${bucket} --key ${file} --body ${file}

echo "Updating Elasticbeanstalk Instance"
aws --region ${reg} elasticbeanstalk create-application-version --application-name ${application} --version-label ${label} --source-bundle S3Bucket=${bucket},S3Key=${file} --auto-create-application 
