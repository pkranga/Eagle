/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
describe('Checking AccessTokenUtil', function () {
	this.timeout(10000);

	var assert = require('assert');
	const accessTokenUtil = require('../../AccessToken/accessTokenUtil');

	it('Check if access token util is working', function (done) {
		accessTokenUtil.getAccessToken(function (err, result) {
			assert.equal(null, err);
			assert.notEqual(null, result);
			assert.equal('object', typeof result);
			assert.notEqual(null, result.accessToken);
			assert.equal('string', typeof result.accessToken);
		});
		setImmediate(done);
	});
});
