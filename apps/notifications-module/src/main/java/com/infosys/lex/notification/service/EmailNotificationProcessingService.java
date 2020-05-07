/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.List;
import java.util.Map;


public interface EmailNotificationProcessingService {

	void enqueueEmailNotification(String rootOrg, String eventId, String recipientRole,
			List<String> emailRecipientUserIds, Map<String, List<String>> recipients,
			Map<String, UserInfo> usersInfoMap, Map<String, Object> tagValuePairs,
			Map<String, String> templateIdToOrgMap, Map<String, String> orgDomainMap,
			Map<String, String> targetDataMapping, Map<String, String> orgAppEmailMap);

	void enqueueEmailNotfificationForRecieverConfigedEvent(String rootOrg, String eventId, String recipientRole,
			List<String> emailRecipientUserIds, Map<String, List<String>> recipients,
			Map<String, UserInfo> usersInfoMap, Map<String, Object> tagValuePairs,
			Map<String, String> templateIdToOrgMap, Map<String, String> orgDomainMap,
			Map<String, String> targetDataMapping, Map<String, String[]> userIdReceiverEmailMap,
			Map<String, String> orgAppEmailMap);

}
