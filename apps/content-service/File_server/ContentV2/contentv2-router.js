/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Make all the routes which you have sent me emails here

const express = require('express');
const router = express.Router();
const utility = require('../S3/util');
const { errors } = require('../S3/status-codes');
// Logger
const log = require('../Logger/log');

// Busboy for file upload
const busboy = require('connect-busboy');
router.use(busboy());

// Name of the root folder
const root = 'content-store';

router.post('/publish/:organization/:contentId', (req, res) => {
	utility.publish(`${root}/${req.params.organization}/${req.params.contentId}`).then(result => {
		log.info(result.message);
		res.status(result.code).send(result);
	}).catch(error => {
		if (error.message && error.code !== 500)
			log.error(error.message);
		res.status(error.code).send(error);
	});
});


// router.get('/')
router.post('/zip/:organization/:contentId', (req, res) => {
	let { contentId, organization } = req.params;

	let key = `${root}/${organization}/web-host/${contentId}`;

	utility.archiveDirectory(key).then(result => {
		log.info(result.message);
		res.send(result);
	}).catch(error => {
		if (error.message && error.code !== 500)
			log.error(error.message);
		res.status(error.code).send(error);
	});
});

function pathValidation(req, res, next) {
	let { organization, contentId } = req.params;

	if (organization && contentId) {
		// Pattern to test filename
		let pattern = /[/.A-Za-z%0-9_-]+/g;

		if (!pattern.test(organization) && !pattern.test(contentId)) {
			res.send(errors.BadRequest('Invalid character found in the URL'));
		}
		else {
			next();
		}
	} else {
		res.send(errors.BadRequest('Organization or contentId is not present in the params'));
	}
}

/**
 * @apiDescription API to create a directory for the content. This will create the directory structure for the content to be stored. The directory structure is flexible and will be as follows
 * 	organization
 * 	--contentID
 * 		--assets
 * 		--artifacts
 * 		--ecar_files
 *  global_contentID
 *  On successful creation, a valid 201 response will be sent back as a response and if the directory already exists,an error code and if there is a problem creating the directory, the server error will be returned.
 *
 * @api {POST} /content/root/* Request to create a content directory
 * @apiName CreateDirectory
 * @apiGroup S3ContentDirectory
 * @apiParam (URI Param) {String} path directory path on S3
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 201
 * 	HTTPS 201 Created
 * {
 *   "code": 201,
 * }
 *  @apiError (Response Error) Conflict:409 Content directory already exists
 *  @apiErrorExample Error-Response: 409
 *  HTTP/1.1 409 Conflict
 * {
 *    "code": 409,
 *    "error": "Conflict",
 * }
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *  HTTP/1.1 500 InternalServerError
 * {
 *    "code": 500,
 *    "error": "Internal Server Error"
 * }
 *
 */
router.post('/:organization/:contentId', pathValidation, (req, res) => {
	// Remove the root

	let { organization, contentId } = req.params;
	let key = `${root}/${organization}/${contentId}`;

	utility.createPath(key).then(result => {
		log.info(result.message);
		res.status(result.code).send(result);
	}).catch(error => {
		if (error.message && error.code !== 500)
			log.error(error.message);
		res.status(error.code).send(error);
	});
});

/**
 * @apiDescription API to delete an existing content directory. This will delete a directory and return a valid 200 status code on deletion of the directory. On any error or if the directory does not exists, the error response for the same is returned
 *
 * @api {DELETE} /content/root/* Request to delete a content directory
 * @apiName DeleteDirectory
 * @apiGroup S3ContentDirectory
 * @apiParam (URI Param) {String} path directory path on S3
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 202
 * 	HTTPS 202 Accepted
 * {
 *    "code": 202,
 * }

 *  @apiError (Response Error) NotFound:404 Content directory not found
 *  @apiErrorExample Error-Response: 404
 *  HTTP/1.1 404 NotFound
 * {
 *     "code": 404,
 *     "error": "Not Found",
 * }
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *  HTTP/1.1 500 InternalServerError
 * {
 *    "code": 500,
 *    "error": "Internal Server Error"
 * }
 */
router.delete('/:organization/:contentId', pathValidation, (req, res) => {
	let { organization, contentId } = req.params;
	let key = `${root}/${organization}/${contentId}`;

	utility.deletePath(key).then(result => {
		log.info(result.message);
		res.status(result.code).send(result);
	}).catch(error => {
		if (error.message && error.code !== 500)
			log.error(error.message);
		res.status(error.code).send(error);
	});
});

/**
 * @apiDescription API to upload a file to the content directory
 *  On successful creation, a valid 201 response will be sent back as a response and if the directory already exists,an error code and if there is a problem creating the directory, the server error will be returned.
 *
 * @api {POST} /upload/root/* Request to upload a file
 * @apiName UploadFle
 * @apiGroup S3ContentDirectory
 * @apiParam (URI Param) {String} path directory path on S3
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccess {String} contentURL The url where this content will be available after the successful upload
 * @apiSuccessExample Success response: 201
 *  HTTPS 201 Created
 * {
 *     "code": 201,
 * }
 *
 *  @apiError (Response Error) Not Found:404 A content directory with this contentId and  organization does not exist
 *  @apiErrorExample Error-Response: 404
 *  HTTP/1.1 404 Not Found
 * {
 *     "code": 404,
 *     "error": "Not Found",
 * }
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *  HTTP/1.1 500 InternalServerError
 * {
 *    "code": 500,
 *    "error": "Internal Server Error"
 * }
 */
router.post('/:organization/:contentId/:directoryType', pathValidation, (req, res) => {
	let { organization, contentId, directoryType } = req.params;
	let key = root + '/' + organization + '/' + contentId + '/' + directoryType + '/';

	// Since the key must always end with /, ensure that it does
	key[key.length - 1] !== '/' ? (key += '/') : key;

	let type = req.query.type;

	// If there is a type, append it to key
	type ? (key += type + '/') : key;

	try {
		req.pipe(req.busboy);
		req.busboy.on('file', function (_, file, fileName) {
			utility.uploadContent(key, fileName, file).then(result => {
				log.info(result.message);
				res.status(result.code).send(result);
			}).catch(error => {
				if (error.message && error.code !== 500)
					log.error(error.message);
				res.status(error.code).send(error);
			});
		});
	} catch (err) {
		res.status(500).send({
			error: 'Error',
			msg: 'File uploaded is mandatory for this request'
		});
	}
});

/**
 * @apiDescription API to fetch the content from s3.
 *
 * @api {GET} /download/root/* Request to fetch a file from s3
 * @apiName FetchFile
 * @apiGroup S3ContentDirectory
 * @apiParam (URI Param) {String} path directory path on S3
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * 	HTTPS 200 OK (File BLOB)

 *  @apiError (Response Error) NotFound:404 Content directory not found
 *  @apiErrorExample Error-Response: 404
 *  HTTP/1.1 404 NotFound
 *  {
 *    "message": "Requested resource is not found",
 *    "error": "not found"
 *  }
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *  HTTP/1.1 500 InternalServerError
 *  {
 *     "code": 500,
 *     "error": "Internal Server Error"
 *  }
 */
router.get('/:organization/:contentId/:fileName', pathValidation, (req, res) => {
	let { organization, contentId, fileName } = req.params;
	let type = req.query.type || 'assets';
	type = ['assets', 'artifacts', 'ecar_files'].includes(type) ? type : 'assets';
	let key = root + '/' + organization + '/' + contentId + '/' + type + '/' + fileName;
	utility.downloadContent(key, req, res);
});

router.get('/:organization/:contentId/:type/:fileName', pathValidation, (req, res) => {
	let { organization, contentId, fileName, type } = req.params;
	type = ['assets', 'artifacts', 'ecar_files'].includes(type) ? type : 'assets';
	let key = root + '/' + organization + '/' + contentId + '/' + type + '/' + fileName;
	utility.downloadContent(key, req, res);
});

/**
 * @apiDescription API to copy the data of a content directory
 *
 * @api {POST} /copy/root/* /to/* Request to copy the content.
 * @apiName CopyDirectory
 * @apiGroup S3ContentDirectory
 * @apiParam (URI Param) {String} path directory path on S3
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {JSON} response Data for the success and failure movements.
 * @apiSuccessExample Success response: 200
 * HTTP/1.1 200 Success
 * {
 *     "code": 200,
 *     "message": "All files were copied successfully from root/destorg to root/infy/"
 * }
 * @apiSuccessExample Success response : 207
 * HTTP/1.1 207 Multi-Status
 * {
 *    "code": 207,
 *    "message": "Not all files were copied successfully. Copy failed.",
 *    "Success": [
 *        "root/destorg/assets/ -to- root/infy/assets/",
 *        "root/destorg/111.JPG -to- root/infy/111.JPG",
 *        "root/destorg/aaa.jpg -to- root/infy/aaa.jpg",
 *        "root/destorg/assets/chmodThings.PNG -to- root/infy/assets/chmodThings.PNG"
 *    ],
 *    "SuccessCount": 4,
 *    "Failed": [
 *        "src to dest"
 *    ],
 *    "FailedCount": 1
 *}
 *
 *  @apiErrorExample Error-Response: 404
 * HTTP/1.1 404 Not Found
 * {
 *     "code": 404,
 *     "error": "Not Found",
 * }
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 * HTTP/1.1 500 InternalServerError
 * {
 *   "code": "500",
 *   "error": "Internal Server Error"
 * }
 */

function srcPathValidation(req, res, next) {
	let { sourceOrg, destinationOrg, sourceContentId, destinationContentId } = req.params;
	// Pattern to check filename
	let pattern = /^[a-zA-Z0-9-_%:/.]*$/;

	if (pattern.test(sourceOrg) && pattern.test(destinationOrg) && pattern.test(sourceContentId) && pattern.test(destinationContentId)) {
		next();
	} else {
		res.send(errors.BadRequest('source or destination is invalid in the params'));
	}
}

router.post('/copy/:sourceOrg/to/:destinationOrg/:sourceContentId/:destinationContentId', srcPathValidation, (req, res) => {
	let { sourceOrg, destinationOrg, sourceContentId, destinationContentId } = req.params;

	let source = root + '/' + sourceOrg + '/' + sourceContentId;
	let destination = root + '/' + destinationOrg + '/' + destinationContentId;
	let type = req.query.type || 'authoring';
	let incf = true;

	if (req.query.incf === 'false') {
		incf = false;
	}

	if (['authoring', 'main'].includes(type.toLowerCase()))
		utility.copyContent(source, destination, type, incf).then(result => {
			log.info(result.message);
			res.status(result.code).send(result);
		}).catch(error => {
			if (error.message && error.code !== 500)
				log.error(error.message);
			res.status(error.code).send(error);
		});
	else {
		let response = errors.BadRequest('Type does not exist');
		res.status(response.code).send(response);
	}
});

router.get('/support_api/video_length/:organization/:contentId/assets/:fileName', pathValidation, (req, res) => {
	let { organization, contentId, fileName } = req.params;

	let location = `${root}/${organization}/${contentId}/assets/${fileName}`;
	utility.getVideoLength(location).then(result => {
		log.info(result.message);
		res.status(result.code).send(result);
	}).catch(error => {
		if (error.message && error.code !== 500)
			log.error(error.message);
		res.status(error.code).send(error);
	});
});

router.post('/hosted/:organization/:contentId', (req, res) => {
	utility.createPath(`${root}/${req.params.organization}/${req.params.contentId}`).then(result => {
		log.info(result.message);
		res.status(result.code).send(result);
	}).catch(error => {
		if (error.message && error.code !== 500)
			log.error(error.message);
		res.status(error.code).send(error);
	});
});

module.exports = router;
