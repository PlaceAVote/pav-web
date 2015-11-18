#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."


gulp autoPrefix
gulp live-config
gulp browserify-web
gulp app-min

echo "-- Deploying to environment..."

echo "Deploying to Convox"
curl -Ls https://install.convox.com/linux.zip > /tmp/convox.zip
sudo unzip /tmp/convox.zip -d /usr/local/bin
convox login convox-pav-dev-629155429.us-east-1.elb.amazonaws.com --password DjJRSfKPKmAsZRlEsjDNDNCxBCjNtQ
convox deploy
echo "Deployed to Convox"
