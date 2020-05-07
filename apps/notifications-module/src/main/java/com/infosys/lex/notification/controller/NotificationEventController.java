/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/**
© 2017 - 2019 Infosys Limited, Bangalore, India. All Rights Reserved. 
Version: 1.10

Except for any free or open source software components embedded in this Infosys proprietary software program (“Program”),
this Program is protected by copyright laws, international treaties and other pending or existing intellectual property rights in India,
the United States and other countries. Except as expressly permitted, any unauthorized reproduction, storage, transmission in any form or
by any means (including without limitation electronic, mechanical, printing, photocopying, recording or otherwise), or any distribution of 
this Program, or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible
under the law.

Highly Confidential

*/


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

/**
 * 
 * Controllers to put notification events to kafka for further processing.
 * Consumers for the events in ConsumerServiceImpl.java.
 *
 */
@RestController
@CrossOrigin(origins = "*")
public class NotificationEventController {

	@Autowired
	ProducerService producerService;
	

	/**
	 * enqueue plain text email event.
	 * 
	 * will work with both userId or email set in recipients(to,cc,bcc)
	 * 
	 * 
	 * 
	 * @param rootOrg
	 * @param emailEvent
	 * @return
	 * @throws JsonProcessingException
	 */
	@PostMapping("/v1/notification/email")
	public ResponseEntity<?> enqueueEmailEvent(@RequestHeader(name = "rootOrg") String rootOrg,
			@RequestBody EmailRequest emailEvent) throws JsonProcessingException {

		emailEvent.setRootOrg(rootOrg);
		producerService.enqueueEmailEvent(emailEvent);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}

	/**
	 * enqueue plain text push event.
	 * 
	 * @param rootOrg
	 * @param emailEvent
	 * @return
	 * @throws JsonProcessingException
	 */
	@PostMapping("/v1/notification/push")
	public ResponseEntity<?> enqueuePushEvent(@RequestHeader(name = "rootOrg") String rootOrg,
			@RequestBody PushNotificationRequest pushNotificationRequest) throws JsonProcessingException {

		pushNotificationRequest.setRootOrg(rootOrg);
		producerService.enqueuePushEvent(pushNotificationRequest);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}

	/**
	 * enqueue notification event to trigger email and in-app notification.
	 * 
	 * configuration to send sms and push as well but not enabled.
	 * 
	 * @param rootOrg
	 * @param notificationEvent
	 * @return
	 * @throws JsonProcessingException
	 */
	@PostMapping("/v1/notification/event")
	public ResponseEntity<?> enqueueNotificationEvent(@RequestHeader(name = "rootOrg") String rootOrg,
			@RequestBody NotificationEvent notificationEvent) throws JsonProcessingException {

		notificationEvent.setRootOrg(rootOrg);
		producerService.enqueueNotificationEvent(notificationEvent);
		return new ResponseEntity<>(HttpStatus.ACCEPTED);
	}
}
