monobrow
====

[browserify](https://github.com/substack/node-browserify), with opinions.

Usage
----

First add to your project:

```
npm install --save-dev monobrow
```

Then write a js module to build your project. For example, a simple one looks like this:

```js
// your-project/monobrow.js

const m = require('monobrow')

monobrow({
  entry: 'src/index.js',
  outDir: 'build',
  verbose: true,
  watch: false
})
```

Then you can build by running `node monobrow.js`, or add a script to your package.json:

```json
"scripts": {
  "build": "node monobrow.js"
}
```

License
----

MIT
