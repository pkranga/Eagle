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

const cassandraUtil = require('../CassandraUtil/cassandra');

const assessmentUtil = require('../Assessment/assessment');

function getQuizDetails(userId, type, callback) {
	const getQuizDetailsQuery =
		`select
            source_id as quizId,
            source_title as quizName,
            result_percent as assessmentPercent,
            pass_percent as passPercent,
            toUnixTimestamp(date_created) as assessmentDate
        from user_assessments where user_id=? ALLOW FILTERING;`;
	const insertParams = [userId];

	cassandraUtil.executeQuery(getQuizDetailsQuery, insertParams, function (err, results) {
		if (callback) {
			if (!err) {
				var currentResults = [];

				if (results) {
					for (var i = 0; i < results.rows.length; i++) {
						currentResults.push({
							'quizId': results.rows[i].quizid,
							'quizName': results.rows[i].quizname,
							'assessmentPercent': results.rows[i].assessmentpercent ? parseInt(results.rows[i].assessmentpercent) : 0,
							'passPercent': results.rows[i].passpercent ? parseInt(results.rows[i].passpercent) : 0,
							'isPassed': parseInt(results.rows[i].assessmentpercent) >= parseInt(results.rows[i].passpercent),
							'assessmentDate': parseInt(results.rows[i].assessmentdate)
						});
					}
				}
				callback(err, currentResults);
			} else {
				log.error('Error while inserting quiz', err);
				callback(err, results);
			}
		}
	});
}

const esUtil = require('../ElasticsearchUtil/es-util');

function getParentsContentId(contentId, callback) {
	esUtil.getParentResourceId(contentId, function (err, result) {
		if (err) {
			callback(err, null);
		} else {
			if (result.hits.hits && result.hits.hits.length == 1) {
				callback(null, result.hits.hits[0]._source.identifier);
			} else {
				if (result.hits.hits.length == 0) {
					callback({
						'err': 'Error',
						'msg': 'This quiz does not have a parent associated with it',
						'code': 404
					}, null);
				} else if (result.hits.hits.length > 1) {
					callback({
						'err': 'Error',
						'msg': 'This quiz has been re-used, please check with the content admin of the application',
						'code': 403
					}, null);
				} else {
					callback({
						'err': 'Error',
						'msg': 'Error processing the data',
						'code': 500
					}, null);
				}
			}
		}
	});
}

function updateAssessmentIsCorrectValues(data, callback) {
	assessmentUtil.getAssessmentResult(data.identifier, function (err, result) {
		// For each question, change the isCorrect option of the question in the options here
		if (result && result.questions) {
			for (var i = 0; i < result.questions.length; i++) {
				var questionId = result.questions[i].questionId;
				var correctOptions = [];
				for (var op_i = 0; op_i < result.questions[i].options.length; op_i++) {
					if (result.questions[i].options[op_i].isCorrect == true) {
						correctOptions.push(result.questions[i].options[op_i].optionId);
					}
				}
				// Updating the user selected objects here
				for (var j = 0; j < data.questions.length; j++) {
					if (data.questions[j].questionId == questionId) {
						// Update the options here
						for (var op_j = 0; op_j < data.questions[j].options.length; op_j++) {
							// If this option is part of correct answers, update the data here
							if (correctOptions.indexOf(data.questions[j].options[op_j].optionId) > -1) {
								data.questions[j].options[op_j].isCorrect = true;
							}
						}
					}
				}
			}
			callback(err, data);
		} else {
			callback({
				'msg': 'Results for this quiz does not exist on the server'
			}, null);
		}

	});
}

function processAndSaveQuiz(userId, data, callback) {
	try {
		// Validating the input
		// Title, identifier and questions are mandatory fields
		var isValidInput = validateQuizInput(data);
		if (isValidInput) {
			// If the quiz or assessment does not have a parent resource id, insert it into only one table, else insert into both the tables
			getParentsContentId(data.identifier, function (err, parentId) {
				if (err && err.code != 404) {
					callback(err, null);
					return;
				} else {
					var type = 'quiz';
					if (data.isAssessment) {
						type = 'assessment';
						// Change the data to take up the isCorrect from the assessment-key.json
						updateAssessmentIsCorrectValues(data, function (err, result) {
							if (err) {
								callback(err, result);
							} else {
								verifyAndSaveQuizData(data, type, userId, parentId, function (err, result) {
									// Send the response back here
									if (callback) {
										callback(err, result);
										return;
									}
								});
							}
						});
					} else {
						verifyAndSaveQuizData(data, type, userId, parentId, function (err, result) {
							// Send the response back here
							if (callback) {
								callback(err, result);
								return;
							}
						});
					}
				}
			});
		} else {
			if (callback) {
				callback({
					'err': 'Bad request',
					'msg': 'Title, identifier and questions are mandatory'
				}, null);
			}
		}
	} catch (e) {
		callback({
			'msg': 'Error while processing the request'
		}, null);
	}
}

function verifyAndSaveQuizData(data, type, userId, parentId, callback) {
	// We have updated data here with isCorrect option set as the correct value
	var processedData = processQuiz(data);
	processedData.userId = userId;
	processedData.type = type;

	//result for quiz i.e. in true/false if passed true else false
	var quizResult;
	if (processedData.passPercent <= processedData.resultPercent) {
		quizResult = true;
	} else {
		quizResult = false;
	}

	var twoTablesInsert = false;
	if (parentId && type.toLowerCase() == 'assessment') {
		// Updating the email and the parent id to be stored in the cohorts table
		processedData.parentId = parentId;
		processedData.userEmail = data.userEmail;
		twoTablesInsert = true;
	}
	saveQuizToCassandra(processedData, twoTablesInsert, function (err /*,result*/ ) {
		if (callback) {
			callback(err, quizResult);
		}
	});
}

// This will save the date of the quiz into the cassandra.
function saveQuizToCassandra(data, doInsertIntoBoth, callback) {
	const insertQuizQuery =
		`insert into bodhi.user_assessments (
            id,
            user_id,
            source_type,
            source_id,
            source_title,
            pass_percent,
            result_percent,
            date_created,
            date_modified
        ) values (
                now(),
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                dateof(now()),
                dateof(now())
            );`;
	const insertParams = [data.userId, data.type, data.quizId, data.quizTitle, data.passPercent, data.resultPercent];

	var batchQueries = [];
	// Query for inserting the data into the old table
	batchQueries.push({
		'query': insertQuizQuery,
		'params': insertParams
	});

	// Inserting into leader board table
	if (doInsertIntoBoth) {
		// Requirement for later, added on request. This will also push the quiz data to the new table where the user data will be populated for the Leader board and Cohorts.
		var insertQuizWithParentIdQuery =
			`insert into assessments_by_course_result(
				parent_source_id,
				result_percent,
				id,
				date_modified,
				date_created,
				pass_percent,
				source_id,
				source_title,
				source_type,
				user_id
			) values (
				?,
				?,
				now(),
				dateof(now()),
				dateof(now()),
				?,
				?,
				?,
				?,
				?
			)`;

		var userEmail = data.userEmail;

		var appUtil = require('../AppUtil/util');
		if (userEmail && appUtil.isValidEmail(userEmail)) {
			log.info('User email is present and is valid');
		} else {
			userEmail = data.userId;
		}
		const insertQuizWithParentIdParams = [data.parentId, data.resultPercent, data.passPercent, data.quizId, data.quizTitle, data.type, userEmail];

		// Query for inserting into the leader board table
		batchQueries.push({
			'query': insertQuizWithParentIdQuery,
			'params': insertQuizWithParentIdParams
		});
	}

	cassandraUtil.executeBatch(batchQueries, function (err, result) {
		// Got back from cassandra
		if (err) {
			log.error(err);
		}
		callback(err, result);
	});
	// cassandraUtil.executeQuery(insertQuizQuery, insertParams, function (err, result) {
	// 	// Got back from cassandra
	// 	callback(err, result);
	// });
}

// Processes the quiz and calculates the data and the result of the quiz and returns the result.
function processQuiz(data) {
	var questions = data.questions;

	var noOfQuestions = questions.length;
	var correctAnswers = 0;

	for (var i = 0; i < noOfQuestions; i++) {
		if (questions[i].multiSelection == false) {
			if (processNonMultiselection(questions[i].options)) {
				correctAnswers++;
			}
		} else {
			if (processMultiselection(questions[i].options)) {
				correctAnswers++;
			}
		}
	}

	var resultPercent = 0;
	if (correctAnswers > 0) {
		resultPercent = (correctAnswers / (noOfQuestions * 1.0)) * 100;
	}

	var dataToSave = {
		'quizTitle': data.title,
		'quizId': data.identifier,
		'passPercent': 60.0,
		'resultPercent': resultPercent
	};

	return dataToSave;

	function processMultiselection(options) {
		var finalResult = true;
		var isAnswered = false;
		for (var i = 0; i < options.length; i++) {
			// Quiz which was failing for multi selection
			/*if (options[i].userSelected == true) {
				isAnswered = true;
				if (options[i].isCorrect == false) {
					finalResult = false;
					log.info('Final result is marked false');
				}
			}*/
			// Getting all the correct options here
			if (options[i].isCorrect) {
				// If the option is correct, the answer should be selected by the user for the result to be true
				if (options[i].userSelected == true) {
					isAnswered = true;
				} else {
					// If the user has not selected this option, one of the option for the multi select has not been selected by the user and then the result is false
					finalResult = false;
					break;
				}
			} else {
				// Checking if the user has selected some option which was not correct
				if (options[i].userSelected == true) {
					isAnswered = true;
					finalResult = false;
				}
			}


		}
		if (!isAnswered) {
			return false;
		}
		return finalResult;
	}

	function processNonMultiselection(options) {
		var finalResult = false;
		var isAnswered = false;
		for (var i = 0; i < options.length; i++) {
			if (options[i].userSelected == true) {
				isAnswered = true;
				if (options[i].isCorrect == true) {
					finalResult = true;
				}
				break;
			}
		}
		if (!isAnswered) {
			return false;
		}
		return finalResult;
	}
}

function validateQuizInput(data) {
	if (data.title && data.identifier && data.questions) {
		return true;
	}
	return false;
}
module.exports = {
	getQuizDetails: getQuizDetails,
	processAndSaveQuiz: processAndSaveQuiz,
	validateQuizInput: validateQuizInput,
	getParentsContentId: getParentsContentId
};
