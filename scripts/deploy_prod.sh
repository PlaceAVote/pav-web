#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

gulp autoPrefix
gulp live-config
gulp browserify-web
gulp browserify-init
gulp browserify-tps
gulp app-min
gulp template-prod
gulp svgsprites

echo "-- Building Web-app"
