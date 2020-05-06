/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*const fs = require('fs-extra');
function CacheService() {
	let configuration = {};
	this.init = (config) => {
		if (config.type === undefined) {
			throw 'type is mandatory in config object';
		}
		if (config.type == 'file') {
			let fileName = 'node-cache.json';
			console.log(`File name is: ${fileName}`); //eslint-disable-line

			// If file does not exist, creating it
			fs.ensureFileSync('./' + fileName);
		}
		configuration = config;
	};

	this.get = (key) => {
		// Read the json data from the file and send it back
		return `Key is ${key}`;
	};

	this.put = (key, value) => {
		// Read the current json and put the data into the file
		return `JSON ${value} for ${key} is saved into ${configuration.type}`;
	};
}

module.exports = new CacheService();
*/
const path = require('path');
const config = require('../ConfigReader/loader');
const resourceDirectory = config.getProperty('resource_directory') || '/';
const cacheLocation = path.resolve(
	resourceDirectory + path.sep + '.content-service-cache'
);

const flatCache = require('flat-cache');
const hierarchyCacheKey = 'hierarchy';
const cache = flatCache.load(hierarchyCacheKey, cacheLocation);

const count = 0;

function set(key, value, forceSave) {
	// Saving the data to cache
	cache.setKey(key, value);
	// Saving to disk, every 10 writes
	if (forceSave || count % 10 === 0) {
		cache.save();
	}
}

function get(key) {
	return cache.getKey(key);
}

function remove(key) {
	cache.removeKey(key);
	cache.save();
}

function getAll() {
	return cache.all();
}

const fse = require('fs-extra');
function removeAll() {
	// flatCache.removeAll();
	cache.removeCacheFile(true);
	flatCache.clearCacheById(hierarchyCacheKey);
}

module.exports = {
	set,
	get,
	remove,
	getAll,
	removeAll
}
