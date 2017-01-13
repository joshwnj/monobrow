#!/usr/bin/env node

var path = require('path')
var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))

var rootDir = process.cwd()
var configPath = argv.c || argv.config || 'monobrow/config.js'
var config = require(path.join(rootDir, configPath))

// set defaults
config.rootDir = rootDir

if (typeof config.watch === 'undefined') {
  config.watch = argv.w || argv.watch
}

if (typeof config.hot === 'undefined') {
  config.hot = argv.h || argv.hot
}

if (typeof config.inc === 'undefined') {
  config.inc = argv.inc || true
}

if (typeof config.verbose === 'undefined') {
  config.verbose = argv.v || argv.verbose || true
}

const isPack = !!config._path
if (isPack) {
  require('../vendor')(config)
} else {
  require('../index')(config)
}

