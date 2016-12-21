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
  outDir: 'build'
}
```

Then add a script to your package.json:

```json
"scripts": {
  "build": "monobrow -c monobrow/config.js"
}
```

And `npm run build`

Tech
----

- [browserify-incremental](https://github.com/jsdf/browserify-incremental): faster builds

Example
----

Take a look at [monobrow-todomvc](https://github.com/joshwnj/monobrow-todomvc) to see a simple example of:

- splitting app code and dependencies into separate bundles
- adding transforms (eg. [babelify](https://github.com/babel/babelify))

License
----

MIT
