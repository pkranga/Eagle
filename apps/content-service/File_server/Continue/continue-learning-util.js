/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Cassandra util
const cassandraUtil = require('../CassandraUtil/cassandra');
const log = require('../Logger/log');
const config = require('../ConfigReader/loader');

const defaultContinueLearningPageSize = config.getProperty('continue_learning_page_size') || 5;

function saveData(userEmail, data) {
	return new Promise((resolve, reject) => {
		// Data to batch queries
		// let batchQueries = [];
		// Insert queries for continue learning
		const insertQuery = 'INSERT INTO bodhi.continue_learning (user_email, resource_id, context_path_id, date_accessed, data) values (?, ?, ?, ?, ?) '; // USING TTL ${getTimeToLive()}
		// params for delete query
		const insertQueryParams = [userEmail, data.resourceId, data.contextPathId, new Date().getTime(), data.data];

		// Inserting the batch query for deleting the existing entry
		// batchQueries.push({
		// 	'query': insertQuery,
		// 	'params': insertQueryParams
		// });

		/*
		// Inserting the data into the continue learning now
		const insertResourceQuery = 'INSERT into bodhi.resource_visit_completion(user_email, resource_id, percent_complete, unix_time_inserted) values (?, ?, ?, ?)';
		// params for resource_visit completion
		const insertResourceParams = [userEmail, data.resourceId, data.percentComplete, new Date().getTime()];


		batchQueries.push({
			'query': insertResourceQuery,
			'params': insertResourceParams
		});

		*/

		cassandraUtil.executeQuery(insertQuery, insertQueryParams, (err, result) => {
			if (!err && result) {
				log.info('Saved data for continue learning');
				resolve();
			} else {
				log.error('Error while saving data continue learning');
				reject(err);
			}
		});
	});
}

const request = require('request');
const constants = require('../Constants/constants');

const sbExtIP = config.getProperty('sb_ext_ip');
const sbExtPort = config.getProperty('sb_ext_port');

function saveDataToJavaDriver(userEmail, data) {
	return new Promise((resolve, reject) => {
		try {
			let url = `http://${sbExtIP}:${sbExtPort}${constants.URL_ENDPOINTS.SB_EXT.CONTINUE_LEARNING}/${userEmail}`;
			let options = {
				method: 'post',
				body: {
					request: data
				},
				json: true,
				url: url
			};
			request(options, function (err, res, body) {
				if (err) {
					console.error('error posting json: ', err); //eslint-disable-line
					reject(err);
				}
				// console.log('headers: ', headers); //eslint-disable-line
				// console.log('statusCode: ', statusCode); //eslint-disable-line
				// console.log('body: ', body); //eslint-disable-line
				if (res.statusCode == 200) {
					resolve(body);
				} else {
					reject(body);
				}
			});
		} catch (e) {
			console.error(e); // eslint-disable-line
			reject(e);
		}
	});
}

// Gets all data as well as the data for only one contextual path. If contextual path is passed, data only for that path is fixed.
function getDataForContinueLearning(userEmail, contextPathId, pageSize, pageState) {
	return new Promise((resolve, reject) => {
		let getQuery = 'select context_path_id, resource_id, data from bodhi.mv_continue_learning where user_email=?';
		let params = [userEmail];

		// If the context path is requested, we fetch the data directly from the table instead of the material view. The material view has date as the primary key and prior to contextual path id for ordering as per the timestamp. Hence without adding a condition to date we cannot add condition to contextual path.

		// For this purpose, we will query the table directly for data required for contextual path and for rest, we will query from material view.
		if (contextPathId) {
			getQuery = 'select context_path_id, resource_id, data from bodhi.continue_learning where user_email=? AND context_path_id=?';
			params.push(contextPathId);
		}

		const options = {
			prepare: true,
			fetchSize: pageSize || defaultContinueLearningPageSize,
			pageState: pageState
		};


		cassandraUtil.executePaginatedQueries(getQuery, params, options).then((result) => {
			resolve(result);
		}, (err) => {
			console.error(err); //eslint-disable-line
			reject(err);
		});
	});
}

function convertDataToUICardData(allContextualIds, result, newIdsObj) {
	// Converting the result that is got from ES sort according to the id's got from cassandra
	let sortedResult = [];
	allContextualIds.map(id => {
		for (let i_result = 0; i_result < result.length; i_result++) {
			if (result[i_result]._source.identifier === id) {
				sortedResult.push(result[i_result]);
				break;
			}
		}
	});
	let endResults = sortedResult.map(element => {
		let newElem = {};

		let continueLearningData = {
			contextualPathId: element._source.identifier,
			resourceId: newIdsObj[element._source.identifier].resourceId,
			data: newIdsObj[element._source.identifier].data
		};

		newElem.identifier = element._source.identifier;
		newElem.artifactUrl = element._source.artifactUrl;
		newElem.name = element._source.name;
		newElem.duration = element._source.duration;
		newElem.appIcon = element._source.appIcon;
		newElem.contentType = element._source.contentType;
		newElem.resourceType = element._source.resourceType;
		newElem.lastUpdatedOn = element._source.lastUpdatedOn;
		newElem.mimeType = element._source.mimeType;
		newElem.mediaType = element._source.mediaType;
		newElem.sourceShortName = element._source.sourceShortName;
		newElem.description = element._source.description;
		newElem.complexityLevel = element._source.complexityLevel;
		newElem.me_totalSessionsCount = element._source.me_totalSessionsCount;
		newElem.size = element._source.size;
		newElem.resourceCategory = element._source.resourceCategory;
		newElem.downloadUrl = element._source.downloadUrl;
		newElem.clients = element._source.clients;
		newElem.continueLearningData = continueLearningData;

		return newElem;
	});
	return endResults;
}

module.exports = {
	saveData: saveData,
	saveDataToJavaDriver: saveDataToJavaDriver,
	getData: getDataForContinueLearning,
	convertDataToUICardData: convertDataToUICardData
};
