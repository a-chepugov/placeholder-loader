const gulp = require('gulp');

const {name, version} = require('./package.json');

const paths = {
	source: './source/**/!(*test).js',
	doc: 'doc'
};

gulp.task('docs:md', function () {
	const gulpDocumentation = require('gulp-documentation');
	return gulp.src(paths.source)
		.pipe(gulpDocumentation('md', {}, {name, version}))
		.pipe(gulp.dest(paths.doc));
});

gulp.task('docs:html', function () {
	const gulpDocumentation = require('gulp-documentation');
	return gulp.src(paths.source)
		.pipe(gulpDocumentation('html', {}, {name, version}))
		.pipe(gulp.dest(paths.doc));
});

gulp.task('docs:watch', () => {
	const watcher = gulp.watch(paths.source, gulp.series('docs:html'));
	watcher.on('change', function (path) {
		console.info(`File${path} was changed`);
	});
	return watcher;
});
