var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

gulp.task('clean:dist', function(){
  return del.sync('client/build');
});
gulp.task('minJS', function(){
  return gulp.src('client/javascripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('client/build/javascripts'));
});
gulp.task('minCSS', function(){
  return gulp.src('client/stylesheets/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('client/build/stylesheets'));
});
gulp.task('icons', function(){
  return gulp.src('client/icons/*')
    .pipe(gulp.dest('client/build/icons'));
});
gulp.task('html', function(){
  return gulp.src('client/*.html')
    .pipe(gulp.dest('client/build'));
});
gulp.task('build', ['minJS', 'minCSS', 'icons', 'html'], function(){

});
