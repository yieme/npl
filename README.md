# npl

Node Package Linker to reduce redundant node_module files

<!-- [![build status](https://secure.travis-ci.org/yieme/npl.png)](http://travis-ci.org/yieme/npl) -->

## Installation

```sh
npm i npl -g
```

## Use like npm

As a wrapper around ```npm```, use ```npl``` just as you would npm.

```js
npl i noop --save
```

or install all modules for a project

```sh
npl i
```

or link all of the current node_modules in a project

```sh
npl --link-all
```

## How it works

- call ```npm``` as usual
- move uncached modules from ```node_modules/PACKAGE_NAME``` to ```~/.npl/PACKAGE_NAME/VERSION```
- symlink listed packages in ```node_modules/PACKAGE_NAME``` to ```~/.npl/PACKAGE_NAME/VERSION```

## License

MIT
