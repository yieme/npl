
/** Node Package Linker to reduce redundant node_module files
 *
 *  @copyright  Copyright (C) 2015 by yieme
 */ 'use strict';
var path    = require('path')
var readdir = require('readdir')
var exec    = require('sync-exec')
var fs      = require('fs')
var version = require('package-version')
var TIMEOUT = 60000 // 1 minute
/**
 *  @module     npl
 *  @param      {string} cache - Cache path
 *  @param      {string} npm   - NPM parameters
 *  @param      {string} force - Force links
 *  @return     {object}
 */


 function doExec(str) {
   console.log('EXEC:', str)
   var result = exec(str, TIMEOUT)
   if (result.status) {
     throw new Error(result.stderr)
   }
   return result.stdout
 }


function linkPackage(cacheDir, packageName) {
  var packagePath = path.normalize('node_modules/' + packageName)
//  console.log('cacheDir:', cacheDir, ', packageName:', packageName, ', packagePath:', packagePath)
  if (!fs.existsSync(packagePath)) {
    throw new Error('missing package linkPackage folder: ' + packagePath)
  }
  var stats = fs.lstatSync(packagePath)
  if (!stats.isSymbolicLink()) { // not already a symbolic link so make it so
    version(packagePath, function(err, version){
      if (err) throw err
      var cachePath = path.normalize(cacheDir + '/' + packageName)
      doExec('mkdir -p ' + cachePath)
      cachePath = path.normalize(cachePath + '/' + version)
      if (fs.existsSync(cachePath)) {
        doExec('rm -fR ' + packagePath)
      } else {
        doExec('mv ' + packagePath + ' ' + cachePath)
      }
      doExec('ln -s ' + cachePath + ' ' + packagePath)
    })
  }
}

function npl(options) {
  var i, packageName
  options = options || {}
  var cache = options.cache
  if (!cache) {
    throw new Error('missing npl cache folder')
  }
  cache = cache.replace("\n", '')
  var packages = []
  if (options.param.indexOf('--link-all') > 0) {
    packages = readdir.readSync('node_modules', null, readdir.INCLUDE_DIRECTORIES + readdir.NON_RECURSIVE)
    for (i=0; i < packages.length; i++) {
      packageName = packages[i]
      packages[i] = packageName.substr(0, packageName.length-1) // drop trailing /
    }
  } else {
    for (i=1; i < options.param.length; i++) {
      if (i) {
        packageName = options.param[i]
        if (packageName.substr(0,1) != '-') {
          packages.push(packageName)
        }
      }
    }
  }
  for (i=0; i < packages.length; i++) {
    linkPackage(cache, packages[i])
  }
}


module.exports = npl
