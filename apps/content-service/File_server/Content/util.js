/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
// Config loader
const config = require('../ConfigReader/loader');

// Logger
const log = require('../Logger/log');

// Email
const emailUtil = require('../EmailUtil/util');

const contentDirectory = config.getProperty('resource_directory');
const FILE_SEPARATOR = '/';

const contentUrl = config.getProperty('content_url');

function uploadContentToContentStore(
  orgName,
  contentId,
  directoryType,
  file,
  callback
) {
  // Checking if the content directory exists
  const pathOfContentIdDir =
    contentDirectory +
    FILE_SEPARATOR +
    orgName +
    FILE_SEPARATOR +
    contentId;
  log.info('Path is: ' + pathOfContentIdDir);
  fs.open(pathOfContentIdDir, 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Content directory does not exist
        log.error('Content directory does not exist.');
        if (callback) {
          callback({
            code: 400,
            message:
              'Content directory does not exists. First create the content directory to store/upload/update the files in them',
            error: 'bad request'
          });
          if (!fd) {
            return;
          }
        }
      }
    } else {
      // Content directory exists. Now save the file into the assets or the artifacts directory
      let pathOfFile = pathOfContentIdDir;
      if (directoryType.length > 0) {
        pathOfFile = pathOfFile + FILE_SEPARATOR + directoryType;
      }

      // Saving the file in the directory
      log.info(
        'Path to save:' + pathOfFile + FILE_SEPARATOR + file.name
      );
      file.mv(pathOfFile + FILE_SEPARATOR + file.name, function (err) {
        if (err) {
          console.log(err); // eslint-disable-line
          callback({
            code: 500,
            message:
              'Error while saving the file in the content store',
            error: 'internal server error'
          });
        } else {
          callback(null, {
            code: 201,
            message: 'Content successfully uploaded',
            contentURL:
              contentUrl +
              '/' +
              'content' +
              '/' +
              orgName +
              '/' +
              contentId +
              '/' +
              file.name +
              '?type=' +
              directoryType
          });
        }
      });
    }
    if (fd) {
      fs.close(fd, function (error) {
        if (error) {
          log.error('close error:  ' + error.message);
        } else {
          log.info('File was closed!');
        }
      });
    }
  });
}

function createContentDirectory(orgName, contentId, callback) {
  const pathOfContentIdDir =
    contentDirectory +
    FILE_SEPARATOR +
    orgName +
    FILE_SEPARATOR +
    contentId;
  const desiredMode = 0o775;
  log.info('Path is: ' + pathOfContentIdDir);
  fs.open(pathOfContentIdDir, 'r', (err, fd) => {
    // Content Id directory does not exist. We can create it now
    if (err) {
      if (err.code === 'ENOENT') {
        log.info(
          'content directory does not exist. Creating the directory now.'
        );
        fse.ensureDir(pathOfContentIdDir, desiredMode, err => {
          if (err) {
            if (callback) {
              log.info(
                'Error while trying to create the content directory'
              );
              callback(
                {
                  code: 500,
                  message:
                    'Error while trying to create the content directory',
                  error: 'Internal server error'
                },
                null
              );
              return;
            }
          }
          // content directory has now been created. Now we will create the assets, artifacts and the ecar files directory.
          const directoriesNeeded = ['assets', 'artifacts', 'ecar_files'];
          const promiseArr = [];
          directoriesNeeded.forEach(directory => {
            promiseArr.push(createDirectory(pathOfContentIdDir + FILE_SEPARATOR + directory, desiredMode));
          });
          Promise.all(promiseArr).then(() => {
            // All the directories have been successfully created. Now we can send a proper response
            if (callback) {
              log.info(
                'Content directory and sub directories successfully created'
              );
              callback(null, {
                code: 201,
                message:
                  'Content directory ' +
                  contentId +
                  ' successfully created'
              });
            }
          }).catch((err) => {
            console.error(err); // eslint-disable-line
            if (callback) {
              log.info(
                'Error while trying to create the assets | artifacts | ecar_files  directory'
              );
              callback(
                {
                  code: 500,
                  message:
                    'Error while trying to create the assets | artifacts | ecar_files directory',
                  error:
                    'Internal server error'
                },
                null
              );
              return;
            }
          });
        });
        return;
      }
    }
    // Content Id directory exists. Throw a conflict
    if (callback) {
      log.info(
        'Conflict! Existing content directory trying to be created'
      );
      callback(
        {
          code: 409,
          message:
            'Directory with the content id ' +
            contentId +
            ' already exists. Delete it if you want to recreate the content directory with new content',
          error: 'conflict'
        },
        null
      );
    }
    if (fd) {
      fs.close(fd, function (error) {
        if (error) {
          log.error('close error:  ' + error.message);
        } else {
          log.info('File was closed!');
        }
      });
    }
  });
}

function createDirectory(path, desiredMode) {
  return fse.ensureDir(path, desiredMode);
}

function deleteContentDirectory(orgName, contentId, callback) {
  const pathOfContentIdDir =
    contentDirectory +
    FILE_SEPARATOR +
    orgName +
    FILE_SEPARATOR +
    contentId;
  log.info('Path is: ' + pathOfContentIdDir);
  fs.open(pathOfContentIdDir, 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Content Id directory does not exist. Send the error code
        if (callback) {
          callback(
            {
              code: 404,
              message:
                'Directory with the content id ' +
                contentId +
                ' does not exist',
              error: 'not found'
            },
            null
          );
        }
      } else {
        if (callback) {
          callback(
            {
              code: 500,
              message:
                'Problem while deleting the directory',
              error: 'Internal server error',
              other: err.code
            },
            null
          );
        }
      }
    }
    if (fd) {
      // Closing the file of open
      fs.close(fd, function (error) {
        if (error) {
          log.error('close error:  ' + error.message);
        } else {
          log.info('File was closed!');
        }
      });
    }
    if (!err && fd) {
      // Directory exists and no errors. Let's delete it now :/
      // remove directory
      fse.remove(pathOfContentIdDir, function (err) {
        if (err) {
          console.log(err); // eslint-disable-line
          callback(
            {
              code: 500,
              message:
                'Problem while deleting the content directory',
              error: 'internal server error'
            },
            null
          );
        } else {
          if (callback) {
            callback(null, {
              code: 200,
              message:
                'Content directory ' +
                contentId +
                ' successfully deleted'
            });
          }
        }
      });
    }
  });
}

const FILE_PATH_SEPARATOR = '/';
const copySuffix = '_copy';
const backupSuffix = '_old';

function moveContentDirectory(
  sourceOrg,
  destinationOrg,
  sourceContentId,
  destinationContentId,
  callback
) {
  const sourceDirectoryPath =
    sourceOrg + FILE_PATH_SEPARATOR + sourceContentId;
  const destinationDirectoryPath =
    destinationOrg + FILE_PATH_SEPARATOR + destinationContentId;

  log.info(`Content move requested for ${sourceContentId}`);
  log.info(`Source directory path ${sourceOrg}/${sourceContentId}`);
  log.info(
    `Destination directory path ${destinationOrg}/${destinationContentId}`
  );

  // Check if the directory exists which needs to be moved
  if (!fs.existsSync(sourceDirectoryPath)) {
    if (callback) {
      callback(
        {
          err: `Content directory does not exist for this content id ${sourceContentId}`,
          msg: 'Bad request',
          code: 400
        },
        null
      );
    }
  } else {
    // If nothing exists at destination, just move the data without backup mechanism
    if (!fs.existsSync(destinationDirectoryPath)) {
      // just copy from source to dest
      justCopy(sourceDirectoryPath, destinationDirectoryPath, function (
        err,
        result
      ) {
        callback(err, result);
      });
    } else {
      // Source directory exists, now copy the data of the directory from source to destination with suffix _copy
      const tempCopyDir = destinationDirectoryPath + copySuffix;
      log.info('Temp path is: ' + tempCopyDir);

      fse.pathExists(tempCopyDir).then(exists => {
        if (exists) {
          log.info('Temp path exists. Now deleting it');
          // Copy directory exists. Delete this directory
          fse.remove(tempCopyDir, function (err) {
            console.log(err); // eslint-disable-line
            if (err) {
              callback(
                {
                  code: 500,
                  message:
                    'Error while removing the existing copy of the source directory in the destination',
                  error: 'Internal server error'
                },
                null
              );
              return;
            } else {
              // Call the copy directory
              log.info('Directory removed!!');
              copyWithBackup(
                sourceDirectoryPath,
                tempCopyDir,
                function (err, response) {
                  callback(err, response);
                }
              );
            }
          });
        } else {
          log.info(
            'Temp path does not exist, Directly deleting it'
          );
          // Call the copy directory
          copyWithBackup(
            sourceDirectoryPath,
            tempCopyDir,
            function (err, response) {
              callback(err, response);
            }
          );
        }
      });
    }
  }
}

function justCopy(sourcePath, destinationPath, callback) {
  fse.copy(
    sourcePath,
    destinationPath,
    {
      overwrite: true
    },
    function (err) {
      if (err) {
        console.log('Error is:', err); // eslint-disable-line
        if (callback) {
          log.info(
            'Error while trying to copy the file from source to destination'
          );
          callback(
            {
              code: 500,
              message:
                'Error while trying to copy the file from source to destination',
              error: 'Internal server error'
            },
            null
          );
        }
        return;
      } else {
        // Copied here
        callback(null, {
          code: 204,
          message: 'Move successful'
        });
      }
    }
  );
}

function copyWithBackup(sourcePath, destinationPath, callback) {
  // If the directory does not exist in the destination, then just copy it, else copy with backup
  const originalDestinationPath = destinationPath.replace(/_copy/g, '');

  // Create directory and call the copy function
  fse.ensureDir(sourcePath, err => {
    if (err) {
      if (callback) {
        log.info(
          'Error while trying to create the new copy directory'
        );
        callback(
          {
            code: 500,
            message:
              'Error while trying to create the new copy directory',
            error: 'Internal server error'
          },
          null
        );
      }
      return;
    } else {
      // Temporary directory created
      // Now move all the files (cp -r)
      fse.copy(
        sourcePath,
        destinationPath,
        {
          overwrite: true
        },
        function (err) {
          if (err) {
            console.log('Error AT 1'); // eslint-disable-line
            console.log(err); // eslint-disable-line

            if (callback) {
              log.info(
                'Error while trying to copy the file from source to destination'
              );
              callback(
                {
                  code: 500,
                  message:
                    'Error while trying to copy the file from source to destination',
                  error: 'Internal server error'
                },
                null
              );
            }
            return;
          } else {
            // Copied successfully
            // Delete the old backup before taking the new backup
            // Moving the original files to _old suffix
            fse.move(
              originalDestinationPath,
              originalDestinationPath + backupSuffix,
              {
                overwrite: true
              }
            )
              .then(() => {
                // Original moved to folder with suffix _old. If there is a data hit here, then there is inconsistency
                // Now move the _copy to new place
                fse.move(
                  destinationPath,
                  originalDestinationPath,
                  {
                    overwrite: true
                  }
                )
                  .then(() => {
                    // Files successfully moved
                    if (callback) {
                      callback(null, {
                        code: 204,
                        message:
                          'Move successful'
                      });
                    }
                    return;
                  })
                  .catch(err => {
                    // Error while moving the files
                    // Move back the _old to original destination (TBD)
                    if (err) {
                      console.log('Error @ 2'); // eslint-disable-line
                      console.log(err); // eslint-disable-line
                      if (callback) {
                        callback(
                          {
                            code: 500,
                            message:
                              'Error while moving the copy to original',
                            error:
                              'Internal server error'
                          },
                          null
                        );
                      }
                    }
                    return;
                  });
              })
              .catch(err => {
                if (err) {
                  console.log('Error @ 2'); // eslint-disable-line
                  console.log(err); // eslint-disable-line
                  if (callback) {
                    callback(
                      {
                        code: 500,
                        message:
                          'Error while moving the original folder to backup',
                        error:
                          'Internal server error'
                      },
                      null
                    );
                  }
                }
                return;
              });

            // Successfully moved the old files to the new
          }
        }
      );
    }
  });
}

// List filename extensions and MIME names we need as a dictionary.
const mimeNames = {
  '.apng': 'image/apng',
  '.bmp': 'image/bmp',
  '.css': 'text/css',
  '.cur': 'image/x-icon',
  '.epub': 'application/epub+zip',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jfif': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.oga': 'audio/ogg',
  '.ogg': 'application/ogg',
  '.ogv': 'video/ogg',
  '.pdf': 'application/pdf',
  '.pjp': 'image/jpeg',
  '.pjpeg': 'image/jpeg',
  '.png': 'image/png',
  '.rar': 'application/x-rar-compressed',
  '.svg': 'image/svg+xml',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.txt': 'text/plain',
  '.wav': 'audio/x-wav',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.zip': 'application/zip',
};

function getMimeTypeFromFileName(fileName) {
  var extension = fileName.split('.');
  if (extension.length > 1 && extension[extension.length - 1]) {
    return mimeNames['.' + extension[extension.length - 1]];
  } else {
    throw new Error('Unable to process the file extension.');
  }
}

// Get video duration

let { getVideoDurationInSeconds } = require('get-video-duration');

async function getVideoLength(organization, contentId, type, fileName) {

  try {
    if (
      fileName === undefined ||
      fileName === null ||
      fileName.length <= 0 ||
      !validAudioVideoFormats.includes(
        fileName.split('.')[fileName.split('.').length - 1]
      )
    ) {
      return {
        code: 400,
        msg: 'Invalid file'
      };
    }
    const fileLocation =
      contentDirectory +
      FILE_SEPARATOR +
      organization +
      FILE_SEPARATOR +
      contentId +
      FILE_SEPARATOR +
      type +
      FILE_SEPARATOR +
      fileName;

    if (fse.existsSync(fileLocation)) {
      let duration = await getVideoDurationInSeconds(fileLocation);
      if (duration) {
        return {
          fileName,
          duration,
          unit: 'sec'
        };
      }
    } else {
      return {
        code: 404,
        message: 'File not found'
      };
    }
  } catch (err) {
    console.error(err); // eslint-disable-line
    if (err.code === 'ENOENT')
      throw {
        code: 404,
        message: 'File was not found'
      };
    else
      throw {
        code: 500,
        message: 'Error while processing the request'
      };
  }
}
// const validImageExtensions = [
// 	'jpg',
// 	'jpeg',
// 	'png',
// 	'gif',
// 	'bmp',
// 	'tiff',
// 	'svg'
// ];
const validImageExtensions = [
  'apng',
  'bmp',
  'gif',
  'ico',
  'cur',
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  'png',
  'svg',
  'tif',
  'tiff',
  'webp'
];

const validAudioVideoFormats = [
  'avi',
  'flv',
  'mov',
  'wmv',
  'mp4',
  'mpg',
  'mpeg',
  '3gp',
  'aac',
  'mp3',
  'm4a',
  'wav',
  'wma',
  'webm'
];

const envName = config.getProperty('environment_name') || '';
const supportEmail = config.getProperty('support_email_id');
function sendResourceNotFoundEmail(identifier) {
  const text = `Environment name ${envName}: Resource not found for identifier ${identifier}.`;
  emailUtil.sendEmail({
    from: supportEmail,
    to: supportEmail,
    subject: text,
    msg: text,
  }).then(() => log.info('Email sent to support team')).catch(() => log.error('Exception while sending email to the support team'));
}
function sendResouceWrongLocationEmail(identifier) {
  const text = `Environment name ${envName}: Resource location switched for identifier ${identifier}.`;
  emailUtil.sendEmail({
    from: supportEmail,
    to: supportEmail,
    subject: text,
    msg: text,
  }).then(() => log.info('Email sent to support team')).catch(() => log.error('Exception while sending email to the support team'));
}

function deleteFileAtPath(filePath) {
  return new Promise((resolve, reject) => {
    fse.unlink(filePath, (err) => {
      if (err) {
        console.error('Error while deleting the file', err); // eslint-disable-line
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function performHealthCheck() {
  return new Promise((resolve, reject) => {
    const resourceDirectory = config.getProperty('resource_directory');
    const defaultImagePath = `${resourceDirectory}${path.sep}DEFAULTS${path.sep}IMAGES${path.sep}default.png`;
    try {
      fs.statSync(path.resolve(defaultImagePath));
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });

}

function getExtensionFromFileName(fileName) {
  if (!fileName) {
    throw new Error('File name cannot be empty');
  }
  const fileNameArr = fileName.split('.')
  if (fileNameArr.length < 2) {
    throw new Error('File does not have an extension');
  }
  return fileNameArr[fileNameArr.length - 1];
}

module.exports = {
  create: createContentDirectory,
  //read: getContentFromContentStore -- This should be implemented, right now, for the purpose of file streaming, this method id directly handled on the express's router handler.
  upload: uploadContentToContentStore,
  delete: deleteContentDirectory,
  getMimeTypeFromFileName,
  moveContentDirectory,
  getVideoLength,
  validImageExtensions,
  validAudioVideoFormats,
  sendResourceNotFoundEmail,
  sendResouceWrongLocationEmail,
  deleteFileAtPath,
  performHealthCheck,
  contentDirectory,
  getExtensionFromFileName
};
