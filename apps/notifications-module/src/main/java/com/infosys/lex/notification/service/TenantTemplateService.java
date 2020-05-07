/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.List;
import java.util.Map;
import java.util.Set;


public interface TenantTemplateService {

	void configureTemplates(String rootOrg, String org, EventTemplateDTO template, String language, String userId)
			throws Exception;

	List<Map<String, Object>> fetchTenantTemplates(String rootOrg, String org, String eventId, String modeId,
			String language);

	List<Map<String, Object>> fetchTemplates(String templateId, String eventId, String recipientRole, String mode,
			List<String> languagePreferences);

	
	List<Map<String, Object>> fetchTemplatesForMultipleIds(Set<String> templateIds, String eventId,
			String recipientRole, String mode, Set<String> languagePreferences);


	List<Map<String, Object>> fetchAllTemplatesByTemplateIds(Set<String> templateIds, String eventId,
			String recipientRole, String mode);

}
