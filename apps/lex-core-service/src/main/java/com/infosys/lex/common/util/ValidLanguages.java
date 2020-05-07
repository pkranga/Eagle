/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
substitute url based on requirement

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement

@Component
public class ValidLanguages {

	@Autowired
	AppConfigRepository appConfigRepo;

	@Cacheable("interests")
	public List<String> allowedLanguages() throws ResourceNotFoundException {

		Optional<AppConfig> appconfig = appConfigRepo.findById(new AppConfigPrimaryKey("default", "allowedlanguages"));
		if (!appconfig.isPresent()) {
			throw new ResourceNotFoundException("default language is not found");
		} else {
			return Arrays.asList(appconfig.get().getValue().split(","));
		}
	}

}
