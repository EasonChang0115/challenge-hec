var gulp = require('gulp');
//刪除工具
var del = require('del');
// 任務執行工具，可以讓任務依陣列順序執行
var sequence = require('gulp-sequence');
// 瀏覽器同步套件
var browserSync = require('browser-sync').create();
// js打包壓縮工具
var pump = require('pump');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
// css打包壓縮工具
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');



var paths = {
    packages: './node_modules',
    src: {
        css: './src/css',
        scss: './src/scss',
        js: './src/js'
    },
    dist: {
        css: './dist/css',
        js: './dist/js',
        font: './dist/fonts'
    }
};

// Run: gulp browser-sync
// Start Browsersync task
gulp.task('browser-sync', function() {
    browserSync.init({
        // 服務開啟
        // files: [
        //     paths.dist.css + '/*.css',
        //     paths.dist.js + '/*.js',
        //     'index.html',
        // ],
        // notify: true,
        // proxy: 'my.dev'

        // 因為是專案開發 我們看可以直接看當前目錄 
        server: {
            baseDir: "./"
        }
    });
});


// Run: gulp watch-bs
// Start watcher within Browsersync task
gulp.task('watch-bs', ['browser-sync', 'watch'], function(done) {
    browserSync.reload();
    done();
});


// Run: gulp vendor-scripts
// Uglifies and concat all vendor JavaScript files into one
gulp.task('vendor-scripts', function(callback) {
    let scripts = [
        // paths.packages + '/jquery/dist/jquery.js',
    ];
    pump([
        gulp.src(scripts),
        concat('vendor.js'),
        uglify({
            output: {
                comments: false
            }
        }),
        gulp.dest(paths.dist.js)
    ], callback);
});

// Run: gulp custom-scripts
// Uglifies and concat all source JavaScript files into one
gulp.task('custom-scripts', function(callback) {
    pump([
        gulp.src(paths.src.js + '/**/*.js'),
        concat('main.js'),
        uglify({
            output: {
                comments: false
            }
        }),
        gulp.dest(paths.dist.js)
    ], callback);
});


// Run: gulp sass
// Compile SCSS files into CSS files
gulp.task('scss', function(callback) {
    pump([
        gulp.src(paths.src.scss + '/**/*.scss'),
        sourcemaps.init({
            loadMaps: true
        }),
        sass(),
        autoprefixer({
            browsers: ['last 2 versions', 'last 3 Safari versions', 'Firefox >= 20', 'last 2 Explorer versions'],
            cascade: true,
            remove: true
        }),
        sourcemaps.write('./'),
        gulp.dest(paths.src.css)
    ], callback);
});

// Run: gulp minify-css
// Minify CSS files
gulp.task('minify-css', function(callback) {
    let sheets = [
        // paths.packages + '/bootstrap/dist/css/bootstrap.css',
        // paths.packages + '/animate.css/animate.css',
        // paths.packages + '/magnific-popup/dist/magnific-popup.css',
        // paths.packages + '/font-awesome/css/font-awesome.css',
        paths.src.css + '/**/*.css'
    ];

    pump([
        gulp.src(sheets),
        concat('main.css'),
        cleanCSS({
            // 相容模式，可以設定為'ie7',預設為''。
            compatibility: '*',
            level: {
                1: {
                    //註解不加入壓縮裡面
                    specialComments: false
                }
            }
        }),
        gulp.dest(paths.dist.css)
    ], callback);
});


// Run: gulp clean-src-path
// Empty src path
gulp.task('clean-compiled-css', function() {
    return del([paths.src.css]);
});


// Run: gulp styles
gulp.task('styles', function(callback) {
    sequence('clean-compiled-css', 'scss', 'minify-css')(callback);
});


// Run: gulp scripts
gulp.task('scripts', function(callback) {
    sequence('vendor-scripts', 'custom-scripts')(callback);
});

// Run: gulp watch
// Start watcher
gulp.task('watch', function() {
    gulp.watch([paths.src.scss + '/**/*.scss'], ['styles']);
    gulp.watch([paths.src.scss + '/**/**/*.scss'], ['styles']);
    gulp.watch([paths.src.scss + '/**/**/**/*.scss'], ['styles']);
    gulp.watch([paths.src.js + '/**/*.js'], ['scripts']);
});