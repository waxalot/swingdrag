'use strict';

var gulp = require('gulp');
var webpack = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var browserSync = require('browser-sync').create();
var mocha = require('gulp-mocha');
var sass = require('gulp-sass');

var dirs = {
    src: 'src/',
    build: 'build/',
    dist: "dist/",
    vendor: "vendor/",
    nodeModules: "node_modules/",
    tests: "tests/",
    config: "config/",
    release: "release/",
    debug: "debug/",
    css: "css/"
};


/********************************************
 *  Build
 ********************************************/
gulp.task("build", function () {
    return gulp.src([dirs.src + "**/*.ts"])
        .pipe(sourcemaps.init())
        .pipe(ts({
            "target": "es5",
            "module": "commonjs",
            "sourceMap": true,
            "noImplicitAny": true,
            "preserveConstEnums": true,
            "moduleResolution": "node",
            "removeComments": true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dirs.build + dirs.src));
});


/********************************************
 *  Testing 
 ********************************************/
gulp.task("build:tests", ["build"], function () {
    return gulp.src([dirs.tests + "**/*.spec.ts"])
        .pipe(sourcemaps.init())
        .pipe(ts({
            "target": "es5",
            "module": "commonjs",
            "sourceMap": true,
            "noImplicitAny": true,
            "preserveConstEnums": true,
            "moduleResolution": "node",
            "removeComments": true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dirs.build + dirs.tests));
});

gulp.task("test", ["build:tests"], function (done) {
    return gulp.src(dirs.build + dirs.tests + "**/*.spec.js")
        .pipe(mocha().on('error', function (error) {
            console.log(error);
            done();
        }));
});


/********************************************
 *  Publish 
 ********************************************/
gulp.task("publish:jquery", function () {
    return gulp.src(dirs.nodeModules + "jquery/dist/jquery.min.js")
        .pipe(gulp.dest(dirs.dist + dirs.vendor + "jquery/"));
});

gulp.task("publish:jquery-ui", function () {
    return gulp.src(dirs.nodeModules + "jquery-ui-dist/jquery-ui.min.js")
        .pipe(gulp.dest(dirs.dist + dirs.vendor + "jquery-ui/"));
});

gulp.task("publish:demoPage", function () {
    return gulp.src("index.html")
        .pipe(gulp.dest(dirs.dist));
});

gulp.task("publish:sass", function () {
    return gulp.src(dirs.src + dirs.css + '**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dirs.dist + dirs.css));
});

gulp.task("publish", ["publish:demoPage", "publish:sass", "publish:jquery", "publish:jquery-ui"], function () {
    return gulp.src(dirs.src + 'index.ts')
        .pipe(webpack(require('./' + dirs.config + dirs.release + 'webpack.config.js')))
        .pipe(gulp.dest(dirs.dist + dirs.src));
});

gulp.task("publish:debug", function () {
    return gulp.src(dirs.src + 'swingDragPlugIn.ts')
        .pipe(webpack(require('./' + dirs.config + dirs.debug + 'webpack.config.js')))
        .pipe(gulp.dest(dirs.dist));
});

/********************************************
 *  Serve
 ********************************************/
gulp.task("serve", ["publish"], function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        browser: "chrome",
        files: [
            "dist/**/*",
            "index.html"
        ]
    });
});