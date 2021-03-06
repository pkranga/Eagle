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
substitute url based on requirement

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

substitute url based on requirement

@RestController
@CrossOrigin(origins = "*")
public class UserDataCorrectionController {

	@Autowired
	UserDataCorrectionService uDCService;

	/**
	 * recalculate all benchmark based badges
	 * 
	 * @param userId
	 * @return
	 */
	@PostMapping("/v1/User/{userId}/recalculatebadges")
	public Map<String, Object> Recalculate(@PathVariable("userId") String userId, @RequestHeader String rootOrg)
			throws Exception {

		Map<String, Object> resp = new HashMap<>();
		resp.put("version", "v1");
		resp.put("id", "api.recalculatebadges");
		resp.put("Ts", new Timestamp(new Date().getTime()));
//		resp.setTs(ProjectUtil.getFormattedDate());
		resp.put("response", uDCService.correctData(rootOrg, userId));
		return resp;
	}

}
