#!/usr/bin/env node

var path = require('path')
var browserify = require('browserify')
var watchify = require('watchify')
var minimist = require('minimist')
var argv = minimist(process.argv.slice(2))

var rootDir = process.cwd()
var configPath = argv.c || argv.config || 'monobrow.js'
var config = require(path.join(rootDir, configPath))
config.rootDir = rootDir

var b = watchify(browserify(watchify.args))
var bundle = require('../lib/build')(b, config)

if (config.setup) {
  config.setup(b, config)
}

b.add(path.join(rootDir, config.entry))
bundle()
