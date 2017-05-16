const browserify = require('browserify')
const browserifyInc = require('browserify-incremental')
const caller = require('caller')
const hmr = require('browserify-hmr')
const mkdirp = require('mkdirp')
const path = require('path')
const watchify = require('watchify')

module.exports = function (opts) {
  opts = normalizeOpts(opts)

  const b = getBrowserifyInstance(opts)

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

  Normalize the options object, and add missing defaults

*/
function normalizeOpts (opts) {
  if (!opts) { opts = {} }

  // root directory for all source files
  // (assume that this is the same directory as package.json)
  if (!opts.rootDir) { opts.rootDir = process.cwd() }

  // use browserify-incremental?
  if (typeof opts.inc === 'undefined') { opts.inc = true }
  if (!opts.cacheFile) { opts.cacheFile = '.bcache.json' }

  const outputDefaults = {
    dir: 'dist',
    bundle: path.basename(opts.entry)
  }

  opts.output = Object.assign({}, outputDefaults, opts.output || {})
  opts.outFile = path.join(opts.rootDir, opts.output.dir, opts.output.bundle)

  if (!opts.vendor) { opts.vendor = [] }

  return opts
}

/*

  Get a browserify instance based on which mode we're running in

*/
function getBrowserifyInstance (opts) {
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
