/** Node Package Linker to reduce redundant node_module files
 *
 *  @copyright  Copyright (C) 2015 by yieme
 */
 'use strict';
/** Npl class
 *  @class
 *  @param      {object} options - The options
 *  @return     {object}
 */
function nplClass(options) {
  /*jshint validthis: true */
  options = options || {}
  this.value = 'Hello, world'
  return this
}



/** Npl factory
 *  @module     npl
 *  @param      {object} options - The options
 *  @return     {object}
 */
function npl(options) {
  return new nplClass(options)
}


module.exports = npl
