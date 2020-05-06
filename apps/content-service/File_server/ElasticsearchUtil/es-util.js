/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Request api
var request = require('request');

// App logger
var log = require('../Logger/log');

// Config loader
var config = require('../ConfigReader/loader');

// Elasticsearch configuration
const isHttps = (config.getProperty('IS_ES_HTTPS') == true)
const isESPasswordProtected = (config.getProperty('ES_PASSWORD_ENABLE') && config.getProperty('ES_PASSWORD_ENABLE').toString().toLowerCase()) === 'true';
const esUsername = config.getProperty('es_username');
const esPassword = config.getProperty('es_password');
const esHost = config.getProperty('es_host');
const esPort = config.getProperty('es_port');
const esIndexName = config.getProperty('es_index_name');

const esURL = `http${isHttps?'s': ''}://${esHost}:${esPort}/${esIndexName}/`;

var postBody = {
	'query': {
		'terms': {
			'identifier': null
		}
	}
};

// Gets the data for the list of identifiers.
function getDataForIdentifiers(ids, callback) {
	// Checking of the method accepts only array data whose length > 0
	if (ids === null || !(ids instanceof Array) || ids.length < 1) {
		if (callback) {
			callback({
				'error': 'Bad request',
				'msg': 'ids should be an array whose size is greater than 0'
			}, null);
		}
		return;
	}
	// Setting the identifiers to the new ids created.
	postBody.query.terms.identifier = ids;

	// Creating the request options. Maximum of 100 items will be sent as the response.
	var options = {
		headers: {
			'Authorization': getBasicHeader(esUsername, esPassword)
		},
		rejectUnauthorized: false,
		method: 'post',
		body: postBody,
		json: true,
		url: esURL + '_search?size=100'
	};

	// Making the request
	request(options, function (error, response, body) {
		if (error) {
			if (callback) {
				callback(error, null);
			}
		} else {
			// var responseBody = JSON.parse(body);
			if (callback) {
				callback(null, body);
			}
		}
	});
}

const esSunbirdIndexName = config.getProperty('es_sunbird_index_name');
const esSunbirdUserTypeName = config.getProperty('es_sunbird_user_type_name');

// Temporary fix to get the data of a user where the /user/me API was failing.
function getUserData(userId, callback) {
	if (!userId || userId.toString().length < 1) {
		if (callback) {
			callback({
				'msg': 'User id cannot be null or empty'
			}, null);
		}
	}

	const esURL = 'https://' + esHost + ':' + esPort + '/' + esSunbirdIndexName + '/' + esSunbirdUserTypeName + '/' + userId;

	var options = {
		headers: {
			'Authorization': getBasicHeader(esUsername, esPassword)
		},
		rejectUnauthorized: false,
		url: esURL
	};

	request(options, function (error, response, body) {
		if (error) {
			callback({
				statusCode: 500,
				error: error
			}, null);
		}
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			log.verbose('User data found for user: ' + userId);
			callback(null, info._source);
		}
		if (!error && response.statusCode == 404) {
			log.warn('error', error);
			log.warn('body', body);
			log.warn('statusCode', response.statusCode);
			log.warn('User not found with id: ' + userId);
			callback({
				statusCode: 404,
				error: {
					'error': 404,
					'errormsg': 'USER NOT FOUND'
				}
			}, null);
		}
	});
}

function getParentResourceId(contentId, callback) {
	if (contentId && contentId.toString().length > 1) {
		var requestObject = {
			'_source': ['identifier', 'contentType', 'children.identifier'],
			'query': {
				'terms': {
					'children.identifier': [
						contentId
					]
				}
			}
		};

		// Creating the request options. Maximum of 100 items will be sent as the response.
		var options = {
			headers: {
				'Authorization': getBasicHeader(esUsername, esPassword)
			},
			rejectUnauthorized: false,
			method: 'post',
			body: requestObject,
			json: true,
			url: esURL + '_search'
		};

		// Making the request
		request(options, function (error, response, body) {
			if (error) {
				if (callback) {
					callback(error, null);
				}
			} else {
				// var responseBody = JSON.parse(body);
				if (callback) {
					callback(null, body);
				}
			}
		});
	} else {
		if (callback) {
			callback({
				'error': 'Bad request',
				'msg': 'content id cannot be null'
			}, null);
		}
		return;
	}
}


/**
 * **Utility Method**
 * This method will return the Basic auth header using the user name and password provided
 * @param {username of Elasticsearch} username
 * @param {Password of Elasticsearch} password
 */
function getBasicHeader(username, password) {
	return 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
}


module.exports = {
	getDataForIdentifiers: getDataForIdentifiers,
	getUserData: getUserData,
	getParentResourceId: getParentResourceId,
	esUrl: `http${isHttps?'s': ''}://${esHost}:${esPort}`,
	authHeaders: {
		'Authorization': getBasicHeader(esUsername, esPassword)
	},
};
