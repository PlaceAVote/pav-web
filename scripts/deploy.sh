#!/usr/bin/env bash

set -e

echo "-- Building Web-app..."

gulp autoPrefix
gulp
gulp browserify-web
gulp app-min

echo "-- Building Web-app"
