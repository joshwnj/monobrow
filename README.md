monobrow
====

[browserify](https://github.com/substack/node-browserify), with opinions.

Install
----

First add to your project:

```
npm install --save-dev monobrow
```

Quick start
----

After installing, run `npx monobrow init`

This will:

- create a config file with default settings (`monobrow/config.js`)
- add some aliases to your `package.json` scripts

Editing config by hand
----

Monobrow config is just a js module that exports an object. For example, a simple one looks like this:

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

You can also specify `hostname` for the hot reload server: `npm run build -- -h 127.0.0.1`. If you supply `-h` (or `--hot`) with no value, the default hostname of `0.0.0.0` is used.

Simple bundle splitting
----

Any packages listed in the `vendor` array will be split into a separate bundle. The default name is `vendor.js`, but can be specified in the `output.vendor` option. Eg.

```js
// your-project/monobrow/config.js

module.exports = {
  entry: 'src/index.js',
  output: {
    dir: 'build'
  },
  vendor: [
    'react',
    'react-dom',
    'classnames'
  ]
}
```

This will produce 2 files in the `build` directory:

- `build/index.js`: just your application bundle
- `build/vendor.js`: a bundle with externalized vendor files

When you do this, don't forget to add a new `<script src="build/vendor.js"></script>` to your page, before the `<script>` tag that includes your application bundle.

### Vendor files provided by packs

Packs can provide a prebuilt bundle of vendor modules.  Eg.

```js
// your-project/monobrow/config.js

module.exports = {
  entry: 'src/index.js',
  output: {
    dir: 'build',
    vendor: 'vendor.js'
  },
  packs: [
    require('monobrow-react-pack')
  ]
}
```

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
