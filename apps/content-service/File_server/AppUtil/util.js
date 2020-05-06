/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
function isValidEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
	return re.test(String(email).toLowerCase());
}

function isNumeric(num) {
	return !isNaN(num);
}

function getDateDifferenceInHours(date1, date2) {
	return Math.abs(date1.valueOf() - date2.valueOf()) / 1000 / 60 / 60;
}

function getDateDifference(date1, date2) {
	return Math.abs(date1.valueOf() - date2.valueOf());
}

function arrayUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function isEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) return false;
	}

	return JSON.stringify(obj) === JSON.stringify({});
}

module.exports = {
	isValidEmail,
	isNumeric,
	getDateDifferenceInHours,
	getDateDifference,
	arrayUnique,
	isEmpty
};
