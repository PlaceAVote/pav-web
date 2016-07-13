'use_strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  browserify = require('browserify'),
  gulpBrowserify = require('gulp-browserify'),
  minifycss = require('gulp-minify-css'),
  sass = require('gulp-sass'),
  source = require('vinyl-source-stream'),
  maps = require('gulp-sourcemaps'),
  minify = require('gulp-minify'),
  autoprefix = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  imagemin = require('gulp-imagemin'), //image optimiser
  pngquant = require('imagemin-pngquant'), //png optimiser to work with imagemin
  mozjpeg = require('imagemin-mozjpeg'),
  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs'),
  gulpSequence = require('gulp-sequence'),
  mocha = require('gulp-mocha'),
  util = require('gulp-util'),
	svgSprite = require('gulp-svg-sprite');
  var stylish = require('jshint-stylish');
  var mustache = require('gulp-mustache');
  var clean = require('gulp-clean');
  var fs = require('fs');
  var ignore = require('gulp-ignore');

  var lintedPaths = ['./src/**/*.js', './*.js', '!./src/utils/metatags.js',
    '!./src/utils/location_update.js', '!./src/utils/fitie.js', '!./src/third_party_scripts.js'];

  gulp.task('lint:jshint', function() {
    return gulp.src(lintedPaths)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));

  });

  gulp.task('lint:jscs', function() {
    return gulp.src(lintedPaths)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
  });

  gulp.task('test', function() {
    return gulp.src(['test/**/*.js', '!test/features/**/*.js'], { read: false })
      .pipe(mocha({ reporter: 'spec' }))
      .on('error', util.log);
  });

  gulp.task('clean-index', function () {
      return gulp.src('./index.html', {read: false})
        .pipe(clean());
  });


  gulp.task('check', function(done) {
    gulpSequence('lint:jshint', 'lint:jscs', 'test', done);
  });

  gulp.task('template-prod', function() {
    return gulp.src('./index.mustache')
      .pipe(mustache('./app-path.json', { extension: '.html' }))
      .pipe(gulp.dest('./'));
  });

  gulp.task('template-dev', function() {
    return gulp.src('./index.mustache')
      .pipe(mustache('./app-path-dev.json', { extension: '.html' }))
      .pipe(gulp.dest('./'));
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
      .pipe(sass({includePaths: ['./scss'], outputStyle: 'compressed'}))
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

  gulp.task('browserify-init', function() {
    return	browserify('./src/initial_loads.js')
      .bundle()
      .pipe(source('initial_loads.js'))
      .pipe(gulp.dest('dist/js'));
  });

  gulp.task('browserify-tps', function() {
    return	browserify('./src/third_party_scripts.js')
      .bundle()
      .pipe(source('third_party_scripts.js'))
      .pipe(gulp.dest('dist/js'));
  });

  gulp.task('app-min', function(){
    return gulp.src('dist/js/*.js')
      .pipe(uglify())
      .pipe(minify())
      .pipe(gulp.dest('dist/js/'));
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

	gulp.task('svgsprites', function() {
		gulp.src('icons/*.svg')
		    .pipe(svgSprite({mode:{symbol:true}}))
		    .pipe(gulp.dest('img'));
	});

  gulp.task('default', ['autoPrefix', 'watchFiles', 'browserify-web', 'browserify-init', 'browserify-tps', 'template-dev']);
