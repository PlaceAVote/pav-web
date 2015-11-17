#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."


gulp autoPrefix
gulp live-config
gulp browserify-web
gulp app-min

echo "-- Deploying to environment..."


label=$(date +%s)
file="pav-web-dev.zip"
bucket="pav-web-app"
application="pav-web-dev"
reg="us-west-2"

zip -r ${file} ./* -x '*.git*' -x '*node_modules/*' -x '*scripts/*' -x '*test/*' -x '*scss/*' -x '*src/*' -x '*gulpfile.js' -x '*README.md*' -x '*circle.yml*'


echo "Uploading zip to S3"
aws s3api put-object --bucket ${bucket} --key ${file} --body ${file}

echo "Creating Application Version Elasticbeanstalk Instance"
aws --region ${reg} elasticbeanstalk create-application-version --application-name ${application} --version-label ${label} --source-bundle S3Bucket=${bucket},S3Key=${file} --auto-create-application

echo "Updating Environment"
aws --region ${reg} elasticbeanstalk update-environment --environment-name ${application} --version-label ${label}

echo "Deploying to Convox"
curl -Ls https://install.convox.com/linux.zip > /tmp/convox.zip
sudo unzip /tmp/convox.zip -d /usr/local/bin
convox login convox-pav-dev-629155429.us-east-1.elb.amazonaws.com --password DjJRSfKPKmAsZRlEsjDNDNCxBCjNtQ
convox deploy
echo "Deployed to Convox"
