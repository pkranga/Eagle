/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/**
Â© 2017 - 2019 Infosys Limited, Bangalore, India. All Rights Reserved. 
Version: 1.10

Except for any free or open source software components embedded in this Infosys proprietary software program (â€œProgramâ€�),
this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India,
the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or
by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of 
this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible
under the law.

Highly Confidential

*/


import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v1/users/{userId}")
@CrossOrigin(origins = "*")
public class UserNotificationsConfigurationController {

	@Autowired
	UserNotificationsConfigurationService configurationService;

	@Autowired
	PushService pushService;

	@PatchMapping("/events")
	public ResponseEntity<?> putUserEvents(@RequestHeader("rootOrg") String rootOrg,
			@PathVariable("userId") String userId, @Valid @RequestBody List<TenantEventConfigurationDTO> eventData)
			throws Exception {

		configurationService.setAllEvent(rootOrg, eventData, userId);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@GetMapping("/events")
	public ResponseEntity<?> getUserEvents(@RequestHeader("rootOrg") String rootOrg,
			@PathVariable("userId") String userId, @RequestHeader("langCode") String language) throws Exception {

		List<String> languages = ProjectCommonUtil.convertLanguagePreferencesToList(language);
		List<Map<String, Object>> validEvents = configurationService.getNotificationEventsForUser(rootOrg, userId,
				languages);

		return new ResponseEntity<>(validEvents, HttpStatus.OK);
	}

	@PutMapping("/devices/{device_token}")
	public ResponseEntity<Map<String, Object>> saveARN(@PathVariable("userId") String userId,
			@PathVariable("device_token") String deviceToken,
			@RequestParam(required = true, name = "token_type") String tokenType) throws Exception {

		return new ResponseEntity<>(pushService.generateARN(userId, deviceToken, tokenType), HttpStatus.OK);
	}
}
