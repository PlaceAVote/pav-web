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

#pav ionic

Install dependencies

	npm install

Install ionic & cordova

	sudo npm install -g cordova ionic

Create the ionic app

	ionic start pav_ionic

The name here is very important so make sure it's right.  Other naming conventions include naming specific
ionic only files (eg. index_ionic.html) to have a trailing _ionic attatched before the file type.

Run the gulp tak

	gulp ionicise

Finally jump into the pav_ionic folder and run the emulate function:

	cd pav_ionic && ionic emulate ios

By default ionic adds the ios platform to the project.  However, you must be running OSX and XCode installed.
To run android versions refer see [here] (http://cordova.apache.org/docs/en/3.3.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide)
