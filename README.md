# pav web
The placeavote webapp frontend HTML, CSS and JS.

Install dependencies with Node.js

	npm install

Run the javascript task runner Gulp.

	gulp

Run browser-sync for live browser experience with option to view on mobile if your device is connected to the same network.

	gulp browser-sync

or you can use http-server

	http-server -o

You must provide a valid email and password containing a minimum of 8 characters that consists of at least one digit and one uppercase character. 

Testing:

Testing is ran using a mocha js.
All Tests reside within the tests directory, which mirrors the src directory.
Run tests with:
	
	npm test

To recieve instance feedback the tests you are writing, use:
	
	mocha --watch [filename]


All tests should be passing before submitting a pull request from branch -> master.
	
