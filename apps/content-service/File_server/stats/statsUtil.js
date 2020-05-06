/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Logger
var log = require('../Logger/log');

// Config loader
var config = require('../ConfigReader/loader');

// Mongo libs
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Mongo Client
const mongoHostLive = config.getProperty('mongo_host');
const mongoPort = config.getProperty('mongo_port');

// Connection URL
const urlLive = 'mongodb://' + mongoHostLive + ':' + mongoPort;

// Clients
var mongoClient = null;

// Use connect method to connect to the server
var options = {
	auth: {
		user: config.getProperty('mongo_user_name'),
		password: config.getProperty('mongo_password')
	}
};

connectToMongo();

function connectToMongo(callback) {
	if (mongoClient === null || !mongoClient.isConnected('telemetry')) {

		MongoClient.connect(urlLive, options, function (err, _client) {
			if (err) {
				if (callback) {
					callback(err, null);
				}
			} else {
				log.info('Connected successfully to Mongodb server');
				if (callback) {
					mongoClient = _client;
					callback(null, mongoClient);
				}
			}
		});
	} else {
		callback(null, mongoClient);
	}
}

function insertData(client, data, callback) {
	connectToMongo(function (err, client) {
		const db = client.db('stats');

		const collection = db.collection('stats');

		// console.log('Data in insert func is ', data);
		collection.insertMany(data, function (err, result) {
			if (err) {
				log.error(err);
				callback(err, null);
				return;
			}
			assert.equal(err, null);
			log.info('Inserted documents into the collection');
			callback(null, result);
		});
	});
}

const cassandra = require('cassandra-driver');
const cassandraLiveContactPoint = config.getProperty('cassandra_host');
const cassandraUsername = config.getProperty('cassandra_username');
const cassandraPassword = config.getProperty('cassandra_password');
const usersKeyspace = config.getProperty('users_keyspace');

var authProvider = new cassandra.auth.PlainTextAuthProvider(cassandraUsername, cassandraPassword); //eslint-disable-line

const cassandraClient = new cassandra.Client({
  contactPoints: [cassandraLiveContactPoint],
  keyspace: usersKeyspace,
  authProvider
});

// This method will try to connect to cassandra.
/**
 * Will make a pooled connection with cassandra
 */

function getLiveTNCAcceptedUsers() {
	return new Promise((resolve, reject) => { //eslint-disable-line
		const getTncQuery = 'select user_id from bodhi.user_terms_condition';
		let liveUserTNCUid = new Set();
		let count = 0;
		cassandraClient.stream(getTncQuery, [], { autoPage: true })
			.on('readable', function () {
				// readable is emitted as soon a row is received and parsed
				var row;
				while (row = this.read()) { //eslint-disable-line
					if (++count % 10000 == 0) {
						log.info('[PROCESSING] Processed TNC_users = '+ count +'....');
					}
					liveUserTNCUid.add(row['user_id']);
				}
			})
			.on('end', function () {
				log.info('[COMPLETED] TNC processed users = '+ count +'....');
				// console.log('People who accepted tnc :', liveUserTNCUid.size);
				// emitted when all rows have been retrieved and read
				resolve(liveUserTNCUid);
			});
	});
}

/*function getStagingTNCAcceptedUsers() {
	return new Promise((resolve, reject) => { //eslint-disable-line
		const getTncQuery = 'select userid from bodhi.user_terms_condition';
		let stagingUserTNCUid = new Set();

		stagingClientCassandra.stream(getTncQuery, [], { autoPage: true })
			.on('readable', function () {
				// readable is emitted as soon a row is received and parsed
				var row;
				while (row = this.read()) { //eslint-disable-line
					stagingUserTNCUid.add(row['userid']);
				}
			})
			.on('end', function () {
				// console.log('People who accepted tnc staging:', stagingUserTNCUid.size);
				// emitted when all rows have been retrieved and read
				resolve(stagingUserTNCUid);
			});
	});
}*/

let firstUsers = require('./users_1.json').map(user => user.email);
let secondUsers = require('./users_2.json').map(user => user.email);

function getTotalUsers() {

	return new Promise((resolve, reject) => { //eslint-disable-line
    const getUsersQuery = 'select userid, email from sunbird.user';

		let livePromise = new Promise((resolve, reject) => {
			let liveUsersEmails = {};
			let count = 0;
			cassandraClient.stream(getUsersQuery, [], { autoPage: true })
				.on('readable', function () {
					// readable is emitted as soon a row is received and parsed
					let row;
					while (row = this.read()) { //eslint-disable-line
						if (++count % 10000 == 0) {
							log.info('[PROCESSING] Processed users = '+ count +'....');
						}
						liveUsersEmails[row['userid']] = row['email'];
					}
				})
				.on('end', function () {
					log.info('[COMPLETED] Processing the users....');
					// console.log('Total users live:', Object.keys(liveUsersEmails).length);
					// emitted when all rows have been retrieved and read
					let userTNC = getLiveTNCAcceptedUsers();
					userTNC.then((tncUUID) => {
						let userEmails = new Set();

						tncUUID.forEach(uid => {
							if (liveUsersEmails[uid] != null || liveUsersEmails[uid] != undefined) {
								userEmails.add(liveUsersEmails[uid]);
							}
						});
						// console.log('Live Users who logged in accepted tnc:', userEmails.size);

						log.info('Count before 404 issue: ' + userEmails.size);
						// Adding the users that were deleted due to login failure 404 issue
						firstUsers.forEach(userEmail => {
							userEmails.add(userEmail);
						});
						secondUsers.forEach(userEmail => {
							userEmails.add(userEmail);
						});
						log.info('Count after 404 issue: ' + userEmails.size);

						resolve(userEmails);
					}, (error) => {
						console.error(error); // eslint-disable-line
						reject(error);
					});
				});
		});

		/*Promise.all([livePromise, stagingPromise]).then((values) => {
			// let totalUsers = values[0].filter(function(obj) { return values[1].indexOf(obj) == -1; });
			try {
				// console.log('Live TNC accepted users', values[0].size);
				// console.log('Staging TNC accepted users', values[1].size);
				let totalUsers = new Set([...values[0], ...values[1]]);
				console.log('Total users: ', totalUsers.size, 'Live users: ', values[0].size, 'Staging users:', values[1].size); //eslint-disable-line
				resolve(totalUsers.size);
			} catch (e) {
				console.error(e); //eslint-disable-line
			}
    });*/
    // Removing the logic and making sure that it writes to only Live server
    Promise.all([livePromise]).then((values) => {
			// let totalUsers = values[0].filter(function(obj) { return values[1].indexOf(obj) == -1; });
			try {
				// console.log('Live TNC accepted users', values[0].size);
				// console.log('Staging TNC accepted users', values[1].size);
				let totalUsers = new Set([...values[0]]);
        console.log('Total users: ', totalUsers.size, 'Live users: '); //eslint-disable-line
        const returnCount = totalUsers.size + 520 ; // 520 is approximate count in staging and live user difference, ios app pointing to staging issue
				resolve(returnCount);
			} catch (e) {
				console.error(e); //eslint-disable-line
      }
    });
	});
}

const ObjectId = require('mongodb').ObjectID;

function getActiveLearners() {
	return new Promise((resolve, reject) => {
		connectToMongo((err, client) => {
			let telemetryDb = client.db('telemetry');
			const collection = telemetryDb.collection('events_collection');

			collection.aggregate([{
				'$match': {
					'_id': {
						'$lte': ObjectId(Math.floor(new Date().getTime() / 1000).toString(16) + '0000000000000000'),
						'$gte': ObjectId(Math.floor((new Date().getTime() - 300000) / 1000).toString(16) + '0000000000000000')
					}
				}
			},
			{
				'$group': {
					'_id': '$bodhiuser.email',
				}
			},
			{
				'$count': 'count'
			}
			]).toArray(function (err, res) {
				console.log('Result is', res); //eslint-disable-line
				if (err || !res) {
          return reject();
        }
        if (res.length==0) {
          return resolve(0);
        }
				return resolve(res[0].count);
			});
		});
	});
}

function getDataFromDB() {
	return new Promise((resolve, reject) => {
		connectToMongo((err, client) => {
			let telemetryDb = client.db('stats');
			const collection = telemetryDb.collection('stats');

			collection.find({
				'timestamp': {
					'$gte': new Date(new Date().getTime() - (new Date().getTime() - (new Date().getTime() - (1000 * 60 * 30)))).getTime()
				}
			}).sort({
				timestamp: 1
			}).toArray(function (err, res) {
				if (err) reject();
				let loadArr = [];
				let usersArr = [];
				let learnersArr = [];
				// Changing the data format

				res.forEach(element => {
					loadArr.push({
						'time': element.timestamp,
						'count': parseFloat((parseInt(element.values.averageRequests) / 180).toFixed(2))
					});
					usersArr.push({
						'time': element.timestamp,
						'count': parseInt(element.values.totalUsers)
					});
					learnersArr.push({
						'time': element.timestamp,
						'count': parseInt(element.values.activeLearners)
					});
				});
				resolve({
					load: loadArr,
					users: usersArr,
					learners: learnersArr
				});
			});
		});
	});
}

const elasticsearch = require('elasticsearch');

const logsIndexPrefix = config.getProperty('logs_index_name_prefix');
const logsTypeName = config.getProperty('logs_type_name');
const logsServerhost = config.getProperty('logs_server_host');
const logsServerPort = config.getProperty('logs_server_port');

function getRequestCountFromESLogs() {
	return new Promise((resolve, reject) => { //eslint-disable-line
		let today = new Date();

		let year = today.getFullYear();
		let month = today.getMonth()+1;
		let date = today.getDate();

		// Prefixing the date with 0, if the number is less than 10, January will become 2018.01.01 instead of 2018.1.1
		month = month<10 ? '0' + month : month;
		date = date<10 ? '0' + date : date;

		let indexName = `${logsIndexPrefix}-${year}.${month}.${date}`;
		let typeName = logsTypeName;
		const client = new elasticsearch.Client({
      host: `${logsServerhost}:${logsServerPort}`,
			log: 'error'
		});
		log.info(`Index for Live traffic is: ${indexName}`);
		client.search({
			index: indexName,
			type: typeName,
			body: {
				'size': 0,
				'query': {
					'range': {
						'@timestamp': {'gte': 'now-3m'}
					}
				}
			}
		}, function result(error, response) {
			if (response && response.hits && response.hits.total) {
				resolve(response.hits.total);
			}
			resolve(0);
		});
	});
}
function saveData(noOfRequests) {
	return new Promise((resolve, reject) => {
		let requestCountPromise = noOfRequests;
		if (noOfRequests == 0) {
			requestCountPromise = getRequestCountFromESLogs();
		}
		let totalUsersPromise = getTotalUsers();
		let activeLearnersPromise = getActiveLearners();


		Promise.all([requestCountPromise,
			totalUsersPromise,
			activeLearnersPromise
		]).then((values) => {
			let data = {
				'timestamp': new Date().getTime(),
				'values': {
					'averageRequests': parseInt(values[0]),
					'totalUsers': (values[1]),
					'activeLearners': values[2]
				}
			};

			// console.log('Data is: ', data);

			insertData(mongoClient, [data], (err, result) => {
				if (err) {
					reject();
				}
				resolve(result);
			});
		}).catch(ex => {
			console.error(ex); //eslint-disable-line
			reject(ex);
		});
	});
}

module.exports = {
	saveData: saveData,
	getData: getDataFromDB
};
