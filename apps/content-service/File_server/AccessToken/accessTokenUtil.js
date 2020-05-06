/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Request to get the data from ES
let request = require('request');

// Logger
let log = require('../Logger/log');

// Config loader
let config = require('../ConfigReader/loader');

// Cassandra Util
const cassandraUtil = require('../CassandraUtil/cassandra');

const appUtil = require('../AppUtil/util');

let accessToken = config.getProperty('access_token');
let expiresOn = config.getProperty('expires_on');
let refreshToken = config.getProperty('refresh_token');
const clientId = config.getProperty('client_id');
const clientSecret = config.getProperty('client_secret');

let resource = null;
let tokenType = null;

// Environment
const env = config.getProperty('NODE_ENV');

if (env && env.toLowerCase() == 'dev') {
	const username = config.getProperty('proxy_username');
	const password = config.getProperty('proxy_password');
	const proxyIp = config.getProperty('proxy_ip');
	const proxyPort = config.getProperty('proxy_port');
	request = request.defaults({
		'proxy': 'http://' + username + ':' + password + '@' + proxyIp + ':' + proxyPort
	});
}

/**
 *
 */


function getAccessToken(email, callback) {
	// Check if  is present. If email is not present, send back the normal access token
	if (email &&
		(typeof email == 'string') &&
		appUtil.isValidEmail(email) &&
		email.endsWith('')) {
		// Check if the access token is available in cassandra and it has not expired.
		const getParams = [
			email.toLowerCase()
		];

		let getUserAccessTokenQuery =
			`SELECT
				user_email,
				access_token,
				token_type,
				resource,
				expires_on,
				refresh_token
			from user_o365_details
			where user_email=?`;
		cassandraUtil.executeQuery(getUserAccessTokenQuery, getParams, function (err, result) {
			if (result.rows && result.rows.length == 1) {
				let userMSDataObj = {
					userEmail: result.rows[0].user_email,
					accessToken: result.rows[0].access_token,
					tokenType: result.rows[0].token_type,
					expiresOn: result.rows[0].expires_on.toString(),
					resource: result.rows[0].resource,
					refreshToken: result.rows[0].refresh_token
				};

				// If user's access token has expired, get the new access token using the refresh token
				if (((new Date().getTime() / 1000) + 60) > userMSDataObj.expiresOn) {
					// Updating the user's access token from his refresh token
					getNewAccessTokenFromRefreshToken(userMSDataObj.refreshToken, function (err, result) {
						if (err) {
							log.error(err);
							if (callback) {
								callback(err, null);
							}
						} else {
							saveAccessToken(result, userMSDataObj.userEmail, function (err, result) {
								callback(err, result);
							});
						}
					});
				} else {
					delete userMSDataObj.refreshToken;
					delete userMSDataObj.userEmail;
					callback(null, userMSDataObj);
				}
			} else {
				callback({
					code: 404,
					err: 'Access token of the user does not exist'
				}, null);
			}
		});
	} else {
		log.info('Non Infosys user OR no user id');
		// if callback is the only param
		if (!callback) {
			callback = email;
		}

		log.info('Current common token\'s expiry time is: ' + new Date(expiresOn * 1000));

		if (((new Date().getTime() / 1000) + 60) > expiresOn) {
			getNewAccessTokenFromRefreshToken(refreshToken, function (err, result) {
				if (err) {
					log.error(err);
					if (callback) {
						callback(err, null);
					}
				} else {
					log.info('New common token\'s expiry is:' + new Date(expiresOn * 1000));
					// log.info('Access token: ' + accessToken);
					if (callback) {
						// Setting the access token and the refresh token and the expires on at app level
						accessToken = result.access_token;
						refreshToken = result.refresh_token;
						expiresOn = result.expires_on.toString();
						tokenType = result.token_type;
						resource = result.resource;

						let responseObj = {
							accessToken: result.access_token,
							tokenType: result.token_type,
							expiresOn: result.expires_on.toString(),
							resource: result.resource
						};
						callback(null, responseObj);
					}
				}
			});
		} else {
			log.info('Common Token is still valid');
			log.verbose('Access token:\n' + accessToken);
			let responseObj = {
				accessToken: accessToken,
				tokenType: tokenType,
				expiresOn: expiresOn,
				resource: resource
			};
			if (callback) {
				callback(null, responseObj);
			}
		}
	}
}

function getNewAccessTokenFromRefreshToken(refreshToken, callback) {
	request.post({
		url: '',
		form: {
			'client_id': clientId,
			'scope': '',
			'refresh_token': refreshToken,
			'redirect_uri': 'http://localhost:3000',
			'grant_type': 'refresh_token',
			'client_secret': clientSecret
		}
	}, function (err, httpResponse, body) {
		if (err) {
			log.error('Error while trying to get the new access token');
			if (callback) {
				callback(err, null);
			}
		} else {
			let jsonBody = JSON.parse(body);

			if (httpResponse.statusCode != 200) {
				callback(jsonBody, null);
			} else {
				if (jsonBody) {
					callback(null, jsonBody);
				}
			}
		}
	});
}

// This will make an API call to the microsoft server and then get the data required for the user.
function getAccessTokenFromMSCode(msCode, redirectUrl, callback) {
	if (msCode) {
		try {
			request.post({
				url: 'https://login.microsoftonline.com/common/oauth2/token',
				form: {
					'client_id': clientId,
					'client_secret': clientSecret,
					'resource': '',
					'code': msCode,
					'redirect_uri': redirectUrl,
					'grant_type': 'authorization_code'
				}
			}, function (err, httpResponse, body) {
				if (err) {
					console.error('Error while trying to get the access token from code'); // eslint-disable-line
					console.error(err); // eslint-disable-line
					console.error(httpResponse); // eslint-disable-line
					if (callback) {
						callback(err, null);
					}
				} else {
					let jsonBody = JSON.parse(body);
					if (httpResponse.statusCode != 200) {
						console.error(jsonBody); // eslint-disable-line
						callback(jsonBody, null);
					} else {
						if (jsonBody) {
							callback(null, jsonBody);
						}
					}
				}
			});
		} catch (e) {
			callback({
				error: 'Internal server error'
			}, null);
		}
	} else {
		callback({
			error: 'Microsoft code cannot be empty'
		}, null);
	}
}

let jwt = require('jsonwebtoken');

function saveAccessToken(accessTokenJSON, userEmail, callback) {
	if (accessTokenJSON) {
		if (userEmail === null) {
			let userIdToken = jwt.decode(accessTokenJSON.id_token, {
				complete: true
			});
			userEmail = userIdToken.payload.unique_name;
		}
		const insertAccessTokenQuery = `
        insert into bodhi.user_o365_details (
		user_email,
		access_token,
		refresh_token,
		id_token,
		resource,
		expires_on,
		not_before,
		scope,
		token_type,
		date_inserted,
		date_modified
        ) values (
			 ?,
                ?,
                ?,
                ?,
                ?,
                ?,
			 ?,
			 ?,
			 ?,
                dateof(now()),
                dateof(now())
		  );`;

		const insertParams = [
			userEmail.toLowerCase(),
			accessTokenJSON.access_token,
			accessTokenJSON.refresh_token,
			accessTokenJSON.id_token,
			accessTokenJSON.resource,
			accessTokenJSON.expires_on,
			accessTokenJSON.not_before,
			accessTokenJSON.scope,
			accessTokenJSON.token_type
		];

		cassandraUtil.executeQuery(insertAccessTokenQuery, insertParams, function (err /*,result*/ ) {
			// Got back from cassandra
			if (err) {
				log.error(err);
				callback(err, null);
			} else {
				let resObj = {
					accessToken: accessTokenJSON.access_token,
					tokenType: accessTokenJSON.token_type,
					resource: accessTokenJSON.resource,
					expiresOn: accessTokenJSON.expires_on
				};
				callback(null, resObj);
			}

		});
	} else {
		callback({
			'error': 'Access token object cannot be empty'
		}, null);
	}
}

// Will generate the access token, save it into the DB and return the result on success.
function generateAndSaveAccessTokenFromCode(microsoftCode, redirectUrl, callback) {
	getAccessTokenFromMSCode(microsoftCode, redirectUrl, function (err, result) {
		if (!err && result) {
			saveAccessToken(result, null, function (err, result) {
				callback(err, result);
			});
		} else {
			callback(err, null);
		}
	});
}

module.exports = {
	getAccessToken: getAccessToken,
	generateAndSaveAccessTokenFromCode: generateAndSaveAccessTokenFromCode
};
