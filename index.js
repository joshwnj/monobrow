var path = require('path')
var browserify = require('browserify')
var browserifyInc = require('browserify-incremental')
var mkdirp = require('mkdirp')
var watchify = require('watchify')

module.exports = function (opts) {
  opts = opts || {}
  if (!opts.rootDir) { opts.rootDir = process.cwd() }
  if (!opts.cacheFile) { opts.cacheFile = '.bcache.json' }
  if (typeof opts.inc === 'undefined') { opts.inc = true }
  if (!opts.outFile) {
    opts.outFile = path.join(opts.rootDir, opts.outDir, path.basename(opts.entry))
  }

  var b
  if (opts.watch) {
    b = watchify(browserify(watchify.args))
  } else if (opts.inc) {
    b = browserify(browserifyInc.args)
    browserifyInc(b, { cacheFile: opts.cacheFile })
  } else {
    b = browserify()
  }

  var bundle = require('./lib/build')(b, opts)

  // setup (optional) can either be a function or an array of functions
  if (typeof opts.setup === 'function') {
    opts.setup(b, opts)
  } else if (Array.isArray(opts.setup)) {
    opts.setup.forEach(function (f) { f(b, opts) })
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

// shortcut for a "setup" function to externalise some deps
module.exports.external = function (deps) {
  return function (b) {
    b.external(deps)
  }
}
