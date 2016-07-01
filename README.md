# pav web
The placeavote webapp frontend HTML, CSS and JS.

Install dependencies with Node.js

	npm install

Run the javascript task runner Gulp.

	gulp

Run browser-sync for live browser experience with option to view on mobile if your device is connected to the same network.

	gulp browser-sync

Testing:

Testing is ran using a mocha js.
All Tests reside within the tests directory, which mirrors the src directory.
Run tests with:

	npm test

These tests include all unit tests and jscsrc/jshint styling configuration.

To recieve instance feedback the tests you are writing, use:

	mocha --watch [filename]

This will require instaling mocha globally.

All tests should be passing before submitting a pull request from branch -> master.
CircleCi will not deploy a broken build.
