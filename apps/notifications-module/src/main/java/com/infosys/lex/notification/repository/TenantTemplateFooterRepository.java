/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;


public interface TenantTemplateFooterRepository extends CrudRepository<TemplateFooter, TemplateFooterPrimaryKey> {

	@Query(nativeQuery = true, value = "Select * from wingspan.tenant_template_footer where root_org=?1 and org in ?2")
	public List<TemplateFooter> getFooterEmailsForGivenOrgs(String rootOrg, List<String> org);
}
