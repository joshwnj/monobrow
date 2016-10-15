monobrow
====

[browserify](https://github.com/substack/node-browserify), with opinions.

Usage
----

First add to your project:

```
npm install --save-dev monobrow
```

Then add a script to your package.json

```
"scripts": {
  "build": "monobrow"
}
```

Finally write a `monobrow.js` file containing config for your project. For example if you want a plain build with `babelify`, you can use something like:

```
var babelify = require('babelify')

module.exports = {
  entry: './src/index.js',

  setup: function (b) {
    b.transform(babelify)
  }
}
```

The `--watch` (or `-w`) flag toggles between `browserify` and `watchify`:

- `npm run build` will use `browserify`.
- `npm run build -- --watch` will use `watchify`.

License
----

MIT
