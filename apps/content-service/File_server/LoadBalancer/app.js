/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Load balancer application
// Load balancer balancer application created for Keycloak applications
// App logger
const log = require('../Logger/log');
// Config loader
const config = require('../ConfigReader/loader');

const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();
let cursor = 0;

const loadBalancer = require('express')();

// Will define what is the host that needs to be selected
function selectProxyHost() {
	let servers = config.getProperty('lb_address').split(',') || [];
	var response = servers[cursor];

	// Round robin the cursor value
	cursor = (cursor + 1) % servers.length;
	return response;
}
// This is where the mapping of the requests happen where the requests will be load balanced.
loadBalancer.all('*', (req, res) => {
	let value = selectProxyHost() || '';
	if (value && value.toString() && value.toString().length > 0) {
		log.info('Redirected to: ' + value);
		apiProxy.web(req, res, {
			target: value
		});
	}
});

// Port and starting the app for the load balancer
const loadBalancerPort = config.getProperty('lb_port');
loadBalancer.listen(loadBalancerPort, function () {
	log.info('Load balancer successfully started on port:' + loadBalancerPort);
});

module.exports = loadBalancer;
