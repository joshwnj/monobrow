var path = require('path')
var browserify = require('browserify')
var browserifyInc = require('browserify-incremental')
var mkdirp = require('mkdirp')

module.exports = function (opts) {
  opts = opts || {}
  if (!opts.rootDir) { opts.rootDir = process.cwd() }
  if (!opts.cacheFile) { opts.cacheFile = '.bcache.json' }
  if (!opts.outFile) {
    opts.outFile = path.join(opts.rootDir, opts.outDir, path.basename(opts.entry))
  }

  var b = browserify(browserifyInc.args)
  browserifyInc(b, { cacheFile: opts.cacheFile })

  var bundle = require('./lib/build')(b, opts)

  if (typeof opts.setup === 'function') {
    opts.setup(b, opts)
  }

  // make sure the output directory exists
  var outDir = path.dirname(opts.outFile)
  mkdirp.sync(outDir)

  if (opts.entry) {
    b.add(path.join(opts.rootDir, opts.entry))
  }

  if (opts.modules) {
    b.require(opts.modules)
  }

  bundle()
}
