var gulp = require('gulp');
var fs = require('fs');
var minimist = require('minimist');

var args = minimist(process.argv.slice(3));
var fileName = args._[0];

gulp.task('tritt-export', function(fileName) {
	console.log(fileName);
});