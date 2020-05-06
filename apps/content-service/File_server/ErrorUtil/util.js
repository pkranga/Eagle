/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const log = require('../Logger/log');

function badRequest(missingParams, requiredParams, type) {
	if (!validateBadRequestInput(missingParams, requiredParams, type)) {
		return null;
	} else {
		if (type == 'missing') {
			return {
				'error': 'Bad request',
				'message': {
					'text': 'All required fields are not present in the request',
					'required': requiredParams.toString(),
					'missing': missingParams.toString()
				}
			};
		} else if (type == 'mismatch') {
			return {
				'error': 'Bad request',
				'message': {
					'text': 'Input parameters mismatch',
					'required': requiredParams.toString(),
					'param': missingParams.toString()
				}
			};
		}
	}
}

function internalServerError(reason, message) {
	var response = {
		'error': 'Internal Server Error'
	};
	if (reason) {
		response.reason = reason;
	}
	if (message) {
		response.message = {
			'text': message
		};
	}
}

function validateBadRequestInput(missingParams, requiredParams, type) {
	if (!type) {
		log.error('Type is empty');
		return false;
	} else {
		if (type == 'missing') {
			if (!missingParams ||
				!(missingParams instanceof Array) ||
				missingParams.length < 1 ||
				!requiredParams ||
				!(requiredParams instanceof Array) ||
				requiredParams.length < 1) {

				log.error('Missing params or required params are empty');
				return false;
			} else {
				return true;
			}
		} else if (type == 'mismatch') {
			if (!missingParams ||
				typeof missingParams != 'string' ||
				missingParams.length < 1 ||
				!requiredParams ||
				typeof requiredParams != 'string' ||
				requiredParams.length < 1) {
				log.error('Missing params or required params are empty');
				return false;
			} else {
				return true;
			}
		}
	}
}

module.exports = {
	badRequest: badRequest,
	internalServerError: internalServerError
};
