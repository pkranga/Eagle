/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
describe('Checking hierarchy', function () {
	this.timeout(10000);

	var assert = require('assert');
	const hierarchy = require('../../Hierarchy/hierarchy');

	it('Check if the method does not accept empty string', function checkArray(done) {
		var testStr = '';
		hierarchy.getHierarchyData(testStr, function (err, result) {
			assert.equal(null, result);
			assert.notEqual(null, err);
			assert.deepEqual({
				"error": "Bad request",
				"msg": "content id cannot be null or empty string, only a single single value is allowed"
			}, err);
			setImmediate(done);
		});
	});
	it('Check if the method does not accept array', function checkArray(done) {
		var testArr = [];
		hierarchy.getHierarchyData(testArr, function (err, result) {
			assert.equal(null, result);
			assert.notEqual(null, err);
			assert.deepEqual({
				"error": "Bad request",
				"msg": "content id cannot be null or empty string, only a single single value is allowed"
			}, err)
			setImmediate(done);
		});
	});
	it('Checks if the hierarchy for a resource is returning only one resource', function (done) {
		var resourceId = 'do_2124119429927731201170';
		hierarchy.getHierarchyData(resourceId, function (response) {
			assert.notEqual(null, response);
			assert.notEqual(response.result.content);
			assert.equal(0, response.result.content.children.length);
			setImmediate(done);
		});
	});
	it('Checks if the hierarchy for a course is returning entire course and its children', function (done) {
		var courseId = 'do_2123992957815603201394';
		hierarchy.getHierarchyData(courseId, function (response) {
			assert.notEqual(null, response);
			assert.notEqual(response.result.content);
			assert.equal(true, response.result.content.children.length > 0);
			setImmediate(done);
		});
	});
	it('Checks if the hierarchy for a course is not returning data for empty string', function (done) {
		var courseId = '';
		hierarchy.getHierarchyData(courseId, function (response) {
			assert.notEqual(null, response);
			assert.deepEqual({
				error: 'Bad request',
				msg: 'content id cannot be null or empty string, only a single single value is allowed'
			}, response);
			setImmediate(done);
		});
	});
});
