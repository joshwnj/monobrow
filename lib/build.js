var fs = require('fs')

module.exports = function (w, opts, cb) {
  var bytes
  var time
  var outFile = opts.outFile
  var verbose = opts.verbose

  function bundle () {
    var didError = false
    var outStream = fs.createWriteStream(outFile)

    var bStream = w.bundle()
    bStream.on('error', function (err) {
      console.error(String(err))
      didError = true
      outStream.end('console.error(' + JSON.stringify(String(err)) + ')')
    })

    bStream.pipe(outStream)

    outStream.on('error', function (err) {
      console.error(err)
    })

    outStream.on('close', function () {
      if (verbose && !didError) {
        console.error(
          '%d bytes written to %s (%s seconds)',
          bytes, outFile, (time / 1000).toFixed(2)
        )
      }

      if (cb) { cb() }
    })
  }

  w.on('bytes', function (b) { bytes = b })
  w.on('time', function (t) { time = t })

  if (opts.watch) {
    w.on('update', bundle)
  }

  return bundle
}
