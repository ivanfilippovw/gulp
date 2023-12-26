const {src, dest} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

// Создание не минифицированного CSS файла
// function styles() {
//   return src('app/scss/style.scss') // откуда берем scss файлы
//     .pipe(scss()) // конвертируем и минифицируем scss в css
//     .pipe(dest('app/css')) // где создаем новый css файл
// }

// Создание минифицированного CSS файла
function minifiedStyles() {
  return src('app/scss/style.scss') // откуда берем scss файлы
    .pipe(concat('style.min.css')) // переименовываем файл
    .pipe(scss({ outputStyle: 'compressed' })) // конвертируем и минифицируем scss в css
    .pipe(dest('app/css')) // где создаем новый css файл
}

// Создание минифицированного JS файла
function minifiedScripts() {
  return src('app/js/main.js') // откуда берем js файлы
    .pipe(concat('main.min.js')) // переименовываем файл
    .pipe(uglify()) // минифицируем js
    .pipe(dest('app/js')) // где создаем новый js файл
}

exports.minifiedScripts = minifiedScripts;
exports.minifiedStyles = minifiedStyles;
