/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
  return gulp.src('./test/*.js')
    .pipe(mocha({grep:'@perf', invert: true}));
});

gulp.task('perf', function () {
  return gulp.src('./test/*.js')
    .pipe(mocha({grep: '@perf'}));
});

gulp.task('watch', function () {
  gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});

gulp.task('default', ['test', 'watch']);
