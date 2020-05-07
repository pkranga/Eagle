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
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.datastax.driver.core.utils.UUIDs;
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement

@Service
public class UserPostProcessingServiceImpl implements UserPostProcessingService {

	UserUtilityService userSvc;
	UserAccessPathsRepository userAccessPathsRepo;
	EmailToGroupRepository emailToGroupRepo;
	UserUtilityService userUtilitySvc;
	UserBadgeRepository userBadge;
	RestHighLevelClient esClient;
substitute url based on requirement
	AppConfigRepository appConfigRepository;

	@Autowired
	public UserPostProcessingServiceImpl(UserUtilityService userSvc, UserAccessPathsRepository userAccessPathsRepo,
			EmailToGroupRepository emailToGroupRepo, UserUtilityService userUtilitySvc, UserBadgeRepository userBadge,
substitute url based on requirement

		this.userSvc = userSvc;
		this.userAccessPathsRepo = userAccessPathsRepo;
		this.emailToGroupRepo = emailToGroupRepo;
		this.userUtilitySvc = userUtilitySvc;
		this.userBadge = userBadge;
		this.esClient = esClient;
substitute url based on requirement
		this.appConfigRepository = appConfigRepository;
	}

	@Override
	public void userPostProcessing(String rootOrg, String org, String userId, String language) throws Exception {

//		// Validating the userId
		if (!userSvc.validateUser(rootOrg, userId)) {
			throw new BadRequestException("Invalid User : " + userId);
		}

		Optional<AppConfig> appConfig = appConfigRepository
				.findById(new AppConfigPrimaryKey(rootOrg, "default_user_access_path"));

		if (!appConfig.isPresent())
			throw new ApplicationLogicError("default access path not found for user");

		String defAccessPathRootOrg = appConfig.get().getValue().substring(0, appConfig.get().getValue().indexOf(","));
		String defAccessPathOrg = appConfig.get().getValue().substring(appConfig.get().getValue().indexOf(",") + 1);

		Timestamp dateAccepted = new Timestamp(System.currentTimeMillis());

		if (userAccessPathsRepo.findByPrimaryKeyUserId(UUID.fromString(userId)).isEmpty()) {

			UserAccessPathsPrimaryKeyModel defaultAccessPathsPrimaryKey = new UserAccessPathsPrimaryKeyModel();

			defaultAccessPathsPrimaryKey.setRootOrg(defAccessPathRootOrg);
			defaultAccessPathsPrimaryKey.setOrg(org);
			defaultAccessPathsPrimaryKey.setUserId(UUID.fromString(userId));
			defaultAccessPathsPrimaryKey.setCasId(UUIDs.timeBased());

			UserAccessPathsModel defaultAccessPaths = new UserAccessPathsModel();
			defaultAccessPaths.setPrimaryKey(defaultAccessPathsPrimaryKey);

			Set<String> accessPaths = new HashSet<>(Arrays.asList(defAccessPathRootOrg, defAccessPathOrg));
			defaultAccessPaths.setAccessPaths(accessPaths);
			defaultAccessPaths.setTemporary(false);
			defaultAccessPaths.setTtl(0);
			UserAccessPathsModel response = userAccessPathsRepo.save(defaultAccessPaths);
			if (response == null) {
				throw new ApplicationLogicError("useraccess.insertfailed");
			}
		}

		// checking whether user has been mapped to any access groups before accepting
		// the tnc
//
//		String emailId = userUtilitySvc.getUserEmailFromUserId(rootOrg,userId);
//		List<EmailToGroupModelPrimaryKeyModel> emailToGroups = emailToGroupRepo.findByEmail(emailId);
//		if (!emailToGroups.isEmpty()) {
//			List<String> groupIds = emailToGroups.stream().map(emailToGroup -> emailToGroup.getGroupIdentifier())
//					.collect(Collectors.toList());
//
//			BulkRequest request = new BulkRequest();
//			groupIds.forEach(item -> {
//				UpdateRequest updateObj = new UpdateRequest();
//				updateObj.index(LexProjectUtil.EsIndex.access_control_groups.getIndexName());
//				updateObj.type(LexProjectUtil.EsType.access_control_group.getTypeName());
//				updateObj.id(item);
//				Map<String, Object> params = new HashMap<>();
//				params.put("x", userId);
//				updateObj.script(
//						new Script(ScriptType.INLINE, "painless", "ctx._source['userIds'].add(params.x)", params));
//				request.add(updateObj);
//			});
//			BulkResponse resObj = null;
//			try {
//				resObj = esClient.bulk(request, RequestOptions.DEFAULT);
//			} catch (IOException e) {
//				throw new ApplicationLogicError("Access path mapping fetch failed");
//			}
//
//			if (!resObj.hasFailures()) {
//				emailToGroupRepo.deleteAll(emailToGroups);
//			}
//		}

		// Checking and inserting Fledgling badge
		boolean hasFledgling = false;
		Optional<UserBadgesModel> response = userBadge
				.findById(new UserBadgesPrimaryKeyModel(rootOrg, userId, "NewUser"));
		if (response.isPresent()) {
			hasFledgling = true;
		}
		// If not found then insert the badge
		UserBadgesModel insertResponse = null;
		if (!hasFledgling) {
			insertResponse = userBadge
					.save(new UserBadgesModel(new UserBadgesPrimaryKeyModel(rootOrg, userId, "NewUser"), "O",
							dateAccepted, dateAccepted, 100.0f, dateAccepted, 1));
		}

		if (insertResponse == null && !hasFledgling) {
			throw new ApplicationLogicError("badgeinsertion.failed");
		}
	}
}
