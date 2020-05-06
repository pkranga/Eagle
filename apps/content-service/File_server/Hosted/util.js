/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const zipUtil = require('../ZipUtil/util');
const log = require('../Logger/log');
const fse = require('fs-extra');

const config = require('../ConfigReader/loader');

/**
 * This method will zip the content of a source directory and place it in the destination directory. The file structure will remain same as the source directory.
 *
 * @param {String} sourcePath
 * @param {String} destinationPath
 * @param {function(err, result)} callback
 */
function archiveDirectory(sourcePath, destinationPath, callback) {
	log.info(`Zipping requested----  Source path ${sourcePath}  Destination path ${destinationPath}`);

	// Checking if the source and destination path exists

	const destinationPathUrl = destinationPath.split('/');
	let destPathCheckVar = '';
	for (let i=0; i<destinationPathUrl.length-1; i++) {
		destPathCheckVar += destinationPathUrl[i] + '/';
	}
	fse.pathExists(sourcePath)
		.then(sourceExists => {
			if (sourceExists) {
				fse.pathExists(destPathCheckVar)
					.then(destinationPathExists => {
						if (destinationPathExists) {
							// Perform the zip operation
							zipUtil.zipTheDirectory(sourcePath, destinationPath, (err, result) => {
								callback(err, result);
							});
						} else {
							// Throw error saying the destination path does not exist
							callback({
								code: 404,
								msg: 'Not found',
								type: 'destination'
							});
						}
					});
			} else {
				// Throw error saying that th source directory does not exist
				callback({
					code: 404,
					msg: 'Not found',
					type: 'source'
				});
			}
		});
}

/**
 * This method will remove any file in the web site hosted directory. If not found, will return the appropriate error message
 * @param {String} filePath
 * @param {function(err, result)} callback
 */
function removeFileFromHosted(filePath, callback) {
	checkIfPathExists(filePath, function (error, exists) {
		if (error) {
			callback(error, null);
		} else {
			fse.remove(filePath, (err) => {
				if (err) {
					callback(err, null);
				} else {
					if (exists) {
						callback(null, {
							code: 200,
							msg: `Deleted all files from ${filePath} successfully`
						});
					} else {
						callback({
							code: 404,
							msg: 'File does not exist.'
						});
					}
				}
			});
		}
	});
}

/**
 * This method will remove all the files from the assets folder of the hosted web directory
 * @param {String} sourcePath
 * @param {function (err, result)} callback
 */
function removeAllFilesFromAssets(sourcePath, callback) {
	checkIfPathExists(sourcePath, function (error, exists) {
		if (error) {
			callback(error, null);
		} else {
			fse.emptyDir(sourcePath, (err) => {
				if (err) {
					callback(err, null);
				} else {
					if (exists) {
						callback(null, {
							code: 200,
							msg: `Deleted all files from ${sourcePath} successfully`
						});
					} else {
						callback({
							code: 404,
							msg: 'Directory does not exist'
						});
					}
				}
			});
		}
	});
}

/**
 * This method will return if the path to the folder exists or not.
 * @param {String} sourcePath
 * @param {function (err, result)} callback
 */
function checkIfPathExists(sourcePath, callback) {
	fse.pathExists(sourcePath, (err, exists) => {
		if (callback) {
			callback(err, exists);
		}
	});
}

// Resource Directory
const resourceDirectory = config.getProperty('resource_directory');
// Content directory where the data for the hosted web sites is resting
const webHostOrganization = config.getProperty('web_host_directory') || 'web-host';
/**
 * This will create the content directory and all the sub directories needed for the web hosted content.
 * @param {String} contentId
 * @param {func (err, result)} callback
 */
function createHostedDirectory(contentId, callback) {
	const webHostedDirPath = `${resourceDirectory}/${webHostOrganization}/${contentId}`;

	checkIfPathExists(webHostedDirPath, (error, exists) => {
		if (error) {
			if (callback) {
				log.info('Error while trying to create the content directory');
				callback({
					'code': 500,
					'message': 'Error while trying to create the content directory',
					'error': 'Internal server error'
				}, null);
			}
			return;
		}
		if (exists) {
			if (callback) {
				callback({
					'code': 400,
					'message': 'Web hosted directory already exists. To re-use this, use the delete API to delete the web-hosted directory',
					'error': 'Bad request'
				}, null);
			}
			return;
		}
		fse.ensureDir(webHostedDirPath, err => {
			if (err) {
				if (callback) {
					log.info('Error while trying to create the content directory');
					callback({
						'code': 500,
						'message': 'Error while trying to create the content directory',
						'error': 'Internal server error'
					}, null);
				}
			} else {
				fse.ensureDir(webHostedDirPath + '/assets', err => {
					if (err) {
						if (callback) {
							log.info('Error while trying to create the content directory');
							callback({
								'code': 500,
								'message': 'Error while trying to create the content directory',
								'error': 'Internal server error'
							}, null);
						}
					} else {
						if (callback) {
							log.info('Content directory and sub directories successfully created');
							callback(null, {
								'code': 201,
								'message': 'Web hosted directory ' + contentId + ' successfully created'
							});
						}
					}
				});
			}
		});
	});
}

module.exports = {
	createHostedDirectory: createHostedDirectory,
	removeFileFromHosted: removeFileFromHosted,
	removeAllFilesFromAssets: removeAllFilesFromAssets,
	archiveDirectory: archiveDirectory,
	checkIfPathExists: checkIfPathExists
};
