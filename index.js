
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
  if (!packageName || packageName.substr(0,1) == '.' || packageName.substr(0,1) == '/') {
    packageName = JSON.stringify(packageName)
    throw new Error('missing or invalid packageName: ' + packageName)
  }
  var packagePath = path.normalize('node_modules/' + packageName)
  if (!fs.existsSync(packagePath)) {
    throw new Error('missing package linkPackage folder: ' + packagePath)
  }
  var stats = fs.lstatSync(packagePath)
  if (!stats.isSymbolicLink()) { // if not a symbolic link, make it one
    version(packagePath, function(err, packageVersion) { // get package version
      if (err) throw err
      var cachePath = path.normalize(cacheDir + '/' + packageName)
      doExec('mkdir -p "' + cachePath + '"')
      cachePath = path.normalize(cachePath + '/' + packageVersion)
      if (fs.existsSync(cachePath)) {
        doExec('rm -fR "' + packagePath + '"')
      } else {
        doExec('mv "' + packagePath + '" "' + cachePath + '"')
      }
      doExec('ln -s "' + cachePath + '" "' + packagePath + '"')
    })
  }
}



function linkPackages(packages, cache) {
  for (var i=0; i < packages.length; i++) {
    linkPackage(cache, packages[i])
  }
}



function getAllPackageNames() {
  var readOptions = readdir.INCLUDE_DIRECTORIES + readdir.NON_RECURSIVE
  var packages = readdir.readSync('node_modules', null, readOptions)
  for (var i=0; i < packages.length; i++) {
    var packageName = packages[i]
    packages[i] = packageName.substr(0, packageName.length-1) // drop trailing slash /
  }
  return packages
}



 /**
  * Node Package Linker to reduce redundant node_module files
  *
  * @module    npl
  * @param  {string}  cache - Cache path
  * @param  {string}  npm   - NPM parameters
  * @param  {boolean} force - Force links
  * @return {object}  npl
  */
function npl(cacheDir, packageList, linkAll) {
  if (!cacheDir) {
    throw new Error('missing npl cache folder')
  }
//  doExec('mkdir -p "' + cacheDir + '"')

  var packages = (linkAll) ? getAllPackageNames() : packageList
  linkPackages(packages, cacheDir)
}



module.exports = npl
