#!/usr/local/bin/node
/** Node Package Linker to reduce redundant node_module files
 *
 *  @copyright  Copyright (C) 2015 by yieme
 */ 'use strict';
var npl  = require('../index.js')
var exec = require('sync-exec')
var TIMEOUT = 600000 // 10 minutes
var param   = []

function doExec(str) {
  console.log('EXEC:', str)
  var result = exec(str, TIMEOUT)
  if (result.status) {
    throw new Error(result.stderr)
  }
  return result.stdout
}

var cache = doExec('npm config get cache')

process.argv.forEach(function getArgv(val, index) {
  if (val.indexOf(' ') >= 0) val = '"' + val + '"'
  if (index >1) param.push(val)
})
if (param[0] != '--link-all') {
  doExec('npm ' + param.join(' '))
} else {
  param.push('--link-all')
}

cache = cache.replace('.npm', '.npl')
doExec('mkdir -p ' + cache)

npl({cache: cache, param: param})
