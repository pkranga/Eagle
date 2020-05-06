/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Path for reading the directory
const path = require('path');
const fs = require('fs');
const express = require('express');
const UAParser = require('ua-parser-js');
const busboy = require('connect-busboy');
const request = require('request');

// Config reader to read from either props or environment
const config = require('../ConfigReader/loader');

// AV util for scanning for the virus files
const avUtil = require('../AvUtil/util');

// Content Util
const contentUtil = require('./util');

// Hierarchy util
const hierachyUtil = require('../Hierarchy/hierarchy');

// Caching the file server
// const apiCache = require('apicache'); // Removed this for disabling the cache for streaming
// const cache = apiCache.middleware; // Removed this for disabling the cache for streaming
const log = require('../Logger/log');

// Exporting the router out
const router = express.Router();
// Adding the support API for the content service
router.use('/support-api', require('./support-api-router'));
// Middlewares
router.use(busboy());

// Resources folder location
const resourceDirectory = config.getProperty('resource_directory');
const FILE_PATH_SEPARATOR = path.sep;
const deafultOrg = 'DEFAULTS';
const deafultImgesDir = 'IMAGES';
const defaultImageFileName = 'default.png';
const deafultImageExtension = contentUtil.getExtensionFromFileName(
  defaultImageFileName
);
const defaultImagePath = `${resourceDirectory}${FILE_PATH_SEPARATOR}${deafultOrg}${FILE_PATH_SEPARATOR}${deafultImgesDir}${FILE_PATH_SEPARATOR}${defaultImageFileName}`;

/**
 * Content store related API.
 * This API will read the request and decide on what is the resource that should be sent as a response to the caller. This will expose the content store as a service and will.
 *
 * The organization, contentId and the fileName are the mandatory fields for the request to work.
 *
 * Type name is an optional query parameter. This will inform about the folder inside the contentId to pick up the requested data from.
 *
 * Since this is a path parameter, only a single level deep directory name can be mentioned here.
 *
 * When the resource is at the contentId level later, the type parameter can be made a empty and it will pick up the data that is required from the content id root level folder itself.
 */
// Streaming the content if requested, else sending the data as a file.

/**
 * API to create a directory for the content. This will create the directory structure for the content to be stored. The directory structure will be as follows
 * 	organization
 * 	--contentID
 * 		--assets
 * 		--artifacts
 * 		--ecar_files
 *  On successful creation, a valid 201 response will be sent back as a response and if the directory already exists,an error code and if there is a problem creating the directory, the server error will be returned.
 */

/**
 * @apiDescription API to create a directory for the content. This will create the directory structure for the content to be stored. The directory structure will be as follows
 * 	organization
 * 	--contentID
 * 		--assets
 * 		--artifacts
 * 		--ecar_files
 *  On successful creation, a valid 201 response will be sent back as a response and if the directory already exists,an error code and if there is a problem creating the directory, the server error will be returned.
 *
 * @api {POST} /content/:organization/:contentId Request to create a content directory
 * @apiName CreateDirectory
 * @apiGroup ContentDirectory
 * @apiParam (URI Param) {String} organization Organization name for which this content directory is being created
 * @apiParam (URI Param) {String} contentId ContentId for which this content directory is being created
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 201
 * 	HTTPS 201 Created
 * 	{
	  "code": 201,
	  "message": "Content directory lex_1234 successfully created"
	}

 *  @apiError (Response Error) Conflict:409 A content directory with the same contentId in the same organization already exists
 *  @apiErrorExample Error-Response: 409
 *HTTP/1.1 409 Conflict
 *{
 *  "code": 409,
 *  "message": "Directory with the content id lex_1234 already exists. Delete it if you want to recreate the content directory with new content",
 *  "error": "conflict"
 *}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
router.post('/:organization/:contentId', function(req, res) {
  contentUtil.create(req.params.organization, req.params.contentId, function(
    err,
    result
  ) {
    if (err) {
      // Sending the error message
      res.status(err.code).send(err);
    } else {
      // Sending the success
      res.status(result.code).send(result);
    }
  });
});

/**
 * API to delete an existing content directory. This will create a directory and return a valid 200 status code on deletion of the directory. On any error or if the directory does not exists, the error response for the same is returned.
 */
/**
 * @apiDescription API to delete an existing content directory. This will create a directory and return a valid 200 status code on deletion of the directory. On any error or if the directory does not exists, the error response for the same is returned
 *
 * @api {DELETE} /content/:organization/:contentId Request to delete a content directory
 * @apiName DeleteDirectory
 * @apiGroup ContentDirectory
 * @apiParam (URI Param) {String} organization Organization name for which this content directory is being deleted
 * @apiParam (URI Param) {String} contentId ContentId for which this content directory is being deleted
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * 	HTTPS 200 OK
 * 	{
	  "code": 200,
	  "message": "Content directory lex_1234 successfully deleted"
	}

 *  @apiError (Response Error) NotFound:404 Content directory not found
 *  @apiErrorExample Error-Response: 404
 *HTTP/1.1 404 NotFound
 *{
 *  "code": 404,
 *  "message": "Directory with the content id lex_12345 does not exist",
 *  "error": "not found"
 *}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
router.delete('/:organization/:contentId', function(req, res) {
  contentUtil.delete(req.params.organization, req.params.contentId, function(
    err,
    result
  ) {
    if (err) {
      // Sending the error message
      res.status(err.code).send(err);
    } else {
      // Sending the success
      res.status(result.code).send(result);
    }
  });
});

/**
 * API to fetch the content from the content store.
 */
/**
 * @apiDescription API to fetch the content from the content store.
 *
 * @api {GET} /content/:organization/:contentId/:fileName Request to fetch a file from the content directory
 * @apiName FetchFile
 * @apiGroup ContentDirectory
 * @apiParam (URI Param) {String} organization Organization name for which this content directory is being deleted
 * @apiParam (URI Param) {String} contentId ContentId for which this content directory is being deleted.
 * @apiParam (URI Param) {String} fileName Name of the file that needs to be fetched.
 * @apiParam (Query Param) {String} type Directory type from where the file needs to be fetched. ( assets | artifacts | ecar_files ).
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * 	HTTPS 200 OK (File BLOB)

 *  @apiError (Response Error) NotFound:404 Content directory not found
 *  @apiErrorExample Error-Response: 404
 *HTTP/1.1 404 NotFound
 *{
 *  "message": "Requested resource is not found",
 *  "error": "not found"
 *}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "error": "Internal Server Error"
 *     }
 */
router.get(
  '/:organization/:contentId/:fileName',
  /*cache('1 hour'),*/ handleContentRequest
);
router.get(
  '/:organization/:contentId/assets/:fileName',
  /*cache('1 hour'),*/ handleContentRequest
);

router.get('/stream/:organization/:contentId/assets/:fileName', (req, res) => {
  // streamFile(req, res, true);
  serveFiles(req, res, true);
});

const noStreamExtensions = ['pdf', 'json'];

function handleContentRequest(req, res) {
  const shouldStream = config.getProperty('streaming') == 1 ? true : false;

  // Reading if the query params mentioned no stream (ns). For IE and ns from query parameter, we serve the file, else we continue with other validations
  const noStream = req.query.ns || 'false';

  const parser = new UAParser();
  const ua = req.headers['user-agent'];
  const browserName = parser.setUA(ua).getBrowser().name || '';
  // const fullBrowserVersion = parser.setUA(ua).getBrowser().version;
  // let browserVersion = 0;
  // if (fullBrowserVersion) {
  // 	browserVersion = fullBrowserVersion.split('.', 1).toString();
  // }
  // const browserVersionNumber = Number(browserVersion); //eslint-disable-line

  const fileNamesArr = req.params.fileName.split('.');
  const extension = fileNamesArr[fileNamesArr.length - 1];

  // If the request id for an audio or video format. We stream it, else we will go with other options.
  if (
    browserName.toLowerCase() !== 'ie' &&
    contentUtil.validAudioVideoFormats.includes(
      extension.toString().toLowerCase()
    ) &&
    noStream !== 'true'
  ) {
    log.info(req.params.fileName + ' - Content will be streamed');
    // streamFile(req, res);
    serveFiles(req, res, true);
    return;
  }

  if (
    browserName == 'IE' /*&& browserVersion <= 11*/ ||
    noStream == 'true' ||
    noStreamExtensions.includes(extension.toString().toLowerCase()) ||
    (req.query.type && req.query.type.toLowerCase() == 'artifacts')
  ) {
    serveFiles(req, res);
    return;
  }

  // If the requested file is an image, then we will send the file directly instead of streaming. In Mac systems and IE, images as stream will not paint the image and hence show an error. For this, we will not stream the images
  if (extension) {
    // Sending the response as a file and not a stream for images
    if (
      !shouldStream ||
      contentUtil.validImageExtensions.includes(
        extension.toString().toLowerCase()
      )
    ) {
      log.info(req.params.fileName + ' - Content will be served directly');
      serveFiles(req, res);
    } else {
      // If valid audio media, then we will stream, else, say it is not playable
      res.status(400).send({
        code: 400,
        msg:
          'Cannot stream content of this type. Please contact the content store admin.'
      });
    }
  } else {
    // Requested file does not have an extension, hence sending a bad request exception
    res.status(400).send({
      code: 400,
      msg: 'Bad file name or extension'
    });
  }
}

const TYPE_NAME = {
  ASSETS: 'assets',
  ARTIFACTS: 'artifacts',
  ECAR_FILES: 'ecar_files'
};

function serveFiles(req, res, shouldStream) {
  try {
    // Reading the requested params
    let orgName = req.params.organization;
    let contentId = req.params.contentId;
    let fileName = req.params.fileName;
    let type = req.query.type;
    const defaultType = TYPE_NAME.ASSETS;

    // Getting the details from type
    let typeName = '';

    // Reading the type of the resource requested.
    switch (type) {
      case TYPE_NAME.ASSETS:
        typeName = TYPE_NAME.ASSETS;
        break;
      case TYPE_NAME.ARTIFACTS:
        typeName = TYPE_NAME.ARTIFACTS;
        break;
      case TYPE_NAME.ECAR_FILES:
        typeName = TYPE_NAME.ECAR_FILES;
        break;
      default:
        if (type && type !== '') {
          typeName = type;
        }
        break;
    }

    // Checking if the type is empty. If the type is empty then that says that the resource is at the root level of the content folder. If the type is not empty, then we will have to go a level deep and get the data from the requested locations.
    let typePath =
      type === undefined || type === null || type === ''
        ? FILE_PATH_SEPARATOR + defaultType
        : FILE_PATH_SEPARATOR + typeName;

    // log.info('Type path: ' + typePath);

    // Defining the folder path from where the resource must be picked up.
    let filePath =
      resourceDirectory +
      FILE_PATH_SEPARATOR +
      orgName +
      FILE_PATH_SEPARATOR +
      contentId +
      typePath +
      FILE_PATH_SEPARATOR +
      req.params.fileName;

    // Checking if the file is not found, or at switched location. If at the switched location, then changing the file path and continuing.
    let isTypeSwitched = false;
    try {
      // log.info('file path: ' + filePath);
      fs.statSync(path.resolve(filePath));
    } catch (e) {
      // File is not found. Will throw an error if the request does not have any explicitly mentioned query
      if (e.code == 'ENOENT') {
        let defaultPresent = req.query.default;
        if (defaultPresent && defaultPresent == 'false') {
          res.status(404).send({
            error: 'not found',
            message: 'Requested resource is not found'
          });
          return;
        } else {
          // If file is not present in the artifacts|assets folder, we will check the other folder and send the file from the other folder.
          // When the file is found in the other directory, we will send a mail to the support team that the location of the file is different.
          // If the file is not found and the file is not a image, we will send a mail to the support team that this file is not present.

          // If the directory is not ecar_files, then following the work around approach and not a image file
          const fileExtension = fileName.split('.')[
            fileName.split('.').length - 1
          ];
          if (
            typeName !== TYPE_NAME.ECAR_FILES &&
            !contentUtil.validImageExtensions.includes(fileExtension)
          ) {
            // Switching the type here
            let tempType = TYPE_NAME.ARTIFACTS;
            if (type && type.toLowerCase() === TYPE_NAME.ARTIFACTS) {
              tempType = TYPE_NAME.ASSETS;
            }
            let tempFilePath =
              resourceDirectory +
              FILE_PATH_SEPARATOR +
              orgName +
              FILE_PATH_SEPARATOR +
              contentId +
              FILE_PATH_SEPARATOR +
              tempType +
              FILE_PATH_SEPARATOR +
              req.params.fileName;

            // Checking if the file is present here
            try {
              log.info(`Temp file path: ${tempFilePath}`);
              fs.statSync(path.resolve(tempFilePath));

              // File is found in switched location. Changing the file path and continuing further

              // Sending a mail to the support team, that the file is in switched reason.
              filePath = tempFilePath;
              isTypeSwitched = true;
              // Sending the error that the file is in switched path
              log.error(
                `File is in switched place ${filePath}, send a mail to the support team`
              );
            } catch (e) {
              // File not found in fail-over directory as well
              if (e.code == 'ENOENT') {
                // Sending the email to the support team that file is not found

                // TODO - Send email to support team
                log.error(
                  `File not found ${filePath}, sending a mail to the support team`
                );
                contentUtil.sendResourceNotFoundEmail(contentId);
                res.status(404).send({
                  error: 'not found',
                  message: 'Requested resource is not found'
                });
                return;
              }
            }
          }
          // If file is not present in switched location, sending the default image if the image requested is not found
          if (isTypeSwitched) {
            contentUtil.sendResouceWrongLocationEmail(contentId);
          } else {
            // Sending the default image if requested for a image
            if (
              contentUtil.validImageExtensions.includes(deafultImageExtension)
            ) {
              res.set(
                'Content-Type',
                contentUtil.getMimeTypeFromFileName(defaultImageFileName)
              );
              fs.createReadStream(defaultImagePath).pipe(res);
            } else {
              res.status(404).send({
                error: 'not found',
                message: 'Requested resource is not found'
              });
            }
            return;
          }
        }
      }
      log.error(e);
    }
    if (req.method.toString().toLowerCase() == 'head') {
      res.status(200).send();
      return;
    } else {
      // Setting the expiry to longer time, if the requested file is an image
      const currentExtension = contentUtil.getExtensionFromFileName(fileName);
      if (contentUtil.validImageExtensions.includes(currentExtension)) {
        // Caching the images
        let noOfSecsForADay = 24 * 60 * 60;
        res.setHeader('Cache-Control', 'public, max-age=' + noOfSecsForADay); // For a day
      }
      const contentType = contentUtil.getMimeTypeFromFileName(fileName);

      // Sending the file as a download if we do not know of the content type of the file, else streaming the response for know types and when should stream is enabled
      if (shouldStream === true && contentType) {
        // If range header is present, streaming it from the service, to the requestor partially
        const range = req.headers.range;
        if (range) {
          const stat = fs.statSync(filePath);
          const fileSize = stat.size;

          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = end - start + 1;
          const artifactFile = fs.createReadStream(filePath, {
            start,
            end
          });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
          };
          res.writeHead(206, head);
          artifactFile.pipe(res);
        } else {
          res.set('Content-Type', contentType);
          fs.createReadStream(filePath).pipe(res);
        }
      } else {
        res.download(filePath, fileName, { dotfiles: 'allow'} );
        // res.download(filePath, fileName, (error) => { console.log('Download send') });
      }
      // log.info(`File served: ${filePath}`);
    }
  } catch (e) {
    // Throwing the exception when the server came across an unexpected behavior.
    console.error(e); //eslint-disable-line
    log.error(e);
    res.status(500).send({
      code: 500,
      msg: 'Error while processing the request'
    });
    return;
  }
}
/**
 * API to save the content to the content directory. This API will assume that the content directory for a content Id is created. If the directory does not exist, a error will be thrown back.
 * On a successful upload of content, the physical file will be stored in the directory (content store).
 *
 * The directory type will be either the 3 of the directories that we are assuming to the part of the content store
 * 	1. assets		--	The assets related to the content (usually images)
 * 	2. artifacts	--	Artifacts are the actual physical content(usually mp4, pdf, json)
 * 	3. ecar_files	--	The ecar files are the content which would be used for the offline download
 */
/**
 * @apiDescription API to upload a file to the content directory
 *  On successful creation, a valid 201 response will be sent back as a response and if the directory already exists,an error code and if there is a problem creating the directory, the server error will be returned.
 *
 * @api {POST} /content/:organization/:contentId/:directoryType Request upload a file into the content directory
 * @apiName UploadFle
 * @apiGroup ContentDirectory
 * @apiParam (URI Param) {String} organization Organization name for which this content directory is being created
 * @apiParam (URI Param) {String} contentId ContentId for which this content directory is being created
 * @apiParam (URI Param) {String} directoryType Type of the directory where this file will be saved. (assets | artifacts | ecar_files)
 * @apiParam (Form Param) {File} content Actual file that is being uploaded into the content directory.
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccess {String} contentURL The url where this content will be available after the successful upload
 * @apiSuccessExample Success response: 201
 * 	HTTPS 201 Created
 * 	{
	  "code": 201,
	  "message": "Content successfully uploaded"
	  "contentURL": "http://<content_url>:<content_port>/content/DEV/do_abcde/index.html?type=assets"
	}

 *  @apiError (Response Error) Conflict:400 A content directory with this contentId and  organization does not exist
 *  @apiErrorExample Error-Response: 400
 *HTTP/1.1 400 BadRequest
 *{
 *  "code": 400,
 *  "message": "Content directory does not exists. First create the content directory to store/upload/update the files in them",
 *  "error": "bad request"
 *}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "error": "Internal Server Error"
 *     }
 */

const contentUrl = config.getProperty('content_url');

router.post(
  '/:organization/:contentId/:directoryType(assets|artifacts|ecar_files){1}',
  [increaseTimeout(50 * 1000)],
  (req, res) => {
    {
      try {
        req.pipe(req.busboy);
        req.busboy.on('file', async function(fieldname, file, filename) {
          //Path where image will be uploaded
          const pathOfContentIdDir =
            resourceDirectory +
            FILE_PATH_SEPARATOR +
            req.params.organization +
            FILE_PATH_SEPARATOR +
            req.params.contentId;
          log.info('Path is: ' + pathOfContentIdDir);

          // Check if the file is writable.
          fs.access(
            pathOfContentIdDir,
            fs.constants.F_OK | fs.constants.W_OK,
            err => {
              log.info(`${file} ${err ? 'is not writable' : 'is writable'}`);
              if (err) {
                log.error(
                  `${file} ${
                    err.code === 'ENOENT' ? 'does not exist' : 'is read-only'
                  }`
                );
                if (err.code === 'ENOENT') {
                  log.error('Directory does not exist for ' + pathOfContentIdDir);
                  // Send that the content directory does not exist
                  res.status(400).send({
                    code: 400,
                    message:
                      'Content directory does not exists. First create the content directory to store/upload/update the files in them',
                    error: 'bad request'
                  });
                  return;
                } else {
                  log.error(
                    'File exists, but not writeable. Send an internal server error'
                  );
                  res.status(500).send({
                    code: 500,
                    message: 'Content directory exists, but trouble accessing it',
                    error: 'Internal Server Error'
                  });
                  return;
                }
              } else {
                // Path exists, now we can save the file
                const contentServiceURL = `${contentUrl}${
                  contentUrl.endsWith('/') ? '' : '/'
                }content/${req.params.organization}/${
                  req.params.contentId
                }/${filename}?type=${req.params.directoryType}`;

                const filePathToSave =
                  pathOfContentIdDir +
                  FILE_PATH_SEPARATOR +
                  req.params.directoryType +
                  FILE_PATH_SEPARATOR +
                  filename;


                let fileStream = fs.createWriteStream(filePathToSave);
                const responseToSend = {
                  code: 201,
                  message: 'Content successfully uploaded',
                  contentUrl: contentServiceURL
                };

                let avCheck = config.getProperty('enable_av_check');

                if (avCheck == 'true') {
                  avUtil.checkForVirusInStreamCopy(file, fileStream).then((avStreamCheckResult) => {
                    console.log('Result of av stream scan: ', avStreamCheckResult);
                    res.send(responseToSend);
                  }).catch((e) => {
                    // Deleting the file after the AV check failed
                    contentUtil.deleteFileAtPath(filePathToSave);

                    console.error(e);
                    if (e.virus) {
                      res.status(400).send({
                        code: 400,
                        msg: 'Malicious file uploaded',
                        threat: e.virus
                      });
                    } else {
                      res.status(500).send({
                        code: 500,
                        msg: 'Internal server error',
                      });
                    }
                  });
                } else {
                  log.info('AV check is disabled');
                  file.pipe(fileStream);
                  fileStream.on('close', function() {
                    log.info('Upload Finished of ' + filename);
                    res.send(responseToSend);
                  });
                }

                /*
                file.pipe(fileStream);
                fileStream.on('close', async function() {
                  log.info('Upload Finished of ' + filename);

                  // If AV check is enabled, then we send the file for AV check, and only after check successfully done, upload it into the content store
                  let avCheck = config.getProperty('enable_av_check');
                  if (avCheck == 'true') {
                    // AV check is enabled
                    try {
                      const avReadStream = fs.createReadStream(filePathToSave);
                      try {
                        let avResult = await avUtil.checkForVirus(avReadStream);
                        log.info(
                          `Result: ${avResult}. File does not have a VIRUS`
                        );

                        // If file is a video. Then creating the .m3u8 file and creating the playlist

                        if (
                          filename.endsWith('.mp4') &&
                          config.getProperty('enable_transcoding') == true
                        ) {
                          log.info(
                            '**************************Matched**************************'
                          ); // eslint-disable-line
                          // File is a video. Make is work for other videos later
                          const ffmpegUtil = require('../ffmpeg/util');
                          ffmpegUtil
                            .executeScript(
                              pathOfContentIdDir +
                                FILE_PATH_SEPARATOR +
                                req.params.directoryType,
                              filename
                            )
                            .then(result => {
                              log.info(
                                'Extracted the m3u8 files playlist',
                                result
                              );
                            })
                            .catch(ex => {
                              console.error('Could not run the script', ex); // eslint-disable-line
                            });
                        }
                        res.send({
                          code: 201,
                          message: 'Content successfully uploaded',
                          contentUrl: contentServiceURL
                        });
                      } catch (e) {
                        console.error(e); // eslint-disable-line
                        // Deleting the file after the AV check failed
                        contentUtil.deleteFileAtPath(filePathToSave);
                        if (e.result) {
                          res.status(400).send({
                            code: 400,
                            msg: 'Malicious file uploaded',
                            threat: e.result
                          });
                        } else {
                          res.status(500).send({
                            msg: 'Error while processing the AV check'
                          });
                        }
                        return;
                      }
                    } catch (e) {
                      res.status(500).send({
                        msg: 'Error while processing the AV check'
                      });
                      // Deleting the file after the AV check failed
                      contentUtil.deleteFileAtPath(filePathToSave);
                      return;
                    }
                  } else {
                    log.info('AV check is disabled');
                    res.send({
                      code: 201,
                      message: 'Content successfully uploaded',
                      contentUrl: contentServiceURL
                    });
                  }
                  // res.send('Done'); //where to go next
                });*/
              }
            }
          );
        });
      } catch (ex) {
        console.error(ex); // eslint-disable-line
        res.status(500).send({
          error: 'Error',
          msg: 'File uploaded is mandatory for this request'
        });
        return;
      }
    }
  }
);
/*
router.post('/content/:organization/:contentId/:directoryType(assets|artifacts|ecar_files){1}', function (req, res) {
	if (!req.files) {
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
			contentUtil.upload(req.params.organization, req.params.contentId, req.params.directoryType, contentFile, function (err, result) {
				if (err) {
					// Sending the error message
					res.status(err.code).send(err);
				} else {
					// Sending the success
					res.status(result.code).send(result);
				}
			});
		}
	}
}); */

function increaseTimeout(delay) {
  return function(req, res, next) {
    res.connection.setTimeout(delay);
    next();
  };
}
/**
 * API to copy the data of a content directory from one ORG to other ORG.
 *
 * This will copy the data from the source ORG and then the pastes it in the destination directory. The directory mentioned as the source, will be copied to the directory mentioned at destination. If no destination mentioned, the copy to the destination org will be done with the same directory as the source.
 *
 * This will copy the directory with the extension suffix of _copy to the destination and on successful copy, will change the directory of the existing source with suffix of _old and once the rename of _old is done, then the directory of _copy will be rename with the original file name.
 */
/**
 * @apiDescription API to copy the data of a content directory from one ORG to other ORG.
 *
 * This will copy the data from the source ORG and then the pastes it in the destination directory. The directory mentioned as the source, will be copied to the directory mentioned at destination. If no destination mentioned, the copy to the destination org will be done with the same directory as the source.
 *
 * This will copy the directory with the extension suffix of _copy to the destination and on successful copy, will change the directory of the existing source with suffix of _old and once the rename of _old is done, then the directory of _copy will be renamed with the original file name.
 *
 * @api {POST} /content/copy/:sourceOrg/to/:destinationOrg/:sourceContentId/:destinationContentId? Request to copy (deep copy) the content from one organization to another.
 * @apiName CopyDirectory
 * @apiGroup ContentDirectory
 * @apiParam (URI Param) {String} sourceOrg Organization name from where the content needs to be copied.
 * @apiParam (URI Param) {String} destinationOrg Organization name where the content will be copied to.
 * @apiParam (URI Param) {String} sourceContentId ContentId of the content directory in source organization.
 * @apiParam (URI Param) {String} destinationContentId(Optional) ContentId of the content directory in destination organization.
 *
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {JSON} response Data for the success and failure movements.
 * @apiSuccessExample Success response: 200
 *HTTP/1.1 200 Success
 *{
 *  "failed":["list of failed directories"],
 *  "success":["list of successfully moved directories"]
 *}
 *  @apiErrorExample Error-Response: 400
 *HTTP/1.1 400 BadRequest
 *{
 *  "code": 400,
 *  "message": "Bad request",
 *  "error": "Content directory does not exist for this content id do_abcd"
 *}
 *  @apiError (Response Error) InternalServerError:500 Server error while processing the request
 *  @apiErrorExample Error-Response: 500
 *     HTTP/1.1 500 InternalServerError
 *     {
 *       "error": "Internal Server Error"
 *     }
 */

router.post(
  '/copy/:sourceOrg/to/:destinationOrg/:sourceContentId/:destinationContentId?',
  function(req, res) {
    const sourceContentId = req.params.sourceContentId;
    const destinationContentId =
      req.params.destinationContentId || req.params.sourceContentId;

    const indexName =
      req.params.sourceOrg.toLowerCase() == 'testauth'
        ? 'lexcontentindex_authoring_tool'
        : 'lexcontentindex';
    let responseCount = 0;
    let successArr = [];
    let failedArr = [];

    if (req.query.td == '1') {
      hierachyUtil.getHierarichalIds(sourceContentId, indexName, idsArr => {
        idsArr.forEach(contentId => {
          contentUtil.moveContentDirectory(
            resourceDirectory + FILE_PATH_SEPARATOR + req.params.sourceOrg,
            resourceDirectory + FILE_PATH_SEPARATOR + req.params.destinationOrg,
            contentId,
            contentId,
            function(err /*,result*/) {
              if (err) {
                // res.status(err.code).send(err);
                failedArr.push(contentId);
                log.error(err);
              } else {
                // res.status(result.code).send(result);
                successArr.push(contentId);
              }
              if (++responseCount == idsArr.length) {
                res.send({
                  success: successArr,
                  failed: failedArr
                });
              }
            }
          );
        });
      });
    } else {
      contentUtil.moveContentDirectory(
        resourceDirectory + FILE_PATH_SEPARATOR + req.params.sourceOrg,
        resourceDirectory + FILE_PATH_SEPARATOR + req.params.destinationOrg,
        sourceContentId,
        destinationContentId,
        function(err /*,result*/) {
          if (err) {
            // res.status(err.code).send(err);
            res.send({
              success: [],
              failed: [sourceContentId]
            });
          } else {
            // res.status(result.code).send(result);
            // successArr.push(contentId);
            res.send({
              failed: [],
              success: [sourceContentId]
            });
          }
        }
      );
    }
  }
);

module.exports = router;