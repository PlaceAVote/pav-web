'use_strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	browserify = require('browserify'),
	minifycss = require('gulp-minify-css'),
	sass = require('gulp-sass'),
	source = require('vinyl-source-stream'),
	maps = require('gulp-sourcemaps'),
	minify = require('gulp-minify'),
	autoprefix = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(),
	imagemin = require('gulp-imagemin'), //image optimiser
	pngquant = require('imagemin-pngquant'), //png optimiser to work with imagemin
	mozjpeg = require('imagemin-mozjpeg');

  gulp.task('compress', function() {
    return gulp.src('./web/dist/js/app.js')
    .pipe(minify())
    .pipe(gulp.dest('./web/dist/js'));
  });

  gulp.task('live-config', function() {
    gulp.src(['./src/config/live_urls.js'])
    .pipe(rename('urls.js'))
    .pipe(gulp.dest('./src/config/'));
  });

  gulp.task('dev-config', function() {
    gulp.src(['./src/config/dev_urls.js'])
    .pipe(rename('urls.js'))
    .pipe(gulp.dest('./src/config/'));
  });

  // Website

  // Website Sass
  gulp.task('website-sass', function() {
    return gulp.src('./web/src/scss/*.scss')
    .pipe(sass({includePaths: ['./scss']}))
    .pipe(gulp.dest('./web/dist/css'));
  });

  gulp.task('website-autoPrefix', ['website-sass'], function() {
    return gulp.src('./web/dist/css/styles.css')
    .pipe(autoprefix())
    .pipe(minifycss())
    .pipe(gulp.dest('./web/dist/css'));
  });

  // Website Browserify
  gulp.task('browserify-website', function() {
    return browserify('./web/src/website.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./web/dist/js'));
  });

  // Website Imgs
  gulp.task('website-imgs', function() {
    return gulp.src('./web/src/img/**')
    .pipe(gulp.dest('./web/dist/img'));
  });

  gulp.task('website-fonts', function() {
    return gulp.src('./web/src/font/**')
    .pipe(gulp.dest('./web/dist/font'));
  });
  // Website HTML
  gulp.task('website-html', function(){
    return gulp.src('./web/src/partials/*.html')
    .pipe(gulp.dest('./web/dist/partials'));
  });

  gulp.task('index-html', function() {
    return gulp.src('./web/src/index.html')
    .pipe(gulp.dest('./web/dist/'));
  });

  gulp.task('download-folder', function() {
    return gulp.src('./web/src/downloads/**')
    .pipe(gulp.dest('./web/dist/downloads/'));
  });

  gulp.task('browser-sync-website', function() {
    browserSync.init({
      server: {
        baseDir: "./web/dist/"
      }
    });
    gulp.watch(["web/src/partials/*.html", "./web/dist/css/*.css", "./web/dist/js/*.js"]).on("change", browserSync.reload);
  });

  gulp.task('watch-website',  ['website-sass', 'index-html', 'website-fonts', 'browserify-website', 'website-imgs', 'website-html', 'download-folder', 'browser-sync-website'] , function() {
    gulp.watch(['./web/src/scss/*.scss','./web/src/website.js', './web/src/js/**/*', './web/src/index.html', './web/src/partials/*.html'], ['website-sass', 'index-html' ,'browserify-website', 'website-imgs', 'website-html']);
    gulp.watch(['./web/dist/css/*.css'], ['website-autoPrefix']);
  });

  gulp.task('build-site', ['index-html', 'website-fonts', 'browserify-website', 'website-imgs', 'website-html', 'download-folder', 'website-autoPrefix'],function() {
    return gulp.src('./web/dist/js/app.js')
    .pipe(minify())
    .pipe(gulp.dest('./web/dist/js'));
  });

  // Static server
  gulp.task('browser-sync', function() {
    browserSync.init({
      server: {
        baseDir: "./"
      }
    });
    gulp.watch(["partials/**/*","*.html", "css/*.css", "dist/js/*.js"]).on("change", browserSync.reload);
  });

  gulp.task('compileSass', function() {
    return gulp.src('./scss/*.scss')
    .pipe(maps.init())
    .pipe(sass({includePaths: ['./scss']}))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('./css'));
  });

  gulp.task('autoPrefix', ['compileSass'] , function() {
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

  gulp.task('app-min', function(){
    gulp.src('dist/js/app.js')
    .pipe(uglify())
    .pipe(minify())
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

  gulp.task('img-shrink', function () {
    return gulp.src(['./img_raw/**/*.png','./img_raw/**/*.svg','./img_raw/**/*.ico'])
    .pipe(imagemin({
      progressive: false,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./img'));
  });

  gulp.task('jpg-shrink', function() {
    return gulp.src(['./img_raw/**/**/*.jpeg', './img_raw/**/**/*.jpg'])
    .pipe(mozjpeg({quality: '75'})())
    .pipe(gulp.dest('./img'));
  });

  gulp.task('watchFiles', function() {
    gulp.watch('scss/**/**/*', ['autoPrefix']);
    gulp.watch(['src/**/*.js', 'src/*.js'], ['browserify-web']);
    gulp.watch('partials/**/*');
  });

  gulp.task('watchIonic', function() {
    gulp.watch(['src/**/*_ionic.js', 'src/*_ionic.js', 'src/ionic-app.js', 'partials/*_ionic.html'], ['ionicise']);
  });

  gulp.task('default', ['autoPrefix', 'watchFiles', 'browserify-web']);
