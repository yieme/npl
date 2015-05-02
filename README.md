# npl

Node Package Linker to reduce redundant node_module files

<!-- [![build status](https://secure.travis-ci.org/yieme/npl.png)](http://travis-ci.org/yieme/npl) -->

## Installation

This module is installed via npm:

```sh
$ npm install npl
```

## Example Usage

``` js
var npl = require('npl')
npl({ cache: '/Users/username/.npl', param: ['i', 'noop', '--save'] })
```

## License

MIT
