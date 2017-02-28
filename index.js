const path = require('path')
const browserify = require('browserify')
const hmr = require('browserify-hmr')
const browserifyInc = require('browserify-incremental')
const caller = require('caller')
const mkdirp = require('mkdirp')
const watchify = require('watchify')

module.exports = function (opts) {
  opts = opts || {}
  if (!opts.rootDir) { opts.rootDir = process.cwd() }
  if (!opts.cacheFile) { opts.cacheFile = '.bcache.json' }
  if (typeof opts.inc === 'undefined') { opts.inc = true }

  if (opts.hot) {
    opts.watch = true
  }

  const outputDefaults = {
    dir: 'dist',
    bundle: path.basename(opts.entry)
  }

  opts.output = Object.assign({}, outputDefaults, opts.output || {})
  opts.outFile = path.join(opts.rootDir, opts.output.dir, opts.output.bundle)

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
    b.plugin(hmr)
  }

  // normalize setup packs
  const packs = normalizePacks(opts.packs)
  packs.forEach((p) => {
    // ignore vendor deps in the bundle
    b.external(p.vendor)

    // run the setup
    p.setup(b, opts)
  })

  // collect pre-bundled vendor files for all packs
  const vendorFiles = packs.map((p) => {
    return p._path ? path.join(path.dirname(p._path), 'dist', 'vendor.js') : null
  }).filter(Boolean)

  // make sure the output directory exists
  var outDir = path.dirname(opts.outFile)
  mkdirp.sync(outDir)

  if (opts.entry) {
    b.add(path.join(opts.rootDir, opts.entry))
  }

  if (opts.modules) {
    b.require(opts.modules)
  }

  require('./lib/build')(b, opts, vendorFiles)()
}

/*

Register a pack

*/
module.exports.pack = function (opts) {
  opts._path = caller()
  return opts
}

/*

Normalize a single pack

*/
function normalizePack (input) {
  const setup = (typeof input === 'function') ? input : input.setup
  const vendor = input.vendor || []

  return {
    _path: input._path,
    setup: setup,
    vendor: vendor
  }
}

/*

Get a normalized array of setup packs

*/
function normalizePacks (input) {
  if (!input) { return [] }

  // input can either be:
  // - a function
  // - an array of functions
  // - an array of { setup: function } (as is often the case with packs)
  if (typeof input === 'function') {
    return [ normalizePack(input) ]
  }

  return input.map(normalizePack)
}
