const path = require('path')
const browserify = require('browserify')
const browserifyInc = require('browserify-incremental')
const fs = require('fs')
const mkdirp = require('mkdirp')
const watchify = require('watchify')
const multistream = require('multistream')

const allDeps = []

module.exports = function (opts) {
  opts = opts || {}
  if (!opts.rootDir) { opts.rootDir = process.cwd() }
  if (!opts.cacheFile) { opts.cacheFile = '.bcache.json' }
  if (typeof opts.inc === 'undefined') { opts.inc = true }

  if (!opts.vendor) {
    console.error('Missing vendor config')
    process.exit(1)
  }

  const modules = opts.vendor
  opts.outFile = 'dist/vendor.js'

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

  // make sure the output directory exists
  var outDir = path.dirname(opts.outFile)
  mkdirp.sync(outDir)

  b.require(modules)

  const onFinish = function () {
    if (!opts.watch) {
      process.exit()
    }
  }

  bundle(onFinish)
}
