/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.List;
import java.util.Map;


public interface UserInformationService {

	Map<String, UserInfo> getUserInfoAndNotificationPreferences(String rootOrg, String eventId,
			List<String> recipientRoles, List<String> userIds);

	Map<String, UserInfo> getUserInfo(String rootOrg, List<String> userIds);

	boolean validateUser(String rootOrg, String userId) throws Exception;
}
