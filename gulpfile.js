const gulp = require('gulp');
const ts = require('gulp-typescript');

// pull in the project Typescript config
const tsProject = ts.createProject('tsconfig.json');
//task to be run when the watcher detects changes
//gulp.task('scripts', () => {
  // copy les fichiers HTML
//  gulp.src('src/client/html/**/*')
//        .pipe(gulp.dest('dist/public/'));
//  const tsResult = tsProject.src()
//  .pipe(tsProject());
//  return tsResult.js.pipe(gulp.dest('dist')); 
//});

gulp.task('scripts_ts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist')); 
});

gulp.task('script_copys', () => {
  // copy les fichiers HTML
  return gulp.src('src/client/html/**/*')
        .pipe(gulp.dest('dist/public/')); 
});

//set up a watcher to watch over changes
gulp.task('watch_ts', ['scripts_ts','script_copys'], () => {
  gulp.watch('src/**/*.ts', ['scripts_ts']);
  gulp.watch('src/client/html/*.html', ['script_copys']);
  gulp.watch('src/client/html/js/*.js', ['script_copys']);
  gulp.watch('src/client/html/css/*.css', ['script_copys']);
});


gulp.task('default', ['watch_ts']);