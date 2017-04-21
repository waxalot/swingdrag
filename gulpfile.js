var gulp = require('gulp');
var webpack = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var browserSync = require('browser-sync').create();
var mocha = require('gulp-mocha');

var dirs = {
    src: 'src/',
    build: 'build/',
    dist: "dist/",
    vendor: "vendor/",
    nodeModules: "node_modules/"
};

var files = {
    tests: [dirs.src + '**/*.spec.ts']
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
        .pipe(gulp.dest("./src"));
});


/********************************************
 *  Testing 
 ********************************************/
gulp.task("test", ["build"], function (done) {
    return gulp.src(files.tests)
        .pipe(mocha().on('error', function (error) {
            console.log(error);
            done();
        }));
});


/********************************************
 *  Publish 
 ********************************************/
gulp.task("publish:vendor", function () {
    return gulp.src(dirs.vendor + "**/*")
        .pipe(gulp.dest(dirs.dist + dirs.vendor));
});

gulp.task("publish:jquery", function () {
    return gulp.src(dirs.nodeModules + "jquery/dist/jquery.min.js")
        .pipe(gulp.dest(dirs.dist + dirs.vendor + "jquery/"));
});

gulp.task("publish:demoPage", function () {
    return gulp.src("index.html")
        .pipe(gulp.dest(dirs.dist));
});

gulp.task("publish", ["publish:demoPage", "publish:jquery", "publish:vendor"], function () {
    return gulp.src(dirs.src + 'swingDragPlugIn.ts')
        .pipe(webpack(require('./webpack.config.js')))
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