/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
describe('Checking logger', function () {
	this.timeout(10000);

	var assert = require('assert');
	const log = require('../../Logger/log');

	it('Check if log.error is working', function checkArray(done) {
		assert.doesNotThrow(log.error);
		setImmediate(done);
	});
	it('Check if log.warn is working', function checkArray(done) {
		assert.doesNotThrow(log.warn);
		setImmediate(done);
	});
	it('Check if log.info is working', function checkArray(done) {
		assert.doesNotThrow(log.info);
		setImmediate(done);
	});
	it('Check if log.debug is working', function checkArray(done) {
		assert.doesNotThrow(log.debug);
		setImmediate(done);
	});
	it('Check if log.silly is working', function checkArray(done) {
		assert.doesNotThrow(log.silly);
		setImmediate(done);
	});
});
