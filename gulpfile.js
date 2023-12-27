const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
// const autoprefixer = require('gulp-autoprefixer'); // 8.0.0 надо
// import gulp from 'gulp';
// import autoprefixer from 'gulp-autoprefixer';
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');

// Функция задачи для изменения формата изначальных картинок и уменьшения их веса
function images() {
  return src(['app/images/src/**/*.*', '!app/images/src/**/*.svg'])
    .pipe(newer('app/images/dist'))
    .pipe(avif({ quality: 50 }))

    .pipe(src('app/images/src/**/*.*'))
    .pipe(newer('app/images/dist'))
    .pipe(webp())

    .pipe(src('app/images/src/**/*.*'))
    .pipe(newer('app/images/dist'))
    .pipe(imagemin())

    .pipe(dest('app/images/dist'))
}

// Функция задачи, которая делает из уже уменьшенных по весу svg иконок sprite (stack)
function sprite() {
  return src('app/images/dist/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest('app/images/dist/svg'))
}

// Функция задачи, создания не минифицированного CSS файла
// function styles() {
//   return src('app/scss/style.scss') // откуда берем scss файлы
//     .pipe(autoprefixer({ overrideBrowserslist: ['last 3 version'] })) // добавялем вендорные префиксы
//     .pipe(scss()) // конвертируем и минифицируем scss в css
//     .pipe(dest('app/css')) // где создаем новый css файл
//     .pipe(browserSync.stream()) // перезагрузка страницы после изменений
// }

// Функция задачи создания минифицированного CSS файла
function minifiedStyles() {
  return src('app/scss/style.scss') // откуда берем scss файлы
    //.pipe(autoprefixer({
    //  overrideBrowserslist: ['last 3 version']
    // })) // добавялем вендорные префиксы
    .pipe(concat('style.min.css')) // переименовываем файл
    .pipe(scss({ outputStyle: 'compressed' })) // конвертируем и минифицируем scss в css
    .pipe(dest('app/css')) // где создаем новый css файл
    .pipe(browserSync.stream()) // перезагрузка страницы после изменений
}

// Функция задачи создания минифицированного JS файла
function minifiedScripts() {
  return src([
    // 'node_modules/swiper/swiper-bundle.js', // если понадобится много файлов js подключать
    'app/js/main.js'

    // 'app/js/**/*.js',
    // '!app/js/main.min.js'
    ]) // откуда берем js файлы
    .pipe(concat('main.min.js')) // переименовываем файл
    .pipe(uglify()) // минифицируем js
    .pipe(dest('app/js')) // где создаем новый js файл
    .pipe(browserSync.stream()) // перезагрузка страницы после изменений
}

// Функция задачи, чтобы следить за изменениями в файле и перезагружать страницу
function watching() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
  watch(['app/images/src'], images) // следим если есть изменения в папке src, то запускаем задачу images
  watch(['app/scss/style.scss'], minifiedStyles) // следим если есть изменения в style.scss, то запускаем задачу minifiedStyles
  watch(['app/js/main.js'], minifiedScripts) // следим если есть изменения в main.js, то запускаем задачу minifiedScripts
  watch(['app/**/*.html']).on('change', browserSync.reload) // следим если есть изменений в любом html файле, то перезагружаем страницу
}

// Функция задачи удаления папки dist
function cleanDist() {
  return src('dist')
    .pipe(clean())
}

function building() {
  return src([
    'app/fonts/*.*',
    'app/images/dist/**/*.*',
    '!app/images/dist/**/*.svg',
    '!app/images/dist/svg/stack/*.*',
    'app/images/dist/svg/sprite.svg',
    'app/css/style.min.css',
    'app/js/main.min.js',
    'app/*.html'
  ], {base : 'app'})
  .pipe(dest('dist'))
}

exports.images = images;
exports.sprite = sprite;
exports.minifiedStyles = minifiedStyles;
exports.minifiedScripts = minifiedScripts;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(images, sprite, minifiedStyles, minifiedScripts, watching);
