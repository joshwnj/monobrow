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
// your-project/monobrow/config.js

module.exports = {
  entry: 'src/index.js',
  output: {
    dir: 'build'
  }
}
```

Then add a script to your package.json:

```json
"scripts": {
  "build": "monobrow"
}
```

And `npm run build`

You can also `npm run build -- -w` to watch, or `npm run build -- -h` to hot-reload.

Simple bundle splitting
----

If you specify the `output.vendor` config, any packs that provide vendors can externalize them into a separate bundle.  Eg.

```js
// your-project/monobrow/config.js

module.exports = {
  entry: 'src/index.js',
  output: {
    dir: 'build',
    vendor: 'vendor.js'
  }
}
```

This will produce 2 files in the `build` directory:

- `build/index.js`: just your application bundle
- `build/vendor.js`: a bundle with externalized vendor files

When you do this, don't forget to add a new `<script src="dist/vendor.js"></script>` to your page, before the `<script>` tag that includes your application bundle.

Tech
----

- [browserify-hmr](https://github.com/AgentME/browserify-hmr): hot reloading
- [browserify-incremental](https://github.com/jsdf/browserify-incremental): faster builds

Example
----

Take a look at [monobrow-todomvc](https://github.com/joshwnj/monobrow-todomvc) to see a simple example of:

- splitting app code and dependencies into separate bundles
- adding transforms (eg. [babelify](https://github.com/babel/babelify))

License
----

MIT
