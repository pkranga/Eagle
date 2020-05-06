/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/* eslint-disable */
const express = require('express');
const fse = require('fs-extra');

const config = require('../ConfigReader/loader');

const contentDirectory = config.getProperty('resource_directory');
const liveOrgDirectory = contentDirectory + '/' + config.getProperty('live_content_org_name');
const webHostDirectory = contentDirectory + '/' + config.getProperty('web_host_directory');
const ilpStaticDirectory = config.getProperty('ilp_static_directory');
const tempOpenRapDirectory = contentDirectory + '/' + config.getProperty('open_rap_dir');

const router = express.Router();

/**
 * Gets the artifact url for open rap
 */
const hierarchy = require('../Hierarchy/hierarchy');
const esUtil = require('../ElasticsearchUtil/es-util');
const log = require('../Logger/log');
const zipUtil = require('../ZipUtil/util');

router.get('/artifact/:contentId', (req, res) => {
	res.connection.setTimeout(100000);
	hierarchy.getAllIds(req.params.contentId, null, (allIds) => {
		log.info('Ids arr count' + allIds.length);
		let doneCount = 0;
		allIds.forEach((child, index) => {
			esUtil.getDataForIdentifiers([child], (err, result) => {
				if (err) {
					throw 'Could not get data for ' + child;
				} else {
					if (result.hits && result.hits.hits && result.hits.hits.length === 1) {
						// console.log(result.hits.hits[0]._source);
						let contentJson = result.hits.hits[0]._source;
						// const requiredJSON = (({
						// 	thumbnail,
						// 	description,
						// 	identifier,
						// 	name,
						// 	contentType
						// }) => ({
						// 	thumbnail,
						// 	description,
						// 	identifier,
						// 	name,
						// 	contentType
						// }))(contentJson);

						// Check content type
						// If content type is not a resource, only the download the thumbnail
						// Else, use the download url if exists for artifact and thumbnail from content directory.

						// 1. Create a directory with th name of this contentId

						// 2. Copy the thumbnail URL
						// 3. Copy the downloadURL from the login below

						//For artifact, check if the artifact url is from ilp-static/web-hosted
						// 		If ilp-static, move the ilp-static directory.
						//		If web-hosted, move the web-hosted directory.
						//		If content directory, use the download URL directly.

						hierarchy.getHierarchyData(contentJson.identifier, {}).then(hierarchyJson => {
							let openRapTempContentDirectory = tempOpenRapDirectory + '/' + req.params.contentId + '/' + contentJson.identifier;
							fse.ensureDir(openRapTempContentDirectory)
								.then(() => {
									log.info('Directory created successfully!');
									// Create the json file here
									try {
										fse.writeFileSync(`${openRapTempContentDirectory}/${contentJson.identifier}.json`, JSON.stringify(hierarchyJson));
									} catch (ex) {
										console.error('Error while creating the JSON fiel for ' + contentJson.identifier + '.json');
									}
									// Copying the thumbnail
									if (contentJson.thumbnail.includes('?type=')) {
										const arr = contentJson.thumbnail.split('?type=');
										const folderName = arr[1];
										const firstPartArr = arr[0].split('/');
										const contentDirectoryId = firstPartArr[5]; // Using this because the image is being reused in some places and the image content directory is not same as the content directory.
										const fileName = firstPartArr[firstPartArr.length - 1];

										const fileSourceLocation = liveOrgDirectory + '/' + contentDirectoryId + '/' + folderName + '/' + fileName;

										// Image will be downloaded here
										try {
											fse.copySync(fileSourceLocation, openRapTempContentDirectory + '/' + fileName);
										} catch (ex) {
											console.error(ex); // eslint-disable-line
										}
									}

									if (contentJson.downloadUrl.length > 0) {
										console.log('Download URL exists');
										if (contentJson.downloadUrl.includes('?type=')) {
											const arr = contentJson.downloadUrl.split('?type=');
											const folderName = arr[1];
											const firstPartArr = arr[0].split('/');
											const contentDirectoryId = firstPartArr[5]; // Using this because the image is being reused in some places and the image content directory is not same as the content directory.
											const fileName = firstPartArr[firstPartArr.length - 1];

											const fileSourceLocation = liveOrgDirectory + '/' + contentDirectoryId + '/' + folderName + '/' + fileName;
											const fileDestinationLocation = openRapTempContentDirectory + '/' + fileName;

											// Image will be downloaded here
											try {
												console.log('Source', fileSourceLocation);
												console.log('Destination:', fileDestinationLocation);
												fse.copySync(fileSourceLocation, fileDestinationLocation);
												console.log('Saved the artifact as well');

												// If the artifact is a zip file, the unzip the file and save it
												if (fileName.toString().endsWith('.zip')) {
													console.log('File is a zip');
													// Unzipping now
													try {
														zipUtil.unzipTheDirectory(fileDestinationLocation, openRapTempContentDirectory);
													} catch (ex) {
														console.error('Exception while unzipping', ex);
													}
													console.log('Unzipped successfully');
													doneCount++;

													try {
														fse.removeSync(fileDestinationLocation);
														console.log('Removed the zip after unzipping');
													} catch (ex) {
														console.error('Exception while removing the zipped folder', ex);
													}
													zipTheDirectory(req, res, doneCount++, allIds);
												} else {
													console.log('File is not a zip');
													zipTheDirectory(req, res, doneCount++, allIds);
												}
											} catch (ex) {
												console.error(ex); // eslint-disable-line
												zipTheDirectory(req, res, doneCount++, allIds);
											}
										}
									} else {
										console.log('Download URL does not exists');
										zipTheDirectory(req, res, doneCount++, allIds);
									}
								})
								.catch(err => {
									console.error('Could not create the temporary folder inside the contentid directory', err);
									zipTheDirectory(req, res, doneCount++, allIds);
								});
						}).catch(e => {

						});
					}
				}
			});
		});
	});
});

function zipTheDirectory(req, res, doneCount, allIds) {
	console.log('Done Count', doneCount);

	if (allIds.length === doneCount) {
		console.log('Can zip it now');

		// Get the json data for this resource as well
		// Zipping the directory here
		const sourceForZip = tempOpenRapDirectory + '/' + req.params.contentId;
		const destinationForZip = sourceForZip + '.zip';

		console.log('sourceDirectory path is: ', sourceForZip);
		zipUtil.zipTheDirectory(sourceForZip, destinationForZip, function (err, result) {
			if (err) {
				console.error('Error while zipping is: ', err);
			} else {
				console.log(result);
				res.sendFile(destinationForZip);
			}
		});
	} else {
		console.log('Will need more time....');
	}
}

module.exports = router;
