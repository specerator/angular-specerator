var gulp = require('gulp'),
gp_concat = require('gulp-concat'),
gp_rename = require('gulp-rename'),
gp_uglify = require('gulp-uglify');
gp_sourcemaps = require('gulp-sourcemaps');

gulp.task('move', function(){
  return gulp.src(['bower_components/sails.io.js/dist/sails.io.js'])
  // .pipe(gp_sourcemaps.init())
  // .pipe(gp_concat('angular-specerator.js'))
  // .pipe(gulp.dest('dist'))
  // .pipe(gp_rename('angular-specerator.min.js'))
  // .pipe(gp_uglify())
  // .pipe(gp_sourcemaps.write('./'))
  .pipe(gulp.dest('dist'));
});

gulp.task('js-fef', function(){
  return gulp.src(['api.service.js'])
  .pipe(gp_sourcemaps.init())
  .pipe(gp_concat('angular-specerator.js'))
  .pipe(gulp.dest('dist'))
  .pipe(gp_rename('angular-specerator.min.js'))
  .pipe(gp_uglify())
  .pipe(gp_sourcemaps.write('./'))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['js-fef', 'move'], function(){});
