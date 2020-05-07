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


import java.util.List;
import java.util.Map;


public interface UserNotificationsService {

	/**
	 * updating seen time of notification
	 * 
	 * @param userId
	 * @param data
	 * @param userIdType
	 * 
	 * @throws Exception
	 */
	public void markAsSeen(String rootOrg, String userId, String notificationId) throws Exception;

	/**
	 * Get user notifications.
	 * 
	 * page is the pagination sequence returned by the previous call.
	 * 
	 * size is number of notification records per page fetch.
	 * 
	 * @param userId
	 * @param page
	 * @param size
	 * @param userIdType
	 * @return
	 * @throws Exception
	 */
	NotificationSendDTO getAllNotifications(String rootOrg, String userId, String page, Integer size,
			String classification, Boolean seen) throws Exception;

	/**
	 * bulk send in-app notifications
	 * 
	 * @param notificationEvent
	 * @param rootOrg
	 * @param inAppRequests
	 * @param eventId
	 * @param recipientRoles
	 */
	void sendInAppNotifications(NotificationEvent notificationEvent, List<InAppNotificationRequest> inAppRequests);

	/**
	 * Get unseen notification count
	 * 
	 * @param userId
	 * @param page
	 * @param size
	 * @param userIdType
	 * @return
	 * @throws Exception
	 */
	public Map<String, Object> getCountOfAllUnSeenNotifications(String rootOrg, String userId) throws Exception;

	void markAllAsRead(String rootOrg, String userId, String classification, List<String> notificationIds)
			throws Exception;

//	List<String> generateUpdateStmts();
}
