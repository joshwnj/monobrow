var fs = require('fs');

module.exports = function (w, config) {
  var bytes
  var time;
  var outfile = config.outfile;
  var verbose = config.verbose;

  function bundle () {
    var didError = false;
    var outStream = fs.createWriteStream(outfile);

    var bStream = w.bundle();
    bStream.on('error', function (err) {
      console.error(String(err));
      didError = true;
      outStream.end('console.error('+JSON.stringify(String(err))+');');
    });

    bStream.pipe(outStream);

    outStream.on('error', function (err) {
      console.error(err);
    });

    outStream.on('close', function () {
      if (verbose && !didError) {
        console.error(
          '%d bytes written to %s (%s seconds)',
          bytes, outfile, (time / 1000).toFixed(2)
        );
      }
    });
  };

  w.on('bytes', function (b) { bytes = b });
  w.on('time', function (t) { time = t });
  w.on('update', bundle);

  return bundle;
};
