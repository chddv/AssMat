const gulp = require('gulp');
const ts = require('gulp-typescript');

// pull in the project Typescript config
const tsProject = ts.createProject('tsconfig.json');
//task to be run when the watcher detects changes
gulp.task('scripts', () => {
  // copy les fichiers HTML
  gulp.src('src/client/html/**/*')
        .pipe(gulp.dest('dist/public/'));
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist')); 
});
//set up a watcher to watch over changes
gulp.task('watch', ['scripts'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
  gulp.watch('src/client/html/*.html', ['scripts']);
  gulp.watch('src/client/html/js/*.js', ['scripts']);
  gulp.watch('src/client/html/css/*.css', ['scripts']);
});


gulp.task('default', ['watch']);