'use_strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
	autoprefix = require('gulp-autoprefixer');


gulp.task('compileSass', function() {
return gulp.src('scss/styles.scss')
	.pipe(maps.init())
	.pipe(sass())
	.pipe(maps.write('./'))
	.pipe(gulp.dest('css'));
});

gulp.task('autoPrefix', ['compileSass'], function() {
	return gulp.src('css/styles.css')
			.pipe(autoprefix())
			.pipe(gulp.dest('css'));
});

gulp.task('watchFiles', function() {
	gulp.watch('scss/*.scss', ['autoPrefix']);
	gulp.watch('html/login.html');
});





gulp.task('default', ['watchFiles']);