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

const statsUtil = require('./statsUtil');
router.get('/:count', async (req, res) => {
	res.status(200).send({
    'msg': 'OK',
    acknowledged: true
	});
	try {
		await statsUtil.saveData(req.params.count);
		// res.status(200).send(parseInt(users[0].users) + 1750);
	} catch (e) {
		console.error(e); //eslint-disable-line
	}
});

router.get('/data/now', async (req, res) => {
	try {
		const data = await statsUtil.getData();
		res.status(200).send(data);
	} catch (e) {
		console.error(e); //eslint-disable-line
		res.status(500).send({
			'msg': 'Error',
			code: 500
		});
	}
});
module.exports = router;
