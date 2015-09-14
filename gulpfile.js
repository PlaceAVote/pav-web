'use_strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	browserify = require('browserify'),
	sass = require('gulp-sass'),
	source = require('vinyl-source-stream'),
	maps = require('gulp-sourcemaps'),
	autoprefix = require('gulp-autoprefixer');
	browserSync = require('browser-sync').create();


 

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
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





gulp.task('default', ['watchFiles', 'browserify-web']);
