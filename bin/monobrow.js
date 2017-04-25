#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var minimist = require('minimist')
var mkdirp = require('mkdirp')
var argv = minimist(process.argv.slice(2))

var rootDir = process.cwd()
var configPath = argv.c || argv.config || path.join('monobrow', 'config.js')

const knownCommands = ['build', 'init']
const defaultCommand = knownCommands[0]
const cmd = knownCommands.indexOf(argv._[0]) >= 0 ? argv._[0] : defaultCommand

if (cmd === 'build') {
  var config = require(path.join(rootDir, configPath))

  // set defaults
  if (!config.rootDir) { config.rootDir = rootDir }

  if (typeof config.watch === 'undefined') {
    config.watch = argv.w || argv.watch
  }

  if (typeof config.hot === 'undefined') {
    const hotVal = argv.h || argv.hot
    config.hot = Boolean(hotVal)
    config.hotHostname = typeof hotVal === 'string' ? hotVal : '0.0.0.0'
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
}
else if (cmd === 'init') {
  const filepath = path.join(rootDir, configPath)
  const dir = path.dirname(filepath)

  // ensure the directory exists
  mkdirp.sync(dir)

  // create the config file if it doesn't already exist
  if (fs.existsSync(filepath)) {
    console.log('- found existing config: %s', filepath)
  }
  else {
    fs.writeFileSync(filepath, `module.exports = {
  entry: 'src/index.js',
  output: {
    dir: 'dist'
  },
  packs: []
}`)
    console.log('- created config: %s', filepath)
  }

  // update package.json
  const pkgpath = path.join(rootDir, 'package.json')
  const pkg = require(pkgpath)
  if (pkg.scripts.build) {
    console.log('- found existing scripts.build in package.json')
  }
  else {
    pkg.scripts.build = 'monobrow'

    if (!pkg.scripts.monobrow) {
      pkg.scripts.monobrow = pkg.scripts.build
    }

    // TODO: preserve original indent style
    fs.writeFileSync(pkgpath, JSON.stringify(pkg, null, 2))
    console.log('- added aliases to package.json scripts')
  }

  console.log('ok')
}
