/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
substitute url based on requirement

import java.util.List;
import java.util.Map;



substitute url based on requirement

public interface HierarchyService {

	Map<String,Object> getHierarchyOfContentNode(String identifier,Map<String,Object> reqMap) throws BadRequestException,Exception;

	List<Map<String,Object>> getMetasHierarchy(Map<String, Object> requestMap)throws BadRequestException,Exception;

}
