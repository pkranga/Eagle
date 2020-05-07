/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.List;
import java.util.Map;

import org.springframework.data.cassandra.repository.CassandraRepository;


public interface AppConfigRepository extends CassandraRepository<AppConfig, AppConfigPrimaryKey> {

	public List<Map<String, Object>> findAllByPrimaryKeyRootOrgAndPrimaryKeyKeyIn(String rootOrg, List<String> keys);
}
