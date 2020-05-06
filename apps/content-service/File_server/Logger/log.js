/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const winston = require('winston');

const myCustomLevels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,
		verbose: 3,
		debug: 4,
		silly: 5
	},
	colors: {
		error: 'red',
		warn: 'orange',
		info: 'yellow',
		verbose: 'blue',
		debug: 'green',
		silly: 'pink'
	}
};
const config = winston.config;
const logger = new winston.Logger({
	levels: myCustomLevels.levels,
	transports: [
		new winston.transports.Console({
			timestamp: function() {
				return Date.now();
			},
			formatter: function(options) {
				// - Return string will be passed to logger.
				// - Optionally, use options.colorize(options.level, <string>) to
				//   colorize output based on the log level.
				return (
					new Date(options.timestamp()) +
					' ' +
					config.colorize(
						options.level,
						options.level.toUpperCase()
					) +
					' ' +
					(options.message ? options.message : '') +
					(options.meta && Object.keys(options.meta).length
						? '\n\t' + JSON.stringify(options.meta)
						: '')
				);
			},
			level: 'debug',
			// json: true,
			colorize: true,
			exitOnError: false
		})
	]
});

logger.stream = {
	write: function(message, encoding) {
		// use the 'info' log level so the output will be picked up by both transports (file and console)
		logger.info(message);
	}
};

module.exports = {
	error: function(obj) {
		logger.error(obj);
	},
	warn: function(obj) {
		logger.warn(obj);
	},
	info: function(obj) {
		logger.info(obj);
	},
	verbose: function(obj) {
		logger.verbose(obj);
	},
	debug: function(obj) {
		logger.debug(obj);
	},
	silly: function(obj) {
		logger.silly(obj);
	},
	logger
};
