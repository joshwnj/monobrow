var path = require('path')
var browserify = require('browserify')
var mkdirp = require('mkdirp')
var watchify = require('watchify')

module.exports = function (opts) {
  opts = opts || {}
  if (!opts.rootDir) { opts.rootDir = process.cwd() }

  var b = watchify(browserify(watchify.args))
  var bundle = require('./lib/build')(b, opts)

  // ----
  // deps

  opts.deps.setup(b, opts)

  // ----

  var outDir = path.join(opts.rootDir, opts.outDir)
  mkdirp.sync(outDir)

  b.add(path.join(opts.rootDir, opts.entry))
  bundle()
}
