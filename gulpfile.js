const gulp = require('gulp');

const package = require('./package.json');
const {name, version} = package;

const paths = {
	source: './index.js',
	doc: 'doc',
};

gulp.task('clean', () => {
	const del = require('del');
	return del([paths.doc]);
});

gulp.task('documentation-md', function () {
	const gulpDocumentation = require('gulp-documentation');
	return gulp.src(paths.source)
		.pipe(gulpDocumentation('md', {}, {name, version}))
		.pipe(gulp.dest(paths.doc));
});

gulp.task('documentation-html', function () {
	const gulpDocumentation = require('gulp-documentation');
	return gulp.src(paths.source)
		.pipe(gulpDocumentation('html', {}, {name, version}))
		.pipe(gulp.dest(paths.doc));
});

gulp.task("watch:docs", () => {
	const watcher = gulp.watch(paths.source, gulp.series('documentation-html'));
	watcher.on('change', function (path, stats) {
		console.log('File ' + path + ' was changed');
	});
	return watcher;
});
