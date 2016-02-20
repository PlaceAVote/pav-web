#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

gulp autoPrefix
gulp live-config
gulp browserify-web
gulp app-min
gulp template-prod

echo "-- Building Web-app"
. scripts/deploy.sh beta.placeavote.com
