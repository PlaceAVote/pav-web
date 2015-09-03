# pav web
The placeavote webapp frontend HTML, CSS and JS.

Install dependencies with Node.js

	npm install

Run the javascript task runner Gulp.

	gulp

Run browser-sync for live browser experience with option to view on mobile if your device is connected to the same network.

	gulp browser-sync

or you can use htto-server

	http-server -o

You must provide a valid email and password containing a minimum of 8 characters that consists of at least one digit and one uppercase character. 

Testing:

	Testing is ran using a combination of Karma, PhantomJS and Jasmine.
	All Tests reside within the js/tests directory.
	Run tests with:
	
		npm test

	All tests should be passing before submitting a pull request from branch -> master.
	
