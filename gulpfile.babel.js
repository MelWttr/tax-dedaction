const webpack = require('webpack-stream');
const gulp = require('gulp');

const pug = require('gulp-pug');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const csso = require('gulp-csso');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const del = require('del');
const rename = require('gulp-rename');

const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const svgstore = require('gulp-svgstore');

const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const webpackConfig = require('./webpack.config');

const server = browserSync.create();

const html = (done) => {
  gulp.src('source/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
    }))
    .pipe(gulp.dest('build'));
  done();
};

exports.html = html;

const css = (done) => {
  gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(csso())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
  done();
};

exports.css = css;

const clean = () => del('build');

exports.clean = clean;

const copy = (done) => {
  gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**/*',
    '!source/img/sprite/*',
    '!source/img/sprite',
  ], {
    base: 'source',
  })
    .pipe(gulp.dest('build'));
  done();
};

exports.copy = copy;

const sprite = (done) => {
  gulp.src('source/img/sprite/*.svg')
    .pipe(svgstore({
      inlineSvg: true,
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
  done();
};

exports.sprite = sprite;

const js = (done) => {
  gulp.src('source/js/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build/js'));
  done();
};
exports.js = js;

const serve = (done) => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css', 'refresh'));
  gulp.watch('source/**/*.pug', gulp.series('html', 'refresh'));
  gulp.watch('source/img/**/*', gulp.series('copy', 'sprite', 'html', 'refresh'));
  gulp.watch('source/js/**/*', gulp.series('js', 'refresh'));

  done();
};

exports.serve = serve;

const refresh = (done) => {
  server.reload();
  done();
};

exports.refresh = refresh;

// Таски для отпимизации изображений
const images = (done) => {
  gulp.src('build/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
        ],
      }),
    ]))
    .pipe(gulp.dest('build/img'))
  done();
};

exports.images = images;

const svg = () => {
  gulp.src('source/img/sprite/*.svg')
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
        ],
      }),
    ]))
    .pipe(gulp.dest('source/img/sprite'));
};

exports.svg = svg;

const build =
  gulp.series(
    clean,
    gulp.parallel(
      copy,
      css,
    ),
    gulp.parallel(
      sprite,
      images,
    ),
    gulp.parallel(
      html,
      js,
    ),
  )

exports.build = build;

const start =
  gulp.series(
    clean,
    gulp.parallel(
      copy,
      css
    ),
    gulp.parallel(
      sprite
    ),
    gulp.parallel(
      html,
      js
    ),
    serve
  )

exports.start = start;
