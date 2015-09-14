'use_strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
	autoprefix = require('gulp-autoprefixer');
	browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            // Tunnel the Browsersync server through a random Public URL
// -> http://randomstring23232.localtunnel.me
tunnel: true,

// Attempt to use the URL "http://my-private-site.localtunnel.me"
tunnel: "pavappdev"
        }
    });
    gulp.watch(["*.html", "css/*.css", "dist/js/*.js"]).on("change", browserSync.reload);
});



gulp.task('compileSass', function() {
return gulp.src('./scss/*.scss')
	.pipe(maps.init())
	.pipe(sass({includePaths: ['./scss']}))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('./css'));
});

gulp.task('autoPrefix', ['compileSass'], function() {
return gulp.src('css/styles.css')
			.pipe(autoprefix())
			.pipe(gulp.dest('css'));
});

gulp.task('browserify-web', function() {
	return	browserify('./src/web-app.js')
		.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('ionicise', function(){
	gulp.src(['img/*'])
	.pipe(gulp.dest('pav_ionic/www/img'));
	gulp.src(['css/*.css'])
	.pipe(gulp.dest('pav_ionic/www/css'));
	gulp.src(['partials/*_ionic.html'])
	.pipe(gulp.dest('pav_ionic/www/partials'));
	gulp.src(['index_ionic.html'])
	.pipe(rename('index.html'))
	.pipe(gulp.dest('pav_ionic/www/'));
        browserify('./src/ionic-app.js')
	.bundle()
	.pipe(source('mobile-app.js'))
	.pipe(gulp.dest('pav_ionic/www/dist/js'));
});

//can be removed
gulp.task('concatScripts', function() {
return gulp.src([
	'js/jquery.js',
	'node_modules/angular/angular.min.js',
	'node_modules/angular-resource/angular-resource.min.js',
	'node_modules/angular-route/angular-route.min.js',
	'node_modules/angular-animate/angular-animate.min.js',
	'node_modules/mailcheck/src/mailcheck.min.js',
	'js/web-app.js',
	'js/',
	'!js/tests/*.js'
	])
	.pipe(concat('app.js'))
	.pipe(gulp.dest('dist/js'));
});

gulp.task('watchFiles', function() {
	gulp.watch('scss/*.scss', ['compileSass']);
	gulp.watch('css/*.css', ['autoPrefix']);
	gulp.watch(['src/**/*.js', 'src/*.js'], ['browserify-web']);
	gulp.watch('partials/*.html');
});

gulp.task('watchIonic', function() {
	gulp.watch(['src/**/*_ionic.js', 'src/*_ionic.js', 'src/ionic-app.js', 'partials/*_ionic.html'], ['ionicise']);
});





gulp.task('default', ['watchFiles', 'browserify-web']);
