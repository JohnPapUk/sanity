const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlMin = require('gulp-htmlmin'); // See : https://github.com/jonschlinkert/gulp-htmlmin
const minifyInline = require('gulp-minify-inline');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const strip = require('gulp-strip-comments'); // See : https://www.npmjs.com/package/gulp-strip-comments
const autoPrefixer = require('gulp-autoprefixer'); // See: https://github.com/sindresorhus/gulp-autoprefixer#readme

const postcss = require('gulp-postcss');
const uncss = require('postcss-uncss');

const zetzer = require('gulp-zetzer');

// Paths

// const __vueApp = __dirname + '/app/';
const __designPath = __dirname + '/style/scss/';
const __cssStagingPath = __dirname + '/style/css/';
const __commPath = __designPath + 'common/';
const __pagesPath = __dirname + '/pages/'
const __distPath = __dirname + '/dist/';

// const __baseURL = 'http://my-portfolio.jp';
const __baseURL = 'http://sanity.jp';
//
// const __baseURL = 'https://john-pap-protofolio.gr';
/**
 * Build HTML pages from templates & content pages.
 */
gulp.task('parse-html', function(done){
    return gulp.src(__dirname + '/pages/*.html')
        .pipe(zetzer({
            templates: __dirname + '/templates',
            partials: __dirname + '/templates/partials',
            dot_template_settings: {
                strip: true
            },
            env: {
                baseURL: __baseURL
            }
        }))
        .pipe(gulp.dest(__distPath ));
    done();
});

gulp.task('minify-html', () => {
    return gulp.src(__distPath + '*.html')
        .pipe(minifyInline())
        .pipe(htmlMin({
            collapseWhitespace: true,
            conservativeCollapse: true,
            html5: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeEmptyElements: false,
        }))
        .pipe(gulp.dest(__distPath));
});

gulp.task('parse-scss', () => {
    let plugins = [
        uncss({
            html: ['dist/**/*.html']
        })
    ];

    return gulp.src([__designPath + 'main.scss', __designPath + 'themes/theme.scss'])
        .pipe(scss({}))
        .pipe(autoPrefixer({}))
        // .pipe(postcss(plugins))
        .pipe(cleanCSS({compatibility: '*'}))
        .pipe(gulp.dest(__cssStagingPath))

});

gulp.task('concat-css', function () {
    return gulp.src( [__cssStagingPath + '*.css', ])
        .pipe(concat("main.css"))
        .pipe(gulp.dest(__distPath + 'css/'));
});

/**
 * Move all app js files to dist js folder
 */
// gulp.task('build-js', () => {
//     return gulp.src(__vueApp + '/dist/js/app/*.js')
//         .pipe(concat("main.js"))
//         .pipe(strip())                  // Strip any comments.
//         .pipe(gulp.dest(__distPath + 'js/app/') );
// });


// TASKS.
gulp.task('build-css', gulp.series('parse-scss',  function (done) {
    done();
}));

gulp.task('build-html', gulp.series('parse-html', function (done) {
    done();
}));

gulp.task('build-dist', gulp.series( 'build-html','build-css','concat-css', function (done) {
    done();
}));