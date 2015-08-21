'use_strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
	autoprefix = require('gulp-autoprefixer');
// 	browserSync = require('browser-sync').create();

// // Static server
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         server: {
//             baseDir: "./"
//         }

//     });
//     gulp.watch("*.html").on("change", browserSync.reload);
// });



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

gulp.task('concatScripts', function() {
return gulp.src([
	// 'node_modules/angular/angular.min.js',
	'js/*.js',
	'js/**/*.js'
	])
	.pipe(concat('app.js'))
	.pipe(gulp.dest('dist/js'));
});

gulp.task('watchFiles', function() {
	gulp.watch('scss/*.scss', ['autoPrefix']);
	gulp.watch(['js/**/*.js', 'js/*.js'], ['concatScripts']);
});





gulp.task('default', ['watchFiles', 'concatScripts']);