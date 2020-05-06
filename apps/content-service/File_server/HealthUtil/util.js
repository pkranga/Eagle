/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const contentUtil = require('../Content/util');
const cassandraUtil = require('../CassandraUtil/cassandra');
const elasticsearchUtil = require('../ElasticsearchUtil/es-util');

function checkHealth() {
	return new Promise((resolve, reject) => {
		Promise.all([testCassandraConnection(), testESConnection(), testFileReadWritePermission()]).then((values) => {
			resolve(values);
		}).catch((e) => {
			console.error(e); // eslint-disable-line
			reject(e);
		});
	});
}

function testCassandraConnection() {
	return new Promise((resolve, reject) => {
		const query = 'select id from sunbird.user limit 1';
		cassandraUtil.executeQuery(query, [], (err, results) => {
			if (err) {
				console.error('Exception while connecting to cassandra', err); // eslint-disable-line
				return reject({
					type: 'Cassandra',
					msg: 'Unhealthy',
					err
				});
			}
			if (results.rows && results.rows.length>0) {
				return resolve({
					type: 'Cassandra',
					msg: 'Healthy',
				});
			}
			return reject({
				type: 'Cassandra',
				msg: 'Unhealthy',
				err
			});
		});
	});
}

function testESConnection() {
	return new Promise((resolve, reject) => { // eslint-disable-
		elasticsearchUtil.getDataForIdentifiers(['lex_123'], (err, result) => {
			if (err) {
				console.error('Exception while connecting to Elasticsearch', err); // eslint-disable-line
				return reject({
					type: 'Elasticsearch',
					msg: 'Unhealthy',
					err
				});
			}
			if (result) {
				return resolve({
					type: 'Elasticsearch',
					msg: 'Healthy',
				});
			}
			return reject({
				type: 'Elasticsearch',
				msg: 'Unhealthy',
				err
			});
		});
	});
}

function testFileReadWritePermission() {
	return new Promise((resolve, reject) => { // eslint-disable-line
		// For now only performing the read. To fix the 2TB extension error
		contentUtil.performHealthCheck().then(() => resolve({
			type: 'File System',
			msg: 'Healthy',
		})).catch(e => reject({
			type: 'File System',
			msg: 'Unhealthy',
			error: e
		}));
	});
}

module.exports = {
	checkHealth
};
