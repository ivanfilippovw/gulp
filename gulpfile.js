const { src, dest, watch, parallel } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();

// Создание не минифицированного CSS файла
// function styles() {
//   return src('app/scss/style.scss') // откуда берем scss файлы
//     .pipe(scss()) // конвертируем и минифицируем scss в css
//     .pipe(dest('app/css')) // где создаем новый css файл
//     .pipe(browserSync.stream()) // перезагрузка страницы после изменений
// }

// Создание минифицированного CSS файла
function minifiedStyles() {
  return src('app/scss/style.scss') // откуда берем scss файлы
    .pipe(concat('style.min.css')) // переименовываем файл
    .pipe(scss({ outputStyle: 'compressed' })) // конвертируем и минифицируем scss в css
    .pipe(dest('app/css')) // где создаем новый css файл
    .pipe(browserSync.stream()) // перезагрузка страницы после изменений
}

// Создание минифицированного JS файла
function minifiedScripts() {
  return src('app/js/main.js') // откуда берем js файлы
    .pipe(concat('main.min.js')) // переименовываем файл
    .pipe(uglify()) // минифицируем js
    .pipe(dest('app/js')) // где создаем новый js файл
    .pipe(browserSync.stream()) // перезагрузка страницы после изменений
}

// Задача, чтобы следить за изменениями в файле
function watching() {
  watch(['app/scss/style.scss'], minifiedStyles) // следим если есть изменения в style.scss, то запускаем задачу minifiedStyles
  watch(['app/js/main.js'], minifiedScripts) // следим если есть изменения в main.js, то запускаем задачу minifiedScripts
  watch(['app/**/*.html']).on('change', browserSync.reload) // следим если есть изменений в любом html файле, то перезагружаем страницу
}

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
