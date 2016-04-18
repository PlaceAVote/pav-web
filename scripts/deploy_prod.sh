#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

gulp autoPrefix
gulp live-config
gulp browserify-web
gulp app-min
gulp template-prod
gulp template-prod-server

echo "-- Building Web-app"
