'use_strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
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

gulp.task('concatScripts', function() {
return gulp.src([
	'node_modules/angular/angular.min.js',
	'node_modules/angular-resource/angular-resource.min.js',
	'js/**/*.js',
	'!js/jquery.js'
	])
	.pipe(concat('app.js'))
	.pipe(gulp.dest('dist/js'));
});

gulp.task('watchFiles', function() {
	gulp.watch('scss/*.scss', ['compileSass']);
	gulp.watch('css/*.css', ['autoPrefix']);
	gulp.watch(['js/**/*.js', 'js/*.js'], ['concatScripts']);
});





gulp.task('default', ['watchFiles', 'concatScripts']);