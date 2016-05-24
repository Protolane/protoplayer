var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require("gulp-rename"),
  exec = require('child_process').exec;

gulp.task('scss', function() {
  gutil.log('Generating CSS');

  return gulp.src('app/scss/multiplayer.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        style: 'compressed'
      }).on('error', sass.logError))
      .pipe(rename('styles.min.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./app'));
});

gulp.task('default', ['scss'], function() {
  exec(
    'electron main.js',
    function(error, stdout, stderr) {
      stdout.on('data', function (data) {
        gutil.log(data);
      });

      stderr.on('data', function (data) {
        gutil.log(data);
      });
    });
    gulp.watch('app/scss/**/*.scss', ['scss']);
});
