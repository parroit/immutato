/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var $ = loadPlugins({
    lazy: true
});

var tests = 'test/*.js';
var sources = 'lib/*.js';

function guard(op) {
    op.on('error', console.log.bind(console));
    return op;
}

gulp.task('test', function() {
    return gulp.src(tests)
        .pipe($.mocha({
            grep: '@perf',
            invert: true
        }));
});

gulp.task('cover', function(cb) {
    gulp.src(sources)
        .pipe($.istanbul()) // Covering files
        .on('finish', function() {
            gulp.src(tests)
                .pipe($.mocha({
                    grep: '@perf',
                    invert: true
                }))
                .pipe($.istanbul.writeReports()) // Creating the reports after tests runned
                .on('end', cb);
        });
});


gulp.task('perf', function() {
    return gulp.src('./test/*.js')
        .pipe($.mocha({
            grep: '@perf'
        }));
});

gulp.task('only', function() {
    return gulp.src('./test/*.js')
        .pipe($.mocha({
            grep: '@only'
        }));
});

gulp.task('watch', function() {
    gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['test']);
});


gulp.task('watch-only', function() {
    gulp.watch(['./lib/**/*.js', './test/**/*.js'], ['only']);
});

gulp.task('default', ['test', 'watch']);

gulp.task('test-travis', ['test', 'test-phantom-travis'],function(){
    require('./run-test-sauce');
});

var server;
gulp.task('serve-test', function() {
    server = $.serve({
        root: __dirname
    })();
});

gulp.task('test-phantom', ['build-test', 'serve-test'], function() {

    var stream = $.mochaPhantomjs();
    guard(stream);
    stream.write({
        path: 'http://localhost:3000/dist/test.html'
    });
    stream.end();
    setTimeout(function() {
      server.close();
    },1000);
    
    return stream;
});


gulp.task('test-phantom-travis', function() {

    var stream = $.mochaPhantomjs();
    guard(stream);
    stream.write({
        path: 'http://www.parro.it/immutato/test.html'
    });
    stream.end();
   
    
    return stream;
});


gulp.task('build', function() {

    return gulp.src('./lib/immutato.js')
        .pipe(guard($.pureCjs({
            exports: 'immutato',
            output: 'immutato.js'
        })))

    .pipe(gulp.dest('dist'));
});


gulp.task('deploy', function() {

    return gulp.src('./lib/immutato.js')
        .pipe(guard($.pureCjs({
            exports: 'immutato',
            output: 'immutato.min.js'
        })))
        .pipe($.streamify($.uglify()))
        .pipe(gulp.dest('dist'));
});




gulp.task('build-test', function() {

    return gulp.src('./test/all_test.js')
        .pipe($.pureCjs({
            output: 'immutato-test.js'
        }))
        // .pipe($.streamify($.uglify()))
        .pipe(gulp.dest('dist'));
});
