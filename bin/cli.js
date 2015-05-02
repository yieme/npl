#!/usr/local/bin/node
/** Node Package Linker to reduce redundant node_module files
 *
 * @description npm layer to cache commonly used node modules in projects and replacing node_module/ package folders with symlinks
 *
 *  @copyright  Copyright (C) 2015 by yieme
 */ 'use strict';
var npl     = require('../index.js')
var exec    = require('sync-exec')
var TIMEOUT = 600000 // 10 minutes
var param   = []
var argv    = process.argv



function doExec(str) {
  console.log('EXEC:', str)
  var result = exec(str, TIMEOUT)
  if (result.status) {
    throw new Error(result.stderr)
  }
  return result.stdout
}



function getOnlyPackageNames(parameterList) {
  var packages = []
  for (var i=1; i < parameterList.length; i++) {
    if (i) {
      var packageName = parameterList[i]
      if (packageName.substr(0,1) != '-') {
        packages.push(packageName)
      }
    }
  }
  return packages
}



var cache    = doExec('npm config get cache')
var cacheDir = cache.replace('.npm', '.npl').replace("\n", '')
var param    = []

argv.forEach(function getArgv(val, index) {
  if (val.indexOf(' ') >= 0) val = '"' + val + '"'
  if (index >1) param.push(val)
})
if (param[0] != '--link-all') {
  doExec('npm ' + param.join(' '))
}

if (argv.indexOf('-g') < 0) { // don't re-link global packages
  var packageList = getOnlyPackageNames(param)
  var linkAll  = (argv.indexOf('--link-all') > 0) || (packageList.length == 0 && (argv.indexOf('i') > 0 || argv.indexOf('install') > 0)) 
  npl(cacheDir, packageList, linkAll)
}
