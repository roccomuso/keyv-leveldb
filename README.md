# @keyv/leveldb [<img width="100" align="right" src="https://rawgit.com/lukechilds/keyv/master/media/logo.svg" alt="keyv">](https://github.com/lukechilds/keyv)

> LevelDB storage adapter for Keyv

[![Build Status](https://travis-ci.org/roccomuso/keyv-leveldb.svg?branch=master)](https://travis-ci.org/roccomuso/keyv-leveldb)
[![Coverage Status](https://coveralls.io/repos/github/roccomuso/keyv-leveldb/badge.svg?branch=master)](https://coveralls.io/github/roccomuso/keyv-leveldb?branch=master)
[![npm](https://img.shields.io/npm/v/@keyv/leveldb.svg)](https://www.npmjs.com/package/@keyv/leveldb)

LevelDB storage adapter for [Keyv](https://github.com/lukechilds/keyv).


## Install

```shell
npm install --save keyv @keyv/leveldb
```

## Usage

```js
const Keyv = require('keyv');

const keyv = new Keyv('leveldb://test/DB');
keyv.on('error', handleConnectionError);
```

Any valid options will be passed directly to the [underlying store](https://github.com/level/leveldown/#options).

e.g:

```js
const keyv = new Keyv('leveldb://test/DB', { createIfMissing: false });
```

Or you can manually create a storage adapter instance and pass it to Keyv:

```js
const Keyv = require('keyv');
const KeyvLevelDB = require('@keyv/leveldb');

const leveldb = new KeyvLevelDB('leveldb://test/DB');
const keyv = new Keyv({ store: leveldb });
```

## License

MIT © Rocco Musolino ([@roccomuso](https://twitter.com/roccomuso))
