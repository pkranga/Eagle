/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.sql.Timestamp;
import java.util.Date;

import org.apache.kafka.common.network.InvalidReceiveException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;


@Service
public class SMTPConfigServiceImpl implements SMTPConfigService {

	@Autowired
	Environment env;

	@Autowired
	SMTPConfigRepository smtpRepo;

	@Autowired
	EncryptionService encryptionService;

	@Override
	public void putSMTPConfig(String rootOrg, SMTPDTO data) {

		if (rootOrg == null || rootOrg.isEmpty())
			throw new InvalidReceiveException("rootOrg is mandatory");

		if (data == null)
			throw new InvalidReceiveException("smpt config data is mandatory");

		SMTPConfig config = new SMTPConfig(rootOrg, data.getUserName(),
				data.getPassword().isEmpty() ? ""
						: encryptionService.encrypt(data.getPassword(), env.getProperty(rootOrg + ".smtpKey")),
				data.getHost(), data.getPort(), data.getSenderId(), new Timestamp(new Date().getTime()), "System");

		smtpRepo.save(config);
	}

	@Override
	public SMTPConfig getSMTPConfig(String rootOrg) {

		if (rootOrg == null || rootOrg.isEmpty())
			throw new ApplicationLogicException("root org is not present");

		SMTPConfig config = smtpRepo.findById(rootOrg).orElse(null);

		if (config == null)
			throw new ApplicationLogicException("smtp config not found for " + rootOrg);

		if (config.getHost() == null || config.getHost().isEmpty())
			throw new ApplicationLogicException("smtp host not found for " + rootOrg);

		// de-crypt stored password in db
		if (!config.getPassword().isEmpty())
			config.setPassword(encryptionService.decrypt(config.getPassword(), env.getProperty(rootOrg + ".smtpKey")));

		return config;
	}
}
