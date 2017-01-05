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

  const onFinish = function () {
    if (!opts.watch) {
      process.exit()
    }
  }

  const bundleFunc = bundle.bind(null, onFinish)

  if (!allDeps.length) { return bundleFunc() }

  concatDeps(opts, allDeps, function (err) {
    if (err) {
      console.log(err)
    }

    bundleFunc()
  })
}

module.exports.deps = function (b, deps, outFile) {
  b.external(deps)
  allDeps.push(outFile)
}

function concatDeps (opts, deps, cb) {
  const streams = deps.map(d => fs.createReadStream(d))
  multistream(streams)
    .pipe(fs.createWriteStream(path.join(opts.outDir, '_deps.js')))
    .on('error', cb)
    .on('close', () => cb(null))
}
