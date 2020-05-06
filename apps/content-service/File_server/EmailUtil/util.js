/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const config = require('../ConfigReader/loader');
var sendmail = null;
const smtpHost = config.getProperty('smtp_host');
if (process.env.NODE_ENV === 'production' && config.getProperty('send_email') === 'true') {
	sendmail = require('sendmail')({
		devHost: config.getProperty('smtp_host'),
		devPort: 25,
		silent: true
	});
}

function sendEmail(mailConfig) {
	if (sendmail && smtpHost) {
		return new Promise((resolve, reject) => {
			sendmail(
				{
					...mailConfig, // eslint-disable-line
					html: mailConfig.isHtml ? mailConfig.msg : '',
					text: mailConfig.msg
				},
				function(err, reply) {
					console.log('Error is: ', err + '\n\n\n');
					console.log('Reply is: ', reply+ '\n\n\n');
					if (err) {
						console.error('Error is:' + err);
						reject(new Error(err));
					}
					// console.log(err && err.stack)
					// console.dir('Reply is' + reply)
					if (reply) {
						console.log('Reply from SMTP server is: ', reply + '\n\n\n');
						console.log(`Email sent to ${mailConfig.to}` + '\n\n\n' );
						resolve({
							msg: `Email sent to ${mailConfig.to}`
						});
					}
				}
			);
		});
	} else {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
}

module.exports = { sendEmail };
