/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
var CryptoJS = require('crypto-js');

var log = require('../Logger/log');

// Secret generation for the API
// Config loader
var config = require('../ConfigReader/loader');
var decryptionSecret = config.getProperty('sec_text');
var decryptionText = config.getProperty('sec_secret');

var secret = CryptoJS.AES.encrypt(decryptionText, decryptionSecret);
log.info('Secret is: ' + secret.toString());

// Encryption text
const textForEncryption = 'Encrypt all headers data for the endpoint that this stupid content service is providing';

// CypherText
var _ciphertext = CryptoJS.AES.encrypt(textForEncryption, secret.toString());
log.info('Enc text is: ' + _ciphertext.toString());

module.exports = {
	getSecret: function () {
		return secret;
	},
	checkValidity: function (reqText) {
		var bytes = CryptoJS.AES.decrypt(reqText, secret.toString());
		var plaintext = bytes.toString(CryptoJS.enc.Utf8);

		log.info('decrypted data: ', plaintext);

		if (plaintext == textForEncryption) {
			return true;
		}
		return false;
	}
};
