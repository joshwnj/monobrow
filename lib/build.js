const fs = require('fs')
const path = require('path')
const multistream = require('multistream')

function createReadStream (f) {
  return fs.createReadStream(f)
}

module.exports = function (w, opts, vendorFiles) {
  vendorFiles = vendorFiles || []

  const outFile = opts.outFile
  const verbose = opts.verbose
  const outputOpts = opts.output || {}
  const shouldSplitVendor = typeof outputOpts.vendor !== 'undefined'

  var bytes
  var time
  w.on('bytes', function (b) { bytes = b })
  w.on('time', function (t) { time = t })

  if (opts.watch) {
    w.on('update', bundle)
  }

  return shouldSplitVendor ? writeVendorFileThenBundle : bundle

  // ----

  /*

    Write the separate vendor file, then proceed with bundling

  */
  function writeVendorFileThenBundle () {
    const vendorDestPath = path.join(opts.rootDir, outputOpts.dir, outputOpts.vendor)
    multistream(vendorFiles.map(createReadStream))
      .pipe(fs.createWriteStream(vendorDestPath))
      .on('error', (err) => console.error(err))
      .on('close', bundle)
  }

  /*

    Create and write the browserify bundle file

   */
  function bundle () {
    var didError = false
    const outStream = fs.createWriteStream(outFile)
    const bStream = w.bundle()

    bStream.on('error', function (err) {
      console.error(String(err))
      didError = true
      outStream.end('console.error(' + JSON.stringify(String(err)) + ')')
    })

    // if we're not splitting vendor files, include them in the bundle
    if (!shouldSplitVendor && vendorFiles.length) {
      multistream(vendorFiles.map(createReadStream).concat(bStream))
        .pipe(outStream)
    } else {
      bStream.pipe(outStream)
    }

    outStream.on('error', function (err) {
      console.error(err)
    })

    outStream.on('close', function () {
      if (verbose && !didError) {
        // TODO: also display size of vendor files
        console.error(
          '%d bytes written to %s (%s seconds)',
          bytes, outFile, (time / 1000).toFixed(2)
        )
      }
    })
  }
}
