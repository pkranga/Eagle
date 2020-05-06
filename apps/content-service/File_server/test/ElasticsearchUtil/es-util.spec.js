/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
var faker = require('faker');
var log = require('../../Logger/log');

var esUtil = require('../../ElasticsearchUtil/es-util');
var testData = ['do_2123992957815603201394', 'do_2123958242518876161180', 'do_2124121360472145921210'];

describe('Checking es util', function () {
	this.timeout(10000);

	var assert = require('assert');

	it('Check if the method does not accept string data type', function checkArray(done) {
		var testStr = 'sampleStr';
		esUtil.getDataForIdentifiers(testStr, function (err, result) {
			assert.equal(null, result);
			assert.notEqual(null, err);
			setImmediate(done);
		});
	});
	it('Check if the method does not accept empty array', function checkArray(done) {
		var emptyArr = [];
		esUtil.getDataForIdentifiers(emptyArr, function (err, result) {
			assert.equal(null, result);
			assert.notEqual(null, err);
			setImmediate(done);
		});
	});
	it('Check if get data for ids for one id is returning only one result', function testGetDataForIds(done) {
		var oneElemArray = testData.slice(1, 2);
		esUtil.getDataForIdentifiers(oneElemArray, function (err, result) {
			assert.notEqual(null, result);
			assert.equal(1, result.hits.total);
			setImmediate(done);
		});
	});
	it('will check if get data for ids is working', function testGetDataForIds(done) {
		esUtil.getDataForIdentifiers(testData, function (err, result) {
			assert.notEqual(null, result);
			assert.equal(testData.length, result.hits.total);
			setImmediate(done);
		});
	});

	it('will check if the user data from the es is throwing error when userid is empty', function testGetUser(done) {
		var sampleUserId = '';
		esUtil.getUserData(sampleUserId, function (err, result) {
			assert.notEqual(null, err);
			assert.deepEqual(err, {
				"msg": "User id cannot be null or empty"
			});
			setImmediate(done);
		});
	});

	it('will check if the user data from the es is giving no result for wrong user id', function testGetUser(done) {
		var sampleUserId = faker.random.uuid;
		esUtil.getUserData(sampleUserId, function (err, result) {
			assert.notEqual(null, err);
			assert.deepEqual(err, {
				statusCode: 404,
				error: {
					"error": 404,
					"errormsg": "USER NOT FOUND"
				}
			});
			setImmediate(done);
		});
	});

	it('will check if the user data from the es is working', function testGetUser(done) {
		var sampleUserId = '14537743-4552-4cfd-ab8d-dc550604378c';
		esUtil.getUserData(sampleUserId, function (err, result) {
			assert.notEqual(null, result);
			setImmediate(done);
		});
	});
});
