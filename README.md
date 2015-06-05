monobrow
====

A single command for easily switching between [browserify](https://www.npmjs.com/package/browserify) and [watchify](https://www.npmjs.com/package/watchify).

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
