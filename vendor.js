const path = require('path')
const browserify = require('browserify')
const browserifyInc = require('browserify-incremental')
const mkdirp = require('mkdirp')
const watchify = require('watchify')

module.exports = function (opts) {
  opts = opts || {}

  if (!opts.cacheFile) { opts.cacheFile = '.bcache.json' }
  if (typeof opts.inc === 'undefined') { opts.inc = true }

  if (!opts.vendor) {
    console.error('Missing vendor config')
    process.exit(1)
  }

  const outDir = path.join(path.dirname(opts._path), 'dist')
  const modules = opts.vendor
  opts.outFile = path.join(outDir, 'vendor.js')

  var b
  if (opts.watch) {
    b = watchify(browserify(watchify.args))
  } else if (opts.inc) {
    b = browserify(browserifyInc.args)
    browserifyInc(b, { cacheFile: opts.cacheFile })
  } else {
    b = browserify()
  }

  // make sure the output directory exists
  mkdirp.sync(outDir)

  b.require(modules)

  require('./lib/build')(b, opts)()
}
