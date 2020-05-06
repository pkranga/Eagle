/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const express = require('express');
const router = express.Router();
const request = require('request');

const config = require('../ConfigReader/loader');
const log = require('../Logger/log');

const telemetryIP = config.getProperty('live_telemetry_host');
const telemetryPort = config.getProperty('live_telemetry_port');
const sbExtIP = config.getProperty('live_sb_ext_host');
const sbExtPort = config.getProperty('live_sb_ext_port');
const contentIP = config.getProperty('live_content_host');
const contentPort = config.getProperty('live_content_port');

router.all('/telemetry', (req, res) => {
	log.info(`Live URL being proxied: http://${telemetryIP}:${telemetryPort}/${req.query.url}`);
	request({
		method: req.method,
		// body: req.body,
		uri: `http://${telemetryIP}:${telemetryPort}/${req.query.url}`
	}).pipe(res);
});

router.all('/sb-ext', (req, res) => {
	log.info(`Live URL being proxied: http://${sbExtIP}:${sbExtPort}/${req.query.url}`);
	request({
		method: req.method,
		// body: req.body,
		uri: `http://${sbExtIP}:${sbExtPort}/${req.query.url}`
	}).pipe(res);
});

router.all('/content', (req, res) => {
	log.info(`Live URL being proxied: http://${contentIP}:${contentPort}/${req.query.url}`);
	request({
		method: req.method,
		// body: req.body,
		uri: `http://${contentIP}:${contentPort}/${req.query.url}`
	}).pipe(res);
});

module.exports = router;
