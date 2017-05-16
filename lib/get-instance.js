const browserify = require('browserify')
const browserifyInc = require('browserify-incremental')
const hmr = require('browserify-hmr')
const watchify = require('watchify')

/*

  Get a browserify instance based on which mode we're running in

*/
module.exports = function getBrowserifyInstance (opts) {
  var b
  if (opts.watch) {
    b = watchify(browserify(watchify.args))
  } else if (opts.inc) {
    b = browserify(browserifyInc.args)
    browserifyInc(b, { cacheFile: opts.cacheFile })
  } else {
    b = browserify()
  }

  if (opts.hot) {
    b.plugin(hmr, {
      hostname: opts.hotHostname
    })
  }

  return b
}
