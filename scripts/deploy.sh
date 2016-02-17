#!/usr/bin/env bash

set -e

bucket="$1"

echo "-- Deploying to Envionrment... $1"

echo "Uploading zip to S3"
aws s3api put-object --bucket ${bucket} --key index.html --body index.html --content-type text/html --acl public-read
aws s3api put-object --bucket ${bucket} --key dist/js/app-min.js --body ./dist/js/app-min.js --acl public-read
aws s3api put-object --bucket ${bucket} --key css/styles.css --body ./css/styles.css --content-type text/css  --acl public-read

FILES="partials/*.html partials/*/*.html  font/* img/*.png img/*.svg img/*/*.svg img/*/*.png"
for f in $FILES
do
  echo ${f}
  if [[ ${f} == *".svg"* ]]
  then
    aws s3api put-object --bucket ${bucket} --key ${f} --body ${f}  --content-type image/svg+xml --acl public-read
  elif [[ ${f} == *".png"* ]]
  then
    aws s3api put-object --bucket ${bucket} --key ${f} --body ${f} --content-type image/png --acl public-read
  elif [[ ${f} == *".html"* ]]
  then
    aws s3api put-object --bucket ${bucket} --key ${f} --body ${f} --content-type text/html  --acl public-read
  else
    aws s3api put-object --bucket ${bucket} --key ${f} --body ${f} --acl public-read
  fi
done
