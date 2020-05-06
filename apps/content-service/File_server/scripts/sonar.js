/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
	serverUrl : 'http://IP-ADDR:3000/',
	// token : '0731af90dc063017169c9310a91127e3b1065106'
	// token : '52a38743f9c1c7c521e2c1c72415d3aa3cf9509c'
	token: '8cfe2cd380b8a8d908f0dc4a179469e27920eae1'
}, (err, res) => {
	console.log('Err', err); // eslint-disable-line
	console.log('Res', res); // eslint-disable-line
});
