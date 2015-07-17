monobrow
====

[browserify](https://www.npmjs.com/package/browserify) plus opinions.

Usage
----

First add to your project:

```
npm install --save-dev monobrow
```

Now in your package.json, write a browserify build script like you normally would. `monobrow` expects exactly the same arguments as `browserify`:

```
"scripts": {
  "build": "monobrow entry.js -t babelify -o bundle.js"
}
```

Now you can do a single browserify build with `npm run build`.

But if you're developing and want to automatically rebuild with watchify, use `WATCH=1 npm run build`

Alternative
----

- add a script

```
"scripts": {
  "build": "monobrow -c ./monobrow.config.js"
}
```

- `monobrow.config.js` contains info about how to transform. If you want a plain build with `babelify`, you can use something like:

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
