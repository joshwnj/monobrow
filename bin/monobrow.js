#!/usr/bin/env node

var path = require('path')
var browserify = require('browserify')
var watchify = require('watchify')

var rootDir = process.cwd()
var configPath = 'monobrow.js'
var config = require(path.join(rootDir, configPath))
config.rootDir = rootDir

var b = watchify(browserify(watchify.args))
var bundle = require('../lib/build')(b, config)

if (config.setup) {
  config.setup(b, config)
}

b.add(path.join(rootDir, config.entry))
bundle()
