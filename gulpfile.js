var gulp = require('gulp'),
  less = require('gulp-less'),
  concat = require('gulp-concat'),
  copy = require('gulp-copy'),
  clean = require('gulp-clean'),
  useref = require('gulp-useref'),
  uglify = require('gulp-uglify'),
  gulpIf = require('gulp-if'),
  cssnano = require('gulp-cssnano'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  htmlmin = require('gulp-htmlmin'),
  del = require('del'),
  rev = require('gulp-rev'),
  revReplace = require('gulp-rev-replace'),
  filter = require('gulp-filter'),
  proxyMiddleware = require('http-proxy-middleware'),
  browserSync = require('browser-sync').create();

var lessFiles = ["app/css/**/*.less", "app/directives/**/*.less", "app/layouts/**/*.less", "app/pages/**/*.less"];

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: './app',
      middleware: [proxy]       // add the proxy to browser-sync
    },
    port: 9000,
    ui: false
  })
});

var proxy = proxyMiddleware('/api', {
  target: 'http://localhost:4000',
  changeOrigin: true   // for vhosted sites, changes host header to match to target's host
});

gulp.task('watch', ['browserSync'], function () {
  gulp.watch(lessFiles, ['less', browserSync.reload]);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/**/*.js', browserSync.reload);
});

// Compile less into CSS & auto-inject into browsers
gulp.task('less', function () {
  return gulp.src(lessFiles)
    .pipe(less())
    .pipe(concat('css/style.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('useref', function () {
  var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });
  return gulp.src('./*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(indexHtmlFilter)
    .pipe(rev())
    .pipe(indexHtmlFilter.restore)
    .pipe(revReplace())
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('./images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/bp-icon-fonts/**/*.+(eot|svg|ttf|woff)')
    .pipe(gulp.dest('dist/css'))
});

gulp.task('minify', function() {
  return gulp.src(['app/**/*.html', '!app/bp-icon-fonts/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/core'));
});

// build project
//gulp.task('copy', ['clean'], function () {
//  return gulp.src(['core/**/*', 'images/**/*', 'bower_components/**/*'], {
//    base: './'
//  }).pipe(gulp.dest('build'));
//});
//
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('default', ['less', 'watch']);
gulp.task('build', ['clean:dist','images', 'fonts', 'useref', 'minify']);
