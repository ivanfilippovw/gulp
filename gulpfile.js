const { src, dest, watch, parallel } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');

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
    .pipe(autoprefixer({ overrideBrowserslist: ['last 3 version'] })) // добавялем вендорные префиксы
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

// Функция задачи, чтобы следить за изменениями в файле
function watching() {
  watch(['app/scss/style.scss'], minifiedStyles) // следим если есть изменения в style.scss, то запускаем задачу minifiedStyles
  watch(['app/js/main.js'], minifiedScripts) // следим если есть изменения в main.js, то запускаем задачу minifiedScripts
  watch(['app/**/*.html']).on('change', browserSync.reload) // следим если есть изменений в любом html файле, то перезагружаем страницу
}

// Функция задачи, которая перезагружает страницу
function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
}

exports.minifiedScripts = minifiedScripts;
exports.minifiedStyles = minifiedStyles;
exports.watching = watching;
exports.browsersync = browsersync;

exports.default = parallel(minifiedStyles, minifiedScripts, browsersync, watching);
