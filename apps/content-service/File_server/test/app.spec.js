/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
var request = require('supertest');

describe('Checking app endpoints', function() {
	this.timeout(10000);
	var userId = '8b6796ef-52f6-433a-8b9a-678d82c1c059';
	var server;
	beforeEach(function() {
		delete require.cache[require.resolve('../app')];
		server = require('../app');
	});
	afterEach(function(done) {
		server.close(done);
	});
	it('responds to /', function testSlash(done) {
		request(server)
			.get('/')
			.expect(200, done);
	});
	it('will return data for hierarchy and check if hierarchy is working', function testHierarchy(done) {
		request(server)
			.get('/hierarchy/lex_17671697587995705000')
			.expect(200, done);
	});
	it('will check if the bookmarks API is working', function testBookmarks(done) {
		request(server)
			.get('/bookmarks/' + userId)
			.expect(200, done);
	});
	it('will check if the history API is working', function testBookmarks(done) {
		request(server)
			.get('/history/' + userId)
			.expect(200, done);
	});
	it('will check if the likes API is working', function testBookmarks(done) {
		request(server)
			.get('/likes/' + userId)
			.expect(200, done);
	});
	/*it('will check if the continue learning API is working', function testBookmarks(done) {
		request(server)
			.get(`/continue/${testUserEmail}`)
			.expect(200, done);
	});
	it('will check if the continue learning API is 400 for bad email ids', function testBookmarks(done) {
		request(server)
			.get('/continue/test123')
			.expect(400, done);
	});*/

	it('404 everything else', function testPath(done) {
		request(server)
			.get('/foo/bar')
			.expect(404, done);
	});
});
