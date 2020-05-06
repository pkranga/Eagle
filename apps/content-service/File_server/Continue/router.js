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
const validator = require('validator');
// Util for performing the tasks
const continueLearningUtil = require('./continue-learning-util');
// ES util to get the meta data
const esUtil = require('../ElasticsearchUtil/es-util');
// User util to read email from uuid
const userUtil = require('../User/util');

let config = require('../ConfigReader/loader');
let appUtil = require('../AppUtil/util');

// Logger
let log = require('../Logger/log');

// Get the current continue learning strip
/**
 * @apiDescription API to get the data for a continue learning strip for a user.
 *
 * @api {GET} /:userId/:collectionId? Request to get the data for continue learning strip
 * @apiName GetContinueLearning
 * @apiGroup ContinueLearning
 * @apiParam (URI Param) {String} userId user's email ID
 * @apiParam (URI Param) {String} collectionId Collection id of a contextual path
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {JSON} data Continue learning data for the home screen strip with only required fields.
 * @apiSuccess {String} contentURL The url where this content will be available after the successful upload
 * @apiSuccessExample Success response: 201
 * 	HTTPS 200 Success
 * 	[
		{
			'identifier': 'lex_2123301254260217448047',
			'artifactUrl': ',
			'name': 'Digital Landscape',
			'duration': 838,
			'appIcon': 'http://<content_url>:<content_port>/content/ETA/lex_2123301254260217448047/Slide115.png?type=artifacts',
			'contentType': 'Collection',
			'resourceType': ',
			'lastUpdatedOn': '2017-11-06T10:51:58.367000+0000',
			'mimeType': 'application/vnd.ekstep.content-collection',
			'mediaType': 'content',
			'sourceShortName': 'DT',
			'description': 'Presents an overall landscape of digital technologies. Includes topics such as web, mobility, conversational interfaces, machine learning, microservices, etc',
			'complexityLevel': 'Beginner',
			'me_totalSessionsCount': 3,
			'size': 39498341,
			'downloadUrl': ',
			'continueLearningData': {
				'contextualPathId': 'lex_2123301254260217448047',
				'resourceId': 'lex_2654278469353550925059',
				'data': '{\'key\': \'value\'}'
			}
		}
	]

 *  @apiError (Response Error) Conflict:400 A content directory with this contentId and  organization does not exist
 *  @apiErrorExample Error-Response: 400
 *HTTP/1.1 400 BadRequest
 *{
 *  'code': 400,
 *  'message': 'Content directory does not exists. First create the content directory to store/upload/update the files in them',
 *  'error': 'bad request'
 *}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       'error': 'Internal Server Error'
 *     }
 */

router.get(
	'/:userId/:collectionId?',
	validateGetRequest,
	getUsersContinueLearningData
);

// Post the data for continue learning
router.post('/:userId', validateSaveRequest, saveUsersContinueLearningData);

// Checks for a user email and if valid sends the data for his continue learning
async function getUsersContinueLearningData(req, res) {
	try {
		let userEmail = req.params.userId;
		if (validator.isUUID(req.params.userId)) {
			// Get the email from the UUID
			// userEmail =
			try {
				userEmail = await userUtil.getUserEmailFromUUID(
					req.params.userId
				);
			} catch (e) {
				console.error(e); // eslint-disble-line
				throw e;
			}
		}

		let queryResults = await continueLearningUtil.getData(
			userEmail,
			req.params.collectionId,
			req.query.pageSize,
			req.query.pageState
		);
		let allResults = queryResults.results;
		let pageState = queryResults.pageState;
		let pageSize = queryResults.pageSize;

		let newIdsObj = {};
		allResults.forEach(element => {
			newIdsObj[element.context_path_id] = {
				resourceId: element.resource_id,
				data: element.data
			};
		});

		let allContextualIds = Object.keys(newIdsObj);

		if (allContextualIds.length > 0) {
			esUtil.getDataForIdentifiers(allContextualIds, (err, result) => {
				try {
					if (result === null || result === undefined) {
						throw 'Could not fetch the data from the ES after retrieving the data from Cassandra';
					} else {
						if (
							result.hits &&
							result.hits.hits &&
							result.hits.hits.length > 0
						) {
							res.send({
								results: continueLearningUtil.convertDataToUICardData(
									allContextualIds,
									result.hits.hits,
									newIdsObj
								),
								pageState: pageState,
								pageSize: pageSize
							});
						} else {
							res.status(204).send();
						}
					}
				} catch (e) {
					console.error(e); // eslint-disable-line
					res.status(500).send({
						code: 500,
						msg: 'Error while fetching content meta'
					});
				}
			});
		} else {
			res.status(204).send();
		}
	} catch (ex) {
		console.error(ex); //eslint-disable-line
		res.status(500).send({
			code: 500,
			msg: 'Error fetching the data'
		});
	}
}

function validateSaveRequest(req, res, next) {
	if (appUtil.isEmpty(req.body)) {
		res.status(400).send({
			code: 400,
			msg: 'Request body is empty'
		});
		log.error(
			`Request for continue learning is empty ${req.originalUrl}`
		);
		return;
	}

	if (
		!validator.isEmail(req.params.userId) &&
		!validator.isUUID(req.params.userId)
	) {
		res.status(400).send({
			code: 400,
			msg: 'User email or uuid is in-valid'
		});
		return;
	}
	next();
}

// Checks the user email and saves the data for his continue learning
async function saveUsersContinueLearningData(req, res) {
	const saveContinueThroughJava = config.getProperty(
		'save_continue_through_java'
	);
	try {
		let result;
		if (saveContinueThroughJava == '1') {
			result = await continueLearningUtil.saveDataToJavaDriver(
				req.params.userId,
				req.body
			);
		} else {
			result = await continueLearningUtil.saveData(
				req.params.userId,
				req.body
			);
		}
		res.status(200).send(result);
	} catch (ex) {
		res.status(500).send({
			code: 500,
			msg: 'Error saving the data'
		});
	}
}

// Get request validations
function validateGetRequest(req, res, next) {
	// Email id check
	if (
		!validator.isEmail(req.params.userId) &&
		!validator.isUUID(req.params.userId)
	) {
		res.status(400).send({
			code: 400,
			msg: 'User email or id is in-valid'
		});
		return;
	}
	// Page size check range 1-99
	if (req.query.pageSize && !appUtil.isNumeric(req.query.pageSize)) {
		res.status(400).send({
			code: 400,
			msg: 'Page size is in-valid. Page size should be a number'
		});
		return;
	} else {
		if (
			req.query.pageSize &&
			(parseInt(req.query.pageSize) > 99 ||
				parseInt(req.query.pageSize) < 1)
		) {
			res.status(400).send({
				code: 400,
				msg: 'Page size is out of permissable range [1-99]'
			});
			return;
		}
	}
	next();
}

module.exports = router;
