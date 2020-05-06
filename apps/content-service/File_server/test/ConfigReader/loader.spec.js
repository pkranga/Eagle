/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
describe('Checking Config loader', function () {
	this.timeout(10000);

	var assert = require('assert');
	const configLoader = require('../../ConfigReader/loader');

	var validAppProps = ['port', 'resource_directory', 'es_host', 'es_port', 'es_index_name', 'es_sunbird_index_name', 'es_sunbird_user_type_name', 'mongo_host', 'mongo_port', 'mongo_notification_db_name', 'mongo_notification_collection_name', 'content_url', 'cassandra_host', 'cassandra_keyspace', 'access_token', 'refresh_token', 'expires_on'];

	it('Check if null is returned for empty string', function (done) {
		assert.equal(null, configLoader.getProperty(''));
		setImmediate(done);
	});

	it('Check if data is returned for valid entries on the props and env', function (done) {
		for (var i=0; i<validAppProps.length; i++) {
			assert.notEqual(null, configLoader.getProperty(validAppProps[i]));
		}
		setImmediate(done);
	});
});
