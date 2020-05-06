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
// Underscore
const _ = require('underscore')._;

/**
    This accepts the data for an quiz for a user and also provides the data for a users for all the quiz that the user has answered. This API will calculate the results as well. Right now there the
 */
const quizUtil = require('./quizUtil');
router.get('/quiz/:userId', function (req, res) {
	quizUtil.getQuizDetails(req.params.userId, 'quiz', function (err, result) {
		if (err) {
			res.status(500).send({
				'msg': 'Error while getting the quiz data'
			});
		} else {
			var sortedResults = _.sortBy(result, 'assessmentDate').reverse();
			res.send(sortedResults);
		}
	});
});
router.post('/quiz/:userId', function (req, res) {
	if (quizUtil.validateQuizInput(req.body)) {
		quizUtil.processAndSaveQuiz(req.params.userId, req.body, function (err, result) {
			if (err) {
				if (err.err == 'Bad request') {
					res.status(400).send(err);
				} else {
					res.status(500).send({
						'msg': 'Internal Server Error',
						'err': err
					});
				}
				return;
			} else {
				//res.sendStatus(204);
				res.send(result);
			}
		});
	} else {
		res.status(400).send({
			'err': 'Bad request',
			'msg': 'Title, identifier and questions are mandatory'
		});
	}
});
module.exports = router;
