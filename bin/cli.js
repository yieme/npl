#!/usr/local/bin/node
/** Npl
 *
 *  @copyright  Copyright (C) 2015 by yieme
 *  @module     npl
 *  @param      {stream} stdin  - Standard input
 *  @return     {stream} stdout - Standard output
 */ 'use strict';
var stdin = require('get-stdin')
var npl = require('../index.js')

stdin(function (data) {
  if (data) {
    var result = npl(data)
    console.log(JSON.stringify(result))
  }
})
