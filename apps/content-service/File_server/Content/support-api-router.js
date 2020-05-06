/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const router = require('express').Router();
const contentUtil = require('./util');

function filterVideoFileName(req, res, next) {
	try {
		if (req.params.fileName && req.params.fileName.length > 0) {
			const tempFileExtArr = req.params.fileName.split('.');
			const fileExtensionName = tempFileExtArr[tempFileExtArr.length-1];

			if (fileExtensionName && fileExtensionName.length>0 && contentUtil.validAudioVideoFormats.includes(fileExtensionName)) {
				next();
				return;
			}
		}
		res.status(400).send({
			code: 400,
			msg: 'Bad file extension'
		});
	} catch (e) {
		console.error(e); // eslint-disable-line
		res.status(500).send({
			code: 500,
			msg: 'Error while processing the request'
		});
	}
}

// Get the video length of a video file
router.get('/video-length/:organization/:contentId/:directoryType(assets|artifacts|ecar_files){1}/:fileName', filterVideoFileName, (req, res) => {
	contentUtil.getVideoLength(req.params.organization, req.params.contentId, req.params.directoryType, req.params.fileName)
		.then((result) => res.send(result))
		.catch((err) => res.status(err.code).send(err));
});

module.exports = router;
