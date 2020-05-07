/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.List;
import java.util.Map;

public interface NotificationConsumerUtilService {


	Map<String, String> getOrgDomainMap(String rootOrg);

	Map<String, String> getOrgFooterEmailMap(String rootOrg, List<String> orgs);

	void saveError(String rootOrg, String eventId, Exception e, Object requestBody);

}
