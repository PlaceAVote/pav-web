#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

gulp autoPrefix
gulp dev-config
gulp browserify-web
gulp browserify-init
gulp app-min
gulp template-prod
gulp svgsprites

echo "-- Building Web-app"
