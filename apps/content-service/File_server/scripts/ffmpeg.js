/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const shellJS = require('shelljs');

const testFFmpegCommand = '/content-directory/create-video.sh /content-directory/ETA/lex_1523793109555473943187/assets/1_1_8_Cust.mp4 /content-directory/web-host/test-ffmpeg';
shellJS.exec(testFFmpegCommand, function(code, stdout, stderr) {
	console.log('Exit code:', code); // eslint-disable-line
	console.log('Program output:', stdout); // eslint-disable-line
	console.log('Program stderr:', stderr); // eslint-disable-line
});
