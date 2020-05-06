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

// Config reader
const config = require('../ConfigReader/loader');

// Logger
const log = require('../Logger/log');

// Resource Directory
const resourceDirectory = config.getProperty('resource_directory');
// Content directory where the data for the hosted web sites is resting
const webHostOrganization = config.getProperty('web_host_directory') || 'web-host';
// Live content org name
const liveContentOrgName = config.getProperty('live_content_org_name') || 'ETA';

//Content util. This will help us in the crud operations of the content directory of this hosted space.
const contentUtil = require('../Content/util');

const hostedUtil = require('./util');

// Create and delete operations on the directory level
// Create. This will create the directory

/**
 * @apiDescription This API will create the content directory for the hosted web application
 *
 * @api {POST} /hosted/:contentId Request to create a web hosted content directory
 * @apiName CreateDirectory
 * @apiGroup WebHostedDirectory
 * @apiParam (URI Param) {String} contentId contentId for which this web hosted directory is being created
 *
 * @apiSuccess {String} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccess {String} webHostPath Path to the directory where the static web site for the directory is available.
 * @apiSuccessExample Success response:
 * 	HTTPS 201 Created
 * 	{
		"code": 201,
		"message": "Web hosted directory creation successful"
		"webHostPath": "/lex_12345/"
	}

 *  @apiError (Response Error) Conflict:409 A web hosted directory with the same contentId already exists
 *  @apiErrorExample Error-Response: 409
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": "Access token of the user does not exist"
 *     }
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
router.post('/hosted/:contentId', function (req, res) {
	hostedUtil.createHostedDirectory(req.params.contentId, function (err, result) {
		if (err) {
			// Sending the error message
			res.status(err.code).send(err);
		} else {
			// Sending the success
			delete result.message;

			result.message = 'Web hosted directory creation successful';
			result.webHostPath = `/${req.params.contentId}/`;
			res.status(result.code).send(result);
		}
	});
});

// This will force delete the directory.
/**
 * @apiDescription This API will force delete the entire content directory for the hosted web application
 *
 * @api {DELETE} /hosted/:contentId Request to delete the web hosted content directory
 * @apiName DeleteDirectory
 * @apiGroup WebHostedDirectory
 * @apiParam (URI Param) {String} contentId contentId for which this web hosted directory is being created
 *
 * @apiSuccess {String} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call

 * @apiSuccessExample Success response: 200
 * 	HTTPS 200 Success
 * 	{
 *	  "code": 200,
 *	  "message": "Content directory lex_12345 successfully deleted"
 *	  "webHostPath": "/lex_12345/"
 *	}
 *
 *  @apiError (Response Error) NotFound:404 A web hosted directory with this contentId does not exist.
 *  @apiErrorExample Error-Response: 404
 *  HTTP/1.1 404 NotFound
	{
	"code": 404,
	"message": "Directory with the content id lex_123456 does not exist",
	"error": "Not Found/"
	}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
router.delete('/hosted/:contentId', function (req, res) {
	contentUtil.delete(webHostOrganization, req.params.contentId, function (err, result) {
		if (err) {
			// Sending the error message
			res.status(err.code).send(err);
		} else {
			// Sending the success
			res.status(result.code).send(result);
		}
	});
});

// Creation of the assets and the artifacts. For the hosted, we will also allow files to be hosted at the content directory level
/**
 * @apiDescription This API will upload a file to the assets or the base directory of a web hosted application
 *
 * @api {POST} /hosted/:contentId/:directoryType Request to upload a file to a web hosted directory
 * @apiName UploadFile
 * @apiGroup WebHostedDirectory
 * @apiParam (URI Param) {String} contentId contentId for which this web hosted directory is being created
 * @apiParam (URI Param) {String} directoryType type of the directory (base|assets) where the file needs to be saved
 * @apiParam (Form Param) {File} content File that needs to be uploaded
 * @apiSuccess {String} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccess {String} contentUrl Web hosted url of the uploaded content

 * @apiSuccessExample Success response: 201 (with directoryType: base)
 * 	HTTPS 201 Created
 * 	{
	  "code": 201,
	  "message": "Content successfully uploaded",
	  "contentURL": "/index.html"
	}
 * @apiSuccessExample Success response: 201 (with directoryType: assets)
 * 	HTTPS 201 Created
 * 	{
	  "code": 201,
	  "message": "Content successfully uploaded",
	  "contentURL": "./assets/main.js"
	}

 *  @apiError (Response Error) NotFound:400 A web hosted directory with this contentId does not exist.
 *  @apiErrorExample Error-Response: 400
 *  HTTP/1.1 400 BadRequest
	{
	"code": 400,
	"message": "Web hosted directory does not exist for lex_1234. Use the create API to create the web hosted directory, then save the data into the assets directory",
	"error": "Bad request"
	}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
const busboy = require('connect-busboy');
const fs = require('fs');

router.use(busboy());
router.post('/hosted/:contentId/:directoryType(base|assets){1}', function (req, res) {
	/*if (!req.files) {
		res.status(400).send({
			'code': 400,
			'message': 'No files were uploaded',
			'error': 'bad request'
		});
	} else {
		const contentFile = req.files.content;
		if (!contentFile) {
			res.status(400).send({
				'code': 400,
				'message': 'Content file not found',
				'error': 'bad request'
			});
		} else {
			let directoryTypeName = req.params.directoryType;
			let contentUrl = `./${directoryTypeName}/${contentFile.name}`;
			// If the file is being hosted at base, then saving the file on the content directory level and not in any assets or ecar_files.
			if (directoryTypeName === 'base') {
				directoryTypeName = '';
				contentUrl = `/${contentFile.name}`;
			}

			const pathToExist = `${resourceDirectory}/${webHostOrganization}/${req.params.contentId}`;

			hostedUtil.checkIfPathExists(pathToExist, function (err, exists) {
				if (err || !exists) {
					if (err) {
						log.info('Error while trying to create the content directory');
						res.status(500).send({
							'code': 500,
							'message': 'Error while trying to create the web host directory',
							'error': 'Internal server error'
						});
						console.log(err); //eslint-disable-line
						return;
					}
					if (!exists) {
						res.status(400).send({
							'code': 400,
							'message': `Web hosted directory does not exist for ${req.params.contentId}. Use the create API to create the web hosted directory, then save the data into the assets directory`,
							'error': 'Bad request'
						});
						console.log(err); //eslint-disable-line
						return;
					}
				} else {
					contentUtil.upload(webHostOrganization, req.params.contentId, directoryTypeName, contentFile, function (err, result) {
						if (err) {
							// Sending the error message
							res.status(err.code).send(err);
						} else {
							// Sending the success
							delete result.contentURL;
							result.contentURL = contentUrl;
							res.status(result.code).send(result);
						}
					});
				}
			});
		}
	}*/

	try {
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			//Path where image will be uploaded
			let directoryTypeName = req.params.directoryType;
			let contentUrl = `./${directoryTypeName}/${filename}`;
			// If the file is being hosted at base, then saving the file on the content directory level and not in any assets or ecar_files.
			if (directoryTypeName === 'base') {
				directoryTypeName = '';
				contentUrl = `/${filename}`;
			}

			const pathToExist = `${resourceDirectory}/${webHostOrganization}/${req.params.contentId}`;

			// Check if the file is writable.
			fs.access(pathToExist, fs.constants.F_OK | fs.constants.W_OK, (err) => {
				log.info(`${file} ${err ? 'is not writable' : 'is writable'}`);
				if (err) {
					log.error(
						`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
					if (err.code === 'ENOENT') {
						log.error('Directory does not exist for', pathToExist);
						// Send that the content directory does not exist
						res.status(400).send({
							'code': 400,
							'message': 'Content directory does not exists. First create the content directory to store/upload/update the files in them',
							'error': 'bad request'
						});
					} else {
						log.error('File exists, but not writeable. Send an internal server error');
						res.status(500).send({
							'code': 500,
							'message': 'Content directory exists, but trouble accessing it',
							'error': 'Internal Server Error'
						});
					}
				} else {
					// Path exists, now we can save the file
					let fileStream = fs.createWriteStream(pathToExist + '/' + directoryTypeName + '/' +filename);
					log.info(pathToExist + '/' + directoryTypeName + '/' +filename);
					file.pipe(fileStream);
					fileStream.on('close', function () {
						log.info('Upload Finished of ' + filename);
						// res.send('Done'); //where to go next
						res.send({
							'code': 201,
							'message': 'Content successfully uploaded',
							'contentURL': contentUrl
						});
					});
				}
			});
		});
	} catch (ex) {
		console.error(ex); // eslint-disable-line
		res.status(500).send({
			'error': 'Error',
			'msg': 'File uploaded is mandatory for this request'
		});
		return;
	}
});


// Removing the directories inside the hosted path.
/**
 * @apiDescription This API will upload a file to the assets or the base directory of a web hosted application
 *
 * @api {DELETE} /hosted/:contentId/:directoryType/:fileName Request to delete a file from a web hosted directory
 * @apiName DeleteFile
 * @apiGroup WebHostedDirectory
 * @apiParam (URI Param) {String} contentId contentId of the file that needs to be deleted.
 * @apiParam (URI Param) {String} directoryType type of the directory (base|assets) where the file exists
 * @apiParam (URI Param) {String} fileName Name of the file that needs to be deleted.
 * @apiSuccess {String} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccess {String} contentUrl Web hosted url of the uploaded content

 * @apiSuccessExample Success response: 200
 * 	HTTPS 200 OK
 * 	{
 *	  "code": 200,
 *	  "msg": "Successfully deleted index.html"
 *	}

 *  @apiError (Response Error) NotFound:404 File or the web hosted directory does not exist.
 *  @apiErrorExample Error-Response: 404
 *HTTP/1.1 404 Not Found
 * {
 *   "code": 404,
 *   "msg": "File does not exist."
 * }
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
router.delete('/hosted/:contentId/:directoryType(base|assets){1}/:fileName', function (req, res) {
	let deleteFilePath = `${resourceDirectory}/${webHostOrganization}/${req.params.contentId}`;

	if (req.params.directoryType != 'base') {
		deleteFilePath += `/${req.params.directoryType}`;
	}
	deleteFilePath += `/${req.params.fileName}`;

	hostedUtil.removeFileFromHosted(deleteFilePath, function (err, result) {
		if (err) {
			if (err.code) {
				res.status(err.code).send(err);
			} else {
				res.status(500).send({
					'err': 'Internal server error',
					'code': 500
				});
				log.error(err);
			}
		} else {
			delete result.msg;
			result.msg = `Successfully deleted ${req.params.fileName}`;
			res.status(200).send(result);
		}
	});
});

// Deleting the entire directories inside the hosted directory
/**
 * @apiDescription This API will force delete the entire content of the assets directory of a hosted application
 *
 * @api {DELETE} /hosted/:contentId/assets Request to delete the assets directory of a  web hosted content directory
 * @apiName DeleteAssetsDirectory
 * @apiGroup WebHostedDirectory
 * @apiParam (URI Param) {String} contentId contentId for which the assets directory needs to be deleted
 *
 * @apiSuccess {String} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call

 * @apiSuccessExample Success response: 200
 * 	HTTPS 200 Success
 * 	{
 *	  "code": 200,
 *	  "message": "Successfully deleted all files from assets of lex_1234"
 *	}
 *
 *  @apiError (Response Error) NotFound:404 A web hosted directory with this contentId does not exist.
 *  @apiErrorExample Error-Response: 404
 * HTTP/1.1 404 NotFound
 * {
 *   "code": 404,
 *   "message": "Directory does not exist"
 * }
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
router.delete('/hosted/:contentId/assets', function (req, res) {
	let assetsDirectoryPath = `${resourceDirectory}/${webHostOrganization}/${req.params.contentId}/assets`;
	hostedUtil.removeAllFilesFromAssets(assetsDirectoryPath, function (err, result) {
		if (err) {
			if (err.code) {
				res.status(err.code).send(err);
			} else {
				res.status(500).send({
					'err': 'Internal server error',
					'code': 500
				});
				log.error(err);
			}
		} else {
			delete result.msg;
			result.msg = `Successfully deleted all files from assets of ${req.params.contentId}`;
			res.status(200).send(result);
		}
	});
});

// Zipping functionality. This will zip the file from the hosted directory and save the file in content directory/ecar_files. This is used in the process where a hosted web site will be serving the offline files to an Android or a iOS mobile app.

/**
 * @apiDescription This will zip the file from the hosted directory and save the file in content directory/ecar_files. This is used in the process where a hosted web site will be serving the offline files to an Android or a iOS mobile app.
 *
 * @api {POST} /hosted/zip/:contentId Request to zip a web hosted directory and place it in the respective Live content directory.
 * @apiName ZipWebHost
 * @apiGroup WebHostedDirectory
 * @apiParam (URI Param) {String} contentId contentId for which this web hosted directory is being created
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} msg A verbose status message about the status of the API call
 * @apiSuccess {Number} size Size of the zip file in bytes

 * @apiSuccessExample Success response: 200 (with directoryType: base)
 * 	HTTPS 200 OK
 * 	{
	  "code": 200,
	  "msg": "Successfully zipped the file",
	  "size": 112
	}
 *
 *  @apiError (Response Error) NotFound:400 A web hosted directory with this contentId does not exist.
 *  @apiErrorExample Error-Response: 400
 *  HTTP/1.1 400 BadRequest
 *{
 *  "code": 400,
 *  "message": "web-host lex_12345 does not exist. Bad movement. Make sure the content directory is created and the directory to store the zip file exists",
 *}
 *  @apiError (Response Error) NotFound:400 A content directory with this contentId does not exist.
 *  @apiErrorExample Error-Response: 400
 *  HTTP/1.1 400 BadRequest
 *{
 *  "code": 400,
 *  "message": "content-directory lex_1234 does not exist. Bad movement. Make sure the content directory is created and the directory to store the zip file exists"
 *}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 Not Found
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
router.post('/hosted/zip/:sourceDirectory/:destinationDirectory/:fileName', function (req, res) {
	// const sourcePath = `${resourceDirectory}/${webHostOrganization}/${req.params.contentId}`;
	// const destinationPath = `${resourceDirectory}/${liveContentOrgName}/${req.params.contentId}/ecar_files/${req.params.contentId}.zip`;

	const sourcePath = `${resourceDirectory}/${webHostOrganization}/${req.params.sourceDirectory}`;
	const destinationPath = `${resourceDirectory}/${liveContentOrgName}/${req.params.destinationDirectory}/ecar_files/` + (req.params.fileName.endsWith('.zip') ? req.params.fileName : req.params.fileName + '.zip');

	// Requesting the archive and storing the data in the respective ETA directory
	hostedUtil.archiveDirectory(sourcePath, destinationPath, function (err, result) {
		if (err) {
			if (err.code === 404) {
				res.status(400).send({
					'err': 'Bad request',
					'msg': `${err.type=='source'? req.params.sourceDirectory: req.params.destinationDirectory} does not exist. Bad movement. Make sure the content directory is created and the directory to store the zip file exists`
				});
			} else {
				res.status(500).send({
					'err': 'Internal server error',
					'msg': 'Error while saving the zip file to the content directory'
				});
			}
		} else {
			res.status(200).send({
				'code': 200,
				'msg': 'Successfully zipped the file',
				'size': result.size
			});
		}
	});
});

module.exports = router;
