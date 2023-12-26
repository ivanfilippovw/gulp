const {src, dest} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');

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

exports.minifiedStyles = minifiedStyles;
