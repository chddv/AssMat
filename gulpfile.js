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

gulp.task('script_copys_html', () => {
  // copy les fichiers HTML
  return gulp.src('src/client/html/*.html')
        .pipe(gulp.dest('dist/public/')); 
});

gulp.task('script_copys_html_imgs', () => {
  // copy les fichiers HTML
  return gulp.src('src/client/html/img/*.png')
        .pipe(gulp.dest('dist/public/img/')); 
});

gulp.task('script_copys_html_pages', () => {
  // copy les fichiers HTML
  return gulp.src('src/client/html/pages/*.html')
        .pipe(gulp.dest('dist/public/pages/')); 
});

gulp.task('script_copys_js', () => {
  // copy les fichiers HTML
  return gulp.src('src/client/html/js/*.js')
        .pipe(gulp.dest('dist/public/js/')); 
});

gulp.task('script_copys_css', () => {
  // copy les fichiers HTML
  return gulp.src('src/client/html/css/*.css')
        .pipe(gulp.dest('dist/public/css/')); 
});

gulp.task('script_copys_js_type', () => {
  // copy les fichiers HTML
  return gulp.src('dist/types/*.js')
        .pipe(gulp.dest('dist/public/js/')); 
});


//set up a watcher to watch over changes
gulp.task('watch_ts', ['scripts_ts','script_copys_html', 'script_copys_html_imgs','script_copys_html_pages','script_copys_js','script_copys_css', 'script_copys_js_type'], () => {
  gulp.watch('src/**/*.ts', ['scripts_ts']);
  gulp.watch('src/client/html/*.html', ['script_copys_html']);
  gulp.watch('src/client/html/img/*.png', ['script_copys_html_imgs']);
  gulp.watch('src/client/html/pages/*.html', ['script_copys_html_pages']);
  gulp.watch('src/client/html/js/*.js', ['script_copys_js']);
  gulp.watch('src/client/html/css/*.css', ['script_copys_css']);
  gulp.watch('dist/types/*.js', ['script_copys_js_type']);
});


gulp.task('default', ['watch_ts']);