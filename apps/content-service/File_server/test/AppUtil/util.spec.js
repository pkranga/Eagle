/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const faker = require('faker');
const log = require('../../Logger/log');

describe('Checking app util', function () {
	this.timeout(10000);

	var assert = require('assert');

	var appUtil = require('../../AppUtil/util');
	it('Check if the method accepts valid email 100 ids', function checkArray(done) {
		var testEmailArr = [];
		for (var i=0; i<100; i++) {
			testEmailArr.push(faker.internet.email());
		}
		for (var j=0; j<testEmailArr.length; j++) {
			assert.equal(true, appUtil.isValidEmail(testEmailArr[j]));
		}
		setImmediate(done);
	});

	it('Check if the method does not accept invalid email ids', function checkArray(done) {
		var testEmailArr = ['anc123', '1213.132', 'IP-ADDR'];
		for (var j=0; j<testEmailArr.length; j++) {
			assert.equal(false, appUtil.isValidEmail(testEmailArr[j]));
		}
		setImmediate(done);
	});
});
