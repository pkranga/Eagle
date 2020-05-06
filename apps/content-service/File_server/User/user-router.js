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
const log = require('../Logger/log');
// Underscore
const _ = require('underscore')._;

// Loading the ES util
const esUtil = require('../ElasticsearchUtil/es-util');
// User util
const userUtil = require('./util');

// App util
const appUtil = require('../AppUtil/util');

/**
 * This is a temporary API to provide the details of an user/me of sunbird. Will change this is future and will be replaced by a proper transactional REST API endpoint
 */
router.get('/user/:userId', (req, res) => {
	esUtil.getUserData(req.params.userId, (err, result) => {
		if (err) {
			if (err.statusCode == 404) {
				res.status(404).send({
					'id': 'api.user.read',
					'ver': 'v2',
					'ts': new Date().toDateString(),
					'params': {
						'resmsgid': null,
						'msgid': '88b209f5-6caf-46a2-9b23-996ef6825052',
						'err': 404,
						'status': 'fail',
						'errmsg': 'User not found'
					},
					'responseCode': 'NOT FOUND',
					'result': null
				});
			} else {
				res.status(500).send({
					'id': 'api.user.read',
					'ver': 'v2',
					'ts': new Date().toDateString(),
					'params': {
						'resmsgid': null,
						'msgid': '88b209f5-6caf-46a2-9b23-996ef6825052',
						'err': 500,
						'status': 'fail',
						'errmsg': 'Internal server error'
					},
					'responseCode': 'OK',
					'result': null
				});
			}
		} else {
			res.send({
				'id': 'api.user.read',
				'ver': 'v2',
				'ts': new Date().toDateString(),
				'params': {
					'resmsgid': null,
					'msgid': '88b209f5-6caf-46a2-9b23-996ef6825052',
					'err': null,
					'status': 'success',
					'errmsg': null
				},
				'responseCode': 'OK',
				'result': {
					'response': result
				}
			});
		}
	});
});


/**
 * This will serve the bookmarks,likes and history API
 */
const usageType = {
	'bookmarks': 'user_bookmarks',
	'history': 'user_history',
	'likes': 'user_likes'
};

router.get('/:type(history|bookmarks|likes){1}/:userId', (req, res) => {
	if (usageType[req.params.type] === null || usageType[req.params.type] === undefined) {
		res.status(404).send({
			'msg': 'Route not found'
		});
	} else {
		userUtil.getUserData(usageType[req.params.type], req.params.userId, (err, result) => {
			if (err) {
				res.status(500).send({
					msg: 'Error while fetching the bookmarks'
				});
			} else {
				if (!result.rows || result.rows.length < 1) {
					res.status(204).send();
					return;
				}
				var array = _.sortBy(result.rows, 'date_created').reverse();
				// res.send(array);

				if (array.length > 0) {
					var idsArr = [];
					for (var i = 0; i < array.length; i++) {
						idsArr.push(array[i]['content_id']);
					}

					// Sending the content for bookmarks and history
					if (req.params.type == 'likes') {
						res.send(idsArr);
					} else {
						var pageSize = req.query.pageSize || 10;
						var pageNumber = req.query.pageNumber || 0;

						pageSize = parseInt(pageSize);
						pageNumber = parseInt(pageNumber);

						log.info('PageSize: ' + pageSize + ' and PageNumber: ' + pageNumber);
						log.info('Picking up from: ' + (pageNumber*pageSize) + ' to ' + ((pageNumber+1)*pageSize));

						if (idsArr.length == 0 || idsArr.length < (pageNumber * pageSize) - 1) {
							res.status(204).send();
							return;
						}
						var dataRequired = idsArr.slice((pageNumber * pageSize), ((pageNumber + 1) * pageSize));

						esUtil.getDataForIdentifiers(dataRequired, (error, responseBody) => {
							if (error) {
								log.error(error);
								if (error.msg == 'ids should be an array whose size is greater than 0' && error.error == 'Bad request' && req.query.pageSize && pageNumber) {
									res.status(204).send();
									return;
								} else {
									res.status(500).send({
										msg: 'Error while fetching the ' + req.params.type
									});
									return;
								}
							} else {
								var content = responseBody['hits']['hits'];

								var esResults = [];
								if (content && content.length > 0) {
									for (var i = 0; i < content.length; i++) {
										esResults.push(content[i]['_source']);
									}
									// Now iterating over the array and pushing the results in order of ids Array
									var returnArr = [];
									for (var i_dataRequired = 0; i_dataRequired < dataRequired.length; i_dataRequired++) {
										for (var j = 0; j < esResults.length; j++) {
											if (dataRequired[i_dataRequired] == esResults[j]['identifier']) {
												returnArr.push(esResults[j]);
												continue;
											}
										}
									}
									res.send(returnArr);

								} else {
									res.send([]);
								}
							}
						});
					}
				} else {
					res.send([]);
				}
			}
		});
	}
});
router.post('/:type(history|bookmarks|likes){1}/:userId/:contentId', (req, res) => {
	if (usageType[req.params.type] === null || usageType[req.params.type] === undefined) {
		res.status(404).send({
			'msg': 'Route not found'
		});
	} else {
		// console.log('table Name', usageType[req.params.type]);
		userUtil.createUserData(usageType[req.params.type], req.params.userId, req.params.contentId, function (err/*, result*/) {
			if (err) {
				res.status(500).send({
					msg: 'Error while deleting the user bookmark'
				});
			} else {
				res.sendStatus(204);
			}
		});
	}
});
router.delete('/:type(history|bookmarks|likes){1}/:userId/:contentId', (req, res) => {
	if (usageType[req.params.type] === null || usageType[req.params.type] === undefined) {
		res.status(404).send({
			'msg': 'Route not found'
		});
	} else {
		userUtil.deleteUserData(usageType[req.params.type], req.params.userId, req.params.contentId, function (err/*, result*/) {
			if (err) {
				res.status(500).send({
					msg: 'Error while deleting the user bookmark'
				});
			} else {
				res.sendStatus(204);
			}
		});
	}
});

// Adding the user preference save and retrieve data
router.get('/user/preferences/:userEmail', (req, res) => {
	if (!appUtil.isValidEmail(req.params.userEmail)) {
		res.status(400).send({
			code: 400,
			msg: 'Bad request. User email is invalid'
		});
		return;
	}
	userUtil.getUserPreferences(req.params.userEmail, (err, result) => {
		if (err) {
			res.status(500).send({
				code: 500,
				msg: 'Internal server error while saving the user preferences'
			});
			console.error(err); //eslint-disable-line
		} else {
			if (result.rows && result.rows.length>0) {
				let preferenceData = {};
				try {
					preferenceData = JSON.parse(result.rows[0].preference_data);
				} catch(e){
					console.error(e); //eslint-disable-line
				}
				res.send({
					preferenceData: preferenceData,
					dateUpdated: parseInt(result.rows[0].date_updated) || 0
				});
			} else {
				res.status(204).send();
			}
		}
	});
});

router.post('/user/preferences/:userEmail', (req, res) => {
	// save request.body. Read it as a string and save it as a string
	if (!appUtil.isValidEmail(req.params.userEmail)) {
		res.status(400).send({
			code: 400,
			msg: 'Bad request. User email is invalid'
		});
		return;
	}
	if (req.body === null || req.body === undefined) {
		res.status(400).send({
			code: 400,
			msg: 'Bad request. Preferences should be part of the request body.'
		});
		return;
	}
	// Send the preferences data. Read it as a string an send it back as a json
	userUtil.saveUserPreferences(req.params.userEmail, JSON.stringify(req.body), (err, result) => { // eslint-disable-line
		if (err) {
			res.status(500).send({
				code: 500,
				msg: 'Internal server error while saving the user preferences'
			});
			console.error(err); //eslint-disable-line
		} else {
			res.status(204).send();
		}
	});
});
module.exports = router;
