/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const router = require('express').Router();
const util = require('./util');

router.post('/send', (req, res) => {
	console.log('Req body is', req.body); //eslint-disable-line
	util.sendEmail(req.body).then(result => {
		res.send('Done');
		console.log(result); //eslint-disable-line
	}).catch((e) => {
		console.error(e); //eslint-disable-line
		res.status(500).send({
			msg: 'Error while sending the email'
		});
	});
});

module.exports = router;
