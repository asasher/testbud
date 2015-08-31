var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    gutil = plugins.util,
    del = require('del');
    vinylPaths = require('vinyl-paths');
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync');

var appDir = '';

var paths = {
    scss : appDir,
    css : appDir,
    js : appDir,
    bower : appDir + 'bower_components/',
    html : appDir
}

var files = {
    scss : paths.scss + '*.scss',
    css : paths.css + '*.css',
    js : paths.js + '*.js',
    html : paths.html + '*.html'
}


//utility functions
var logErr = function (err) {
    gutil.log('[',gutil.colors.red('>_<'),'] ', err);
};

var logMsg = function (msg) {
    gutil.log('[',gutil.colors.blue('-_-'),'] ', msg);
}

//styles
gulp.task('compile-scss' , function () {
    return gulp.src(files.scss)
            .pipe(plugins.sass().on('error', logErr))
            .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(gulp.dest(paths.css))
            .pipe(browserSync.stream());
});

//clean
gulp.task('clean', function(cb) {
    return gulp.src(files.css)
            .pipe(vinylPaths(del()));
});

//build
gulp.task('build', function() {
    runSequence('compile-scss');
});

//serve
gulp.task('serve', ['build'], function() {
    browserSync({
        server: {
            baseDir: appDir
        }
    });

    gulp.watch(files.scss, ['compile-scss']);
    gulp.watch(files.html).on('change', browserSync.reload);
});

//default
gulp.task('default',function() {
    runSequence('serve');
});

