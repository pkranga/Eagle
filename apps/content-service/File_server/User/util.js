/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Cassandra Util
var cassandraUtil = require('../CassandraUtil/cassandra');

// Getting all the details (history, bookmarks, likes) for a user
function getUserData(tableName, userId, callback) {
	// Query to get the data from a table as requested by the request param
	const getBookMarksQuery =
		'SELECT * from bodhi.' + tableName + '  where user_id=?;';
	// Adding the userId to the prepared statement
	const getParams = [userId];
	cassandraUtil.executeQuery(getBookMarksQuery, getParams, function(
		err,
		result
	) {
		// Got back from cassandra. Once we get the data, we send back the data to the caller of the function. If there is an error, the err would not be null and the result would be null, and vice-versa
		callback(err, result);
	});
}

// Creating a details (history, bookmarks, likes) for a user
function createUserData(tableName, userId, contentId, callback) {
	// Insert query for inserting the data for user into the respective table.
	const insertBookMarksQuery =
		'insert into bodhi.' +
		tableName +
		' (user_id, content_id, date_created) values (?, ?, dateof(now()));';
	// Adding the params to the statement.
	const insertParams = [userId, contentId];

	// The flow is such that if a user has done the same action on the same content, only the latest transaction is saved in cassandra. History is not. Hence deleting existing records if any and inserting the latest transaction into the DB.
	deleteUserData(tableName, userId, contentId, function(err /*, result*/) {
		if (err) {
			callback(err, null);
		} else {
			cassandraUtil.executeQuery(
				insertBookMarksQuery,
				insertParams,
				function(err, result) {
					// Got back from cassandra
					callback(err, result);
				}
			);
		}
	});
}

// Deleting the details (history, bookmarks, likes) for a user
function deleteUserData(tableName, userId, contentId, callback) {
	// Delete query for the user. Which deletes the data
	const deleteBookMarksQuery =
		'DELETE FROM bodhi.' +
		tableName +
		' WHERE user_id=? AND content_id=?;';
	const deleteParams = [userId, contentId];
	cassandraUtil.executeQuery(deleteBookMarksQuery, deleteParams, function(
		err,
		result
	) {
		// Got back from cassandra
		callback(err, result);
	});
}

// Saving the user preferences
function saveUserPreferences(userEmail, userPreferences, callback) {
	// Query to put data into user preferences
	const insertPreferencesQuery =
		'INSERT INTO bodhi.user_preferences(user_email, preference_data, date_updated) values (?,?,?)';
	const insertParams = [userEmail, userPreferences, new Date().getTime()];

	// Running the query to insert the data into cassandra
	cassandraUtil.executeQuery(
		insertPreferencesQuery,
		insertParams,
		(err, result) => callback(err, result)
	);
}

function getUserPreferences(userEmail, callback) {
	// Query to fetch the user preferences
	const selectPreferencesQuery =
		'SELECT user_email, preference_data, date_updated FROM bodhi.user_preferences WHERE user_email=?';
	const selectParams = [userEmail];

	// Running the query to fetch the data from user preferences
	cassandraUtil.executeQuery(
		selectPreferencesQuery,
		selectParams,
		(err, result) => callback(err, result)
	);
}

// This cache will store the data in the following format
/**
 * {
 * }
 */
const userCache = {};
function getUserEmailFromUUID(uuid) {
	return new Promise((resolve, reject) => {
		// Check if uuid reference is available on cache
		if (userCache[uuid] !== undefined) {
			// console.log('Returning from cache');
			resolve(userCache[uuid]);
		} else {
			// Get the data from cassandra and save in cache. Then return
			const query = 'select email from sunbird.user where id=?';
			const params = [uuid];
			cassandraUtil.executeQuery(query, params, (err, res) => {
				if (err) {
					reject(err);
				}
				if (res.rows && res.rows.length==1 && res.rows[0].email) {
					userCache[uuid] = res.rows[0].email;
					resolve(res.rows[0].email);
				}
				reject(new Error('User not found'));
			});
		}
	});
}
module.exports = {
	getUserData,
	deleteUserData,
	createUserData,
	saveUserPreferences,
	getUserPreferences,
	getUserEmailFromUUID,
};
