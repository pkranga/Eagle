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


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.amazonaws.services.sns.model.CreatePlatformEndpointRequest;
import com.amazonaws.services.sns.model.CreatePlatformEndpointResult;
import com.amazonaws.services.sns.model.PublishRequest;

@Service
public class PushServiceImpl implements PushService {

	@Autowired
	UserValidation userValidation;

	@Autowired
	ApplicationServerProperties applicationServerProperties;

	@Autowired
	AWSConfig awsConfig;

	@Autowired
	UserDeviceRepository userDeviceRepo;

	/*
	 * (non-Javadoc)
	 * 
	 * String, java.lang.String, java.lang.String, java.lang.String)
	 */

	@Override
	public Map<String, Object> generateARN(String userID, String token, String tokenType) throws Exception {

		Map<String, Object> returnMap = new HashMap<>();
		userID = userValidation.checkUserExistence(userID, "uuid");
		String platformArn = null;

		if (tokenType.equalsIgnoreCase("GCM")) {
			platformArn = applicationServerProperties.getGcmPlatformArn();
		} else {
			platformArn = applicationServerProperties.getApnsPlatformArn();
		}

		if (platformArn != null) {
			CreatePlatformEndpointResult endpointResult = awsConfig.snsClient().createPlatformEndpoint(
					new CreatePlatformEndpointRequest().withPlatformApplicationArn(platformArn).withToken(token));

			if (endpointResult != null
					&& (endpointResult.getEndpointArn() != null && !endpointResult.getEndpointArn().isEmpty())) {
				// notificationService.setArnsData(userID, null,
				// endpointResult.getEndpointArn());
				returnMap.put("result", "End-point ARN successfully generated!");
			} else {
				returnMap.put("result", "End-point ARN generation failed -  AWS error!");
			}
		} else {
			returnMap.put("result", "End-point ARN generation failed -  No platform ARN found!");
		}
		return returnMap;
	}

	/*
	 * (non-Javadoc)
	 * 
	 */
	@Override
	public void sendPush(PushNotificationRequest pushNotificationEvent) {

		List<String> arns = userDeviceRepo.getUserArns(pushNotificationEvent.getUserId()).getArns();

		if (arns.isEmpty())
			return;

		for (String arn : arns) {
			awsConfig.snsClient().publish(new PublishRequest().withTargetArn(arn)
					.withSubject(pushNotificationEvent.getSubject()).withMessage(pushNotificationEvent.getBody()));
		}
	}
}
