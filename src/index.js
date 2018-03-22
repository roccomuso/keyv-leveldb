'use strict';

const EventEmitter = require('events').EventEmitter;
const levelup = require('levelup');
const leveldown = require('leveldown');
const memdown = require('memdown');

class KeyvLevelDB extends EventEmitter {
	constructor(uri, opts) {
    super();
    this.ttlSupport = false;
    this.opts = Object.assign(
      {},
			{uri: typeof uri === 'undefined' ? 'leveldb://:memory:' : uri},
			(typeof uri === 'object') ? uri : {},
      opts);

    const lvlCheck = new RegExp(/^leveldb:\/\//)
    const lvlErr = new RegExp(/:null:/)

    if (!lvlCheck.test(this.opts.uri) || lvlErr.test(this.opts.uri)) {
			process.nextTick(()=>this.emit('error', new Error('Provide a valid levelDB connection string')))
			return
    }

    this.opts.db = this.opts.uri ? this.opts.uri.replace(lvlCheck, '') : null;
    const useLevelDown = () => leveldown(this.opts.db, err => {
      if (err) {
        return this.emit('error', err);
      }
    })

    this.leveldb = levelup(this.opts.db === ':memory:'? memdown() : useLevelDown(), this.opts);
	}

	_getNamespace() {
		return `namespace:${this.namespace}`;
	}

	get(key) {
		return new Promise((resolve, reject) => {
      this.leveldb.get(key, { asBuffer: false }).then(value => {
        resolve(value);
      }).catch(err => {
				// console.log(err.type)
      	if (err.notFound) {
          resolve(undefined);
      	} else {
          reject(err);
      	}
      });
		});
	}

	set(key, value) {
		if (typeof value === 'undefined') {
			return Promise.resolve(undefined);
		}
		return this.leveldb.put(key, value).then(() => true);
	}

	delete(key) {
		return this.leveldb.get(key)
      .then(()=>{
        // key exists
        return this.leveldb.del(key).then(()=>true)
      })
      .catch(()=>false);
	}

	clear() {
		return new Promise((resolve, reject) => {
      if (this.opts.db !== ':memory:') {
				this.leveldb.once('closed', () => {
					leveldown.destroy(this.opts.db, err => {
						if (err) {
							reject(err);
						}
						this.leveldb.once('ready', ()=>{
							resolve()
						})
						this.leveldb.open().catch(reject)
					});
				});
				this.leveldb.close()
      } else {
				this.leveldb.close()
        this.leveldb = levelup(memdown(), this.opts)
				resolve()
      }
		})
	}
}

module.exports = KeyvLevelDB;
