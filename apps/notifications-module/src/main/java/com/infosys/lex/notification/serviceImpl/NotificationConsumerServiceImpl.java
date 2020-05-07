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


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class NotificationConsumerServiceImpl implements NotificationConsumerService {



	@Autowired
	UserInformationService userInfoService;

	@Autowired
	RecipientTagsRepository recipientTagsRepo;

	@Autowired
	TenantTemplateService tenantTemplateService;



	@Autowired
	TenantEventConfigurationService tenantEventService;

	@Autowired
	UserNotificationsService userNotificationService;

	
	@Autowired
	ProducerService producerService;

	
	@Autowired
	NotificationConsumerUtilService consumerUtilServ;


	@Autowired
	EmailNotificationProcessingService emailProcessingServ;
	
	
	

	private LexNotificationLogger logger = new LexNotificationLogger(getClass().getName());


	@SuppressWarnings("unchecked")
	@Override
	public void consumeNotificationEvent(NotificationEvent notificationEvent) {

		String rootOrg = notificationEvent.getRootOrg();
		Map<String, String> orgDomainMap = consumerUtilServ.getOrgDomainMap(rootOrg);
		String eventId = notificationEvent.getEventId();
		Map<String, String> orgToTemplateIdMapForEmail = new HashMap<String, String>();

		// templateid to org map used for configured receiver events
		Map<String, String> templateIdToOrgMap = new HashMap<>();

		Map<String, List<String>> recipients = notificationEvent.getRecipients();

		// getting target url for email if not found in the request body
		Map<String, String> targetDataMapping = this.getTargetData(notificationEvent);

		// getting all unique userIds in the recipients of request body.
		Set<String> userIds = notificationEvent.getRecipients().entrySet().stream()
				.flatMap(entry -> entry.getValue().stream()).collect(Collectors.toSet());

		// getting users personal data and notification configuration for event.
		Map<String, UserInfo> usersInfoMap = userInfoService.getUserInfoAndNotificationPreferences(rootOrg, eventId,
				new ArrayList<>(notificationEvent.getRecipients().keySet()), new ArrayList<>(userIds));

		// getting all distinct org's for the user's in request body.
		Set<String> distinctOrgs = usersInfoMap.entrySet().stream()
				.flatMap(userInfo -> userInfo.getValue().getOrgs().stream()).collect(Collectors.toSet());

		// get the app email to replaced in template for all the orgs
		Map<String, String> orgAppEmailMap = consumerUtilServ.getOrgFooterEmailMap(rootOrg, new ArrayList<>(distinctOrgs));

		// getting all the receiving roles and modes configured for the given eventId.
		List<Map<String, Object>> tenantNotificationConfigMaps = tenantEventService
				.getActivatedModesForEventAndRootOrgAndOrgs(rootOrg, new ArrayList<>(distinctOrgs), eventId);

		List<InAppNotificationRequest> inAppRequests = new ArrayList<>();

		for (Map.Entry<String, List<String>> recipient : recipients.entrySet()) {

			// this is used for events where receiver email is configured
			Map<String, String[]> userIdRecieverEmailMap = new HashMap<>();

			String recipientRole = recipient.getKey();
			List<String> recipientsUserIds = new ArrayList<>(recipient.getValue());
			boolean emailToBeSentAnyUser = false;
			List<String> emailRecipientUserIds = new ArrayList<String>();
			boolean isEventRecieverConfigured = false;
			for  (String userId: recipientsUserIds) {

				// if userid data not available dont send any notification
				if (!usersInfoMap.containsKey(userId))
					continue;

				UserInfo userInfo = usersInfoMap.get(userId);
				String domainName = NotificationTemplateUtil.getDomainForUser(userInfo.getOrgs(), orgDomainMap);

				Map<String, Object> resp = this.getTenantConfiguredModesForUser(eventId, tenantNotificationConfigMaps,
						recipientRole, userInfo);
				// getting all the notification modes for this user for given recipient role
				List<Map<String, Object>> userNotificationModes = (List<Map<String, Object>>) resp
						.get("configuredModes");

				isEventRecieverConfigured = (boolean) resp.get("isEventRecieverConfigured");
				String[] receiverEmails = (String[]) resp.get("receiverEmails");
				for (Map<String, Object> userNotificationMode : userNotificationModes) {

					if (userNotificationMode.get("mode").equals("email")) {
						orgToTemplateIdMapForEmail.put(userNotificationMode.get("org").toString(),
								(String) userNotificationMode.get("template_id"));
						emailToBeSentAnyUser = true;
						if(!emailRecipientUserIds.contains(userId))
							emailRecipientUserIds.add(userId);
						//this is for  receiver email configured events as for every user
						// the receiver emails configured may be different based on their org
						if (isEventRecieverConfigured)
							userIdRecieverEmailMap.put(userId, receiverEmails);
						// for preset receiver list event
						if (userNotificationMode.get("template_id") != null)
							templateIdToOrgMap.put(userNotificationMode.get("template_id").toString(),
									userNotificationMode.get("org").toString());

					} else if (userNotificationMode.get("mode").equals("inApp")) {
						inAppRequests.add(this.createInAppRequest(notificationEvent, userId, recipientRole,
								usersInfoMap, userNotificationMode, targetDataMapping, domainName));
					} else if (userNotificationMode.get("mode").equals("push")) {
						try {
							producerService.enqueuePushEvent(this.createPushRequest(notificationEvent, userId,
									recipientRole, usersInfoMap, userNotificationMode, targetDataMapping, domainName));
						} catch (Exception e) {
							logger.error("Could not send push notification event to kafka");
							consumerUtilServ.saveError(rootOrg, eventId, e, new HashMap<>());
						}
					} else if (userNotificationMode.get("mode").equals("sms")) {
						this.createSmsRequest(notificationEvent, userId, recipientRole, usersInfoMap,
								userNotificationMode, targetDataMapping, domainName);
					}
				}
			}
			if (isEventRecieverConfigured && emailToBeSentAnyUser) {
				emailProcessingServ.enqueueEmailNotfificationForRecieverConfigedEvent(rootOrg, eventId, recipientRole,
						emailRecipientUserIds, recipients, usersInfoMap, notificationEvent.getTagValues(),
						templateIdToOrgMap, orgDomainMap, targetDataMapping, userIdRecieverEmailMap, orgAppEmailMap);
			} else if (emailToBeSentAnyUser) {
				// sending email to all the users in given recipient role
				emailProcessingServ.enqueueEmailNotification(rootOrg, eventId, recipientRole,
						emailRecipientUserIds, recipients, usersInfoMap, notificationEvent.getTagValues(),
						templateIdToOrgMap, orgDomainMap, targetDataMapping,  orgAppEmailMap);
			}
		}

		if (!inAppRequests.isEmpty())
			userNotificationService.sendInAppNotifications(notificationEvent, inAppRequests);
	}

	
	
	
	
	
	
	
	private Map<String, String> getTargetData(NotificationEvent notificationEvent) {

		Map<String, String> targetDataMapping = null;

		if (notificationEvent.getTagValues() != null && !notificationEvent.getTagValues().containsKey("#targetUrl")) {

			targetDataMapping = new HashMap<>();
			List<Map<String, Object>> targetData = recipientTagsRepo.getTargetUrls(notificationEvent.getEventId(),
					new ArrayList<>(notificationEvent.getRecipients().keySet()));

			for (Map<String, Object> targetDataMap : targetData) {
				if (targetDataMap.containsKey("recipient") && targetDataMap.get("recipient") != null
						&& targetDataMap.containsKey("target_url") && targetDataMap.get("target_url") != null) {

					targetDataMapping.put(targetDataMap.get("recipient").toString(),
							targetDataMap.get("target_url").toString());
				}
			}
		}

		return targetDataMapping;
	}

	
	
	
	
	private Map<String, Object> createSmsRequest(NotificationEvent notificationEvent, String userId,
			String recipientRole, Map<String, UserInfo> usersInfoMap, Map<String, Object> inAppConfig,
			Map<String, String> targetDataMapping, String domainName) {

		Map<String, Object> smsTemplate = fetchTemplate((String) inAppConfig.get("template_id"),
				usersInfoMap.get(userId).getPreferedLanguages(), notificationEvent.getEventId(), recipientRole, "sms");

		smsTemplate = ProjectCommonUtil.convertToHashMap(smsTemplate);
		ProjectCommonUtil.templateValidations(notificationEvent.getRootOrg(), notificationEvent.getEventId(),
				recipientRole, smsTemplate);

		smsTemplate.put("template_subject",
				NotificationTemplateUtil.replaceTags(notificationEvent.getRootOrg(), notificationEvent.getTagValues(),
						smsTemplate.get("template_subject").toString(), usersInfoMap, notificationEvent.getRecipients(),
						recipientRole, targetDataMapping, domainName, null));

		smsTemplate.put("template_text",
				NotificationTemplateUtil.replaceTags(notificationEvent.getRootOrg(), notificationEvent.getTagValues(),
						smsTemplate.get("template_text").toString(), usersInfoMap, notificationEvent.getRecipients(),
						recipientRole, targetDataMapping, domainName, null));

		Map<String, Object> responseMap = new HashMap<>();
		responseMap.put("user_id", userId);
		responseMap.put("template_text", smsTemplate.get("template_text"));
		responseMap.put("template_subject", smsTemplate.get("template_subject"));

		return responseMap;
	}

	
	
	
	private InAppNotificationRequest createInAppRequest(NotificationEvent notificationEvent, String userId,
			String recipientRole, Map<String, UserInfo> usersInfoMap, Map<String, Object> inAppConfig,
			Map<String, String> targetDataMapping, String domainName) {

		Map<String, Object> inAppTemplate = fetchTemplate((String) inAppConfig.get("template_id"),
				usersInfoMap.get(userId).getPreferedLanguages(), notificationEvent.getEventId(), recipientRole,
				"inApp");

		inAppTemplate = ProjectCommonUtil.convertToHashMap(inAppTemplate);
		ProjectCommonUtil.templateValidations(notificationEvent.getRootOrg(), notificationEvent.getEventId(),
				recipientRole, inAppTemplate);

		inAppTemplate.put("template_subject",
				NotificationTemplateUtil.replaceTags(notificationEvent.getRootOrg(), notificationEvent.getTagValues(),
						inAppTemplate.get("template_subject").toString(), usersInfoMap,
						notificationEvent.getRecipients(), recipientRole, targetDataMapping, domainName, null));

		inAppTemplate.put("template_text",
				NotificationTemplateUtil.replaceTags(notificationEvent.getRootOrg(), notificationEvent.getTagValues(),
						inAppTemplate.get("template_text").toString(), usersInfoMap, notificationEvent.getRecipients(),
						recipientRole, targetDataMapping, domainName, null));

		InAppNotificationRequest inAppRequest = new InAppNotificationRequest(userId,
				inAppTemplate.get("template_subject").toString(), inAppTemplate.get("template_text").toString(),
				notificationEvent.getEventId(), recipientRole);

		return inAppRequest;
	}

	
	
	private PushNotificationRequest createPushRequest(NotificationEvent notificationEvent, String userId,
			String recipientRole, Map<String, UserInfo> usersInfoMap, Map<String, Object> inAppConfig,
			Map<String, String> targetDataMapping, String domainName) {

		Map<String, Object> pushTemplate = fetchTemplate((String) inAppConfig.get("template_id"),
				usersInfoMap.get(userId).getPreferedLanguages(), notificationEvent.getEventId(), recipientRole, "push");

		pushTemplate = ProjectCommonUtil.convertToHashMap(pushTemplate);

		ProjectCommonUtil.templateValidations(notificationEvent.getRootOrg(), notificationEvent.getEventId(),
				recipientRole, pushTemplate);

		String subject = NotificationTemplateUtil.replaceTags(notificationEvent.getRootOrg(), notificationEvent.getTagValues(),
				pushTemplate.get("template_subject").toString(), usersInfoMap, notificationEvent.getRecipients(),
				recipientRole, targetDataMapping, domainName, null);

		String body = NotificationTemplateUtil.replaceTags(notificationEvent.getRootOrg(), notificationEvent.getTagValues(),
				pushTemplate.get("template_text").toString(), usersInfoMap, notificationEvent.getRecipients(),
				recipientRole, targetDataMapping, domainName, null);

		PushNotificationRequest pushRequest = new PushNotificationRequest(notificationEvent.getRootOrg(),
				notificationEvent.getEventId(), userId, subject, body);

		return pushRequest;

	}

	private Map<String, Object> fetchTemplate(String templateId, List<String> preferedLanguages, String eventId,
			String recipientRole, String mode) {

		List<Map<String, Object>> templatesFetched = tenantTemplateService.fetchTemplates(templateId, eventId,
				recipientRole, mode, preferedLanguages);

		for (String preferedLanguage : preferedLanguages) {
			for (Map<String, Object> templateFetched : templatesFetched) {
				if (preferedLanguage.equals(templateFetched.get("language")))
					return templateFetched;
			}
		}

		if (templatesFetched == null || templatesFetched.isEmpty())
			throw new ApplicationLogicException("could not fetch any templates for the given event and recipient role");

		return templatesFetched.get(0);
	}

	

	

	
	@SuppressWarnings("unchecked")
	private Map<String, Object> getTenantConfiguredModesForUser(String eventId,
			List<Map<String, Object>> tenantNotificationConfigMaps, String recipientRole, UserInfo userInfo) {
		Map<String, Object> resp = new HashMap<>();
		List<String> userOrgs = userInfo.getOrgs();
		String[] receiverEmails = null;
		List<Map<String, Object>> tenantConfiguredModesForUser = new ArrayList<>();
		// this flag is used when receiver_email is configured for the event by rootOrg
		// and org
		// in which case the mail is sent from the user to the receiver email list
		boolean isEventRecieverConfigured = false;
		// if any mode is enabled by tenant then inApp is also sent
		boolean isAnyModeEnabledByTenant = false;
		for (Map<String, Object> tenantNotificationConfigMap : tenantNotificationConfigMaps) {
			String tenantMode = (String) tenantNotificationConfigMap.get("mode");
			// tenantMode
			if (userOrgs.contains(tenantNotificationConfigMap.get("org"))
					&& tenantNotificationConfigMap.get("recipient").equals(recipientRole)) {
				isAnyModeEnabledByTenant = true;
				boolean isModeEnabled = false;
				Map<String, Object> userRecieveConfig = userInfo.getRecieveConfig();

				if (!userRecieveConfig.containsKey(recipientRole)) {
					isModeEnabled = true;
				} else {
					Map<String, Object> userRecieveConfigPerRole = (Map<String, Object>) userRecieveConfig
							.get(recipientRole);
					if (!userRecieveConfigPerRole.containsKey(tenantMode)) {
						isModeEnabled = true;
					} else {
						boolean isModeEnabledByUser = (boolean) userRecieveConfigPerRole.get(tenantMode);
						if (isModeEnabledByUser) {
							isModeEnabled = true;
						}
					}
				}

				if (isModeEnabled) {
					tenantConfiguredModesForUser.add(tenantNotificationConfigMap);
					if (tenantMode.equals("email") && tenantNotificationConfigMap.containsKey("receiver_emails")
							&& tenantNotificationConfigMap.get("receiver_emails") != null) {
						isEventRecieverConfigured = true;
						receiverEmails = tenantNotificationConfigMap.get("receiver_emails").toString().split(",");
					}
				}
			}
		}

		if (isAnyModeEnabledByTenant && !isEventRecieverConfigured) {
			Map<String, Object> inAppModeConfig = new HashMap<>();
			inAppModeConfig.put("event_id", eventId);
			inAppModeConfig.put("recipient", recipientRole);
			inAppModeConfig.put("mode", "inApp");
			inAppModeConfig.put("mode_activated", true);
			inAppModeConfig.put("template_id", null);
			tenantConfiguredModesForUser.add(inAppModeConfig);
		}

		ProjectCommonUtil.retainUniqueNonEmailEvents(tenantConfiguredModesForUser);
		resp.put("configuredModes", ProjectCommonUtil.convertToHashMap(tenantConfiguredModesForUser));
		resp.put("isEventRecieverConfigured", isEventRecieverConfigured);
		resp.put("receiverEmails", receiverEmails);
		return resp;
	}

	

	

	
	
}
