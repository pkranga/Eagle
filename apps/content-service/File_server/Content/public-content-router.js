/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const router = require('express').Router();
const busboy = require('connect-busboy');
router.use(busboy());

const config = require('../ConfigReader/loader');

// AV util for scanning for the virus files
const avUtil = require('../AvUtil/util');
// If AV check is enabled, then we send the file for AV check, and only after check successfully done, upload it into the content store
let avCheck = config.getProperty(
	'enable_av_check'
);

const publicContentDirectoryPath = config.getProperty(
	'public_content_directory'
);

const log = require('../Logger/log');

const filePermissionMode = 0o755;

router.post('/:directoryName', (req, res) => {
	try {
		req.pipe(req.busboy);
		req.busboy.on('file', async function(fieldname, file, filename) {
			const baseDir = publicContentDirectoryPath + path.sep + req.params.directoryName;
			// Creating the path to save the file
			const filePathToSave = baseDir + path.sep + filename;

			// Chekcing if the base directory exists
			fse.ensureDirSync(baseDir, { mode: filePermissionMode });

			// Creating the stream to store the file
			let fileStream = fs.createWriteStream(filePathToSave, { mode: filePermissionMode });

      const responseToSend = {
        code: 201,
        message: 'File stored successfully',
      };

      let avCheck = config.getProperty('enable_av_check');

      if (avCheck == 'true') {
        avUtil.checkForVirusInStream(file, fileStream).then((avStreamCheckResult) => {
          console.log('Result of av stream scan: ', avStreamCheckResult);
          res.send(responseToSend);
        }).catch((e) => {
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
		});
	} catch (e) {
		console.error('Exception while reading file in public content', e); // eslint-disable-line
		res.status(500).send({
			code: 500,
			msg: 'Error while reading the file'
		});
	}
});

module.exports = router;
