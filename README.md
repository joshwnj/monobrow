monobrow
====

[browserify](https://www.npmjs.com/package/browserify), with opinions.

Usage
----

First add to your project:

```
npm install --save-dev monobrow
```

Then add a script to your package.json

```
"scripts": {
  "build": "monobrow -c ./monobrow.config.js"
}
```

Finally write a `monobrow.config.js` file containing info about how to transform. If you want a plain build with `babelify`, you can use something like:

```
var babelify = require('babelify');

module.exports = {
  entry: './src/index.js',

  watch: !!process.env.WATCH,

  setup: function (b) {
    b.transform(babelify);
  }
};
```

Using environment vars like `WATCH` in your script means you can effectively toggle between `browserify` or `watchify` with the same npm command:

- `npm run build` will use `browserify`.
- `WATCH=1 npm run build` will use `watchify`.

License
----

MIT
