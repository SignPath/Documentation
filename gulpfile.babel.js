import gulp from 'gulp'
import gutil from 'gulp-util'
import tap from 'gulp-tap'
import gap from 'gulp-append-prepend'
import replaceImg from 'gulp-replace-image-src'
import replace from 'gulp-replace'
import MarkdownIt from 'markdown-it'
import mdImSize from 'markdown-it-imsize'
import mdAdmonition from 'markdown-it-admonition'
import mdTocAndAnchor from 'markdown-it-toc-and-anchor'

const MARKDOWN_GLOB = 'src/**/*.md'

let md = new MarkdownIt()
  .use(mdImSize, { autofill: true })
  .use(mdAdmonition)
  .use(mdTocAndAnchor, { tocFirstLevel: 2, tocLastLevel: 3, anchorLink: false })

function _markdownToHtml(file) {
  let result = md.render(file.contents.toString())
  file.contents = new Buffer.from(result)
  file.path = gutil.replaceExtension(file.path, '.html')
}

function build() {
  return gulp.src(MARKDOWN_GLOB)
    .pipe(replace(/\*\*Title:\*\*.*\n/g, ''))
    .pipe(tap(_markdownToHtml))
    .pipe(gap.prependFile('src/header.html'))
    .pipe(gap.prependFile('src/footer.html'))
    .pipe(replaceImg({
      prependSrc : 'https://about.signpath.io/wp-content/uploads/images/',
      keepOrigin : false
    }))
    .pipe(gulp.dest('build'));
}

function buildLocal() {
  return gulp.src(MARKDOWN_GLOB)
    .pipe(tap(_markdownToHtml))
    .pipe(gap.prependFile('src/local/header.html'))
    .pipe(gap.prependFile('src/local/footer.html'))
    .pipe(replaceImg({
      prependSrc : '../../src/images/',
      keepOrigin : false
    }))
    .pipe(gulp.dest('buildLocal'))
}

function watchLocal() {
  gulp.watch(MARKDOWN_GLOB, buildLocal)
}

function watch() {
  gulp.watch(MARKDOWN_GLOB, build)
}



export default build;
export {
  build,
  buildLocal,
  watch,
  watchLocal
};

// TODO
// * check if file exists