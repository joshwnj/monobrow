monobrow
====

A single command for easily switching between browserify and watchify.

Usage
----

In your package.json, write a script like:

```
"scripts": {
  "build": "monobrow entry.js -t babelify -o bundle.js"
}
```

Now you can do a single browserify build with `npm run build`.

But if you're developing and want to automatically rebuild with watchify, use `WATCH=1 npm run build`
