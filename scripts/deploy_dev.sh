#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

gulp autoPrefix
gulp dev-config
gulp browserify-web
gulp app-min
gulp template-prod
gulp template-dev-server

echo "-- Building Web-app"
