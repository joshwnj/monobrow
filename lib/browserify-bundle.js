var fs = require('fs');
var uglifyjs = require('uglifyjs');

module.exports = function (b, config) {
  var outfile = config.outfile;
  var verbose = config.verbose;

  return function bundle () {
    var didError = false;
    var outStream = fs.createWriteStream(outfile);

    var bStream = b.bundle();
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
      if (config.minify) {
        var result = uglifyjs.minify(outfile);
        fs.writeFileSync(outfile, result.code);
      }

      if (verbose && !didError) {
        console.error(
          'monobrow: wrote %s',
          outfile
        );
      }
    });
  };
};
