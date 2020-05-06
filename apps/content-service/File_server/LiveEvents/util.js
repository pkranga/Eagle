/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const cassandraUtil = require('../CassandraUtil/cassandra');

function saveLiveEventData(params) {
	return new Promise((resolve, reject) => {
		const query =
			'insert into bodhi.live_events(event_name,start_time,event_url,end_time) values (?,?,?,?)';

		cassandraUtil.executeQuery(query, params, (err) => {
			if (err) {
				console.error(err); //eslint-disable-line
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

function getAllLiveEvents() {
	return new Promise((resolve, reject) => {
		const query = 'select * from bodhi.live_events';

		cassandraUtil.executeQuery(query, [], (err, res) => {
			if (err) {
				console.error(err); //eslint-disable-line
				reject(err);
			} else {
				console.log('Rows', res); //eslint-disable-line
				resolve(res.rows);
			}
		});
	});
}

module.exports = { saveLiveEventData, getAllLiveEvents };
