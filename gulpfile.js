var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
 
gulp.task('browserify', function() {
    return browserify('./src/initialize.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('drig.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./example/'));
});
var gutil = require('gutil');
//Start the local server.
gulp.task('serve', startExpress);
//Start an express local server in order to be able to serve the example app.
function startExpress() {
  var express = require('express');
  var app = express();
  app.use(express.static(__dirname + '/example/'));
  app.listen(4000);
  gutil.log('Express server, serving example at http://localhost:4000');
}