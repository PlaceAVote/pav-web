#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

gulp browserify-web

echo "-- Deploying to environment..."

file="pav-web-dev.zip"
bucket="pav-web-app"
application-name="pav-web-dev"

zip -r ${file} ./* -x '*.git*' -x '*node_modules/*' -x '*scripts/*' -x '*test/*' -x '*scss/*' -x '*src/*' -x '*gulpfile.js' -x '*README.md*' -x '*circle.yml*'


echo "Uploading zip to S3"
aws s3api put-object --bucket ${bucket} --key ${file} --body ${file}

echo "Updating Elasticbeanstalk Instance"
aws elasticbeanstalk update-application --application-name ${application-name}