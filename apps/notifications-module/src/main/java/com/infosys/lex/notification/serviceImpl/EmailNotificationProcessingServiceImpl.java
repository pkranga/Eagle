/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class EmailNotificationProcessingServiceImpl implements EmailNotificationProcessingService {

	@Autowired
	NotificationConsumerUtilService consumerUtilServ;
	
	@Autowired
	ProducerService producerServ;
	
	@Autowired
	TenantTemplateService tenantTemplateService;
	
	private LexNotificationLogger logger = new LexNotificationLogger(getClass().getName());

	
	
	/**
	 * this is used to send the notification incase the recever emails is configured
	 * in which case the mail will be sent from the recipients to pre-configured
	 * list of email ids(tenant configured)
	 * 
	 * @param rootOrg
	 * @param eventId
	 * @param recipientRole
	 * @param emailRecipientUserIds
	 * @param recipients(this        param is used for template creation)
	 * @param usersInfoMap
	 * @param tagValues
	 * @param orgToTemplateIdMap
	 * @param orgDomainMap
	 * @param targetDAtaMapping
	 * @param userIdReceiverEmailMap
	 */
	@Override
	@SuppressWarnings("unchecked")
	public void enqueueEmailNotfificationForRecieverConfigedEvent(String rootOrg, String eventId, String recipientRole,
			List<String> emailRecipientUserIds, Map<String, List<String>> recipients,
			Map<String, UserInfo> usersInfoMap, Map<String, Object> tagValuePairs,
			Map<String, String> templateIdToOrgMap, Map<String, String> orgDomainMap,
			Map<String, String> targetDataMapping, Map<String, String[]> userIdReceiverEmailMap,
			Map<String, String> orgAppEmailMap) {
		Map<String, String> userIdEmailMap = ProjectCommonUtil.getUserIdEmailMap(emailRecipientUserIds, usersInfoMap);
		List<String> emailIds = new ArrayList<>(userIdEmailMap.values());

		List<String> userOrgs;
		String userDomainName;
		String appEmail;
		List<String> userPreferredLanguages;
		Set<String> templateIds = templateIdToOrgMap.keySet();

		Map<String, Object> languageOrgMap = this.getLanguageOrgsMapForTemplates(templateIdToOrgMap, templateIds,
				eventId, recipientRole, "email");
		UserInfo userInfo;
		Map<String, Map<String, Object>> userIdTemplateMap = new HashMap<>();

		// org of the template for which user email is sent
		String selectedOrg = null;
		// template for user
		Map<String, Object> selectedTemplate = null;

		for (String userId : emailRecipientUserIds) {
			if (!usersInfoMap.containsKey(userId)) {
				consumerUtilServ.saveError(rootOrg, eventId,
						new InvalidDataInputException("User data not found For userId : " + userId, null), "");
				continue;
			}
			userInfo = usersInfoMap.get(userId);
			userPreferredLanguages = userInfo.getPreferedLanguages();
			userOrgs = userInfo.getOrgs();

			// check if template exist which matches user language preference and org
			// TODO String selectedLang="";
			// TODO String selectOrg="";
			// TODO add rootOrg also
			for (String preferredLanguage : userPreferredLanguages) {
				if (languageOrgMap.containsKey(preferredLanguage.toLowerCase())) {
					Map<String, Map<String, Object>> orgTemplateDetailMap = (Map<String, Map<String, Object>>) languageOrgMap
							.get(preferredLanguage.toLowerCase());
					selectedOrg = userOrgs.stream().filter(userOrg -> orgTemplateDetailMap.containsKey(userOrg))
							.findFirst().orElse(null);
					if (selectedOrg != null) {
						selectedTemplate = orgTemplateDetailMap.get(selectedOrg);
						break;

					}
				}
			}

			// if no template found then select the default template
			if (selectedOrg == null) {
				for (String preferredlanguage : userPreferredLanguages) {
					if (languageOrgMap.containsKey("DEFAULT_" + preferredlanguage.toLowerCase())) {
						Map<String, Map<String, Object>> orgTemplateDetailMap = (Map<String, Map<String, Object>>) languageOrgMap
								.get("DEFAULT_" + preferredlanguage.toLowerCase());
						selectedTemplate = orgTemplateDetailMap.get("default");
						break;
					}
				}
			}
			if (selectedTemplate != null)
				userIdTemplateMap.put(userId, selectedTemplate);
			else
				consumerUtilServ.saveError(rootOrg, eventId, new Exception("Template not found for userId : " + userId), "");

		}
		for (String userId : userIdTemplateMap.keySet()) {
			try {
				if (!userIdReceiverEmailMap.containsKey(userId) || userIdReceiverEmailMap.get(userId) == null
						|| userIdReceiverEmailMap.get(userId).length == 0) {
					throw new ApplicationLogicException(
							"No reciever Email found for User id :" + userId + " and Event : " + eventId);
				}

				if (!userIdEmailMap.containsKey(userId))
					throw new InvalidDataInputException("No userDetail found for userId :" + userId, null);

				List<String> receiverEmails = Arrays.asList(userIdReceiverEmailMap.get(userId));
				Map<String, Object> emailTemplate = userIdTemplateMap.get(userId);
				emailTemplate = ProjectCommonUtil.convertToHashMap(emailTemplate);
				ProjectCommonUtil.templateValidations(rootOrg, eventId, recipientRole, emailTemplate);
				userDomainName = NotificationTemplateUtil.getDomainForUser(usersInfoMap.get(userId).getOrgs(), orgDomainMap);
				appEmail = !orgAppEmailMap.isEmpty()
						? NotificationTemplateUtil.getAppEmailForUser(usersInfoMap.get(userId).getOrgs(), orgAppEmailMap)
						: null;
				emailTemplate.put("template_subject",
						NotificationTemplateUtil.replaceTags(rootOrg, tagValuePairs, emailTemplate.get("template_subject").toString(),
								usersInfoMap, recipients, recipientRole, targetDataMapping, userDomainName, appEmail));

				emailTemplate.put("template_text",
						NotificationTemplateUtil.replaceTags(rootOrg, tagValuePairs, emailTemplate.get("template_text").toString(), usersInfoMap,
								recipients, recipientRole, targetDataMapping, userDomainName, appEmail));

				producerServ.enqueueEmailEvent(new EmailRequest(rootOrg, userIdEmailMap.get(userId),
						emailTemplate.get("template_text").toString(), emailTemplate.get("template_subject").toString(),
						eventId, receiverEmails, new ArrayList<>(), new ArrayList<>(), true));
			} catch (Exception e) {
				// not throwing exception as it would stop other notifications getting sent
				consumerUtilServ.saveError(rootOrg, eventId, e, new HashMap<>());
				logger.error("Could not send email " + userId.toString() + " for rootOrg " + rootOrg + " emails "
						+ emailIds.toString());
			}
		}
	}

	
	
	
	
	
	
	
	
	
	/**
	 * 
	 * This method divides user by their org and language preference and enqueues
	 * into email_notification kafka topic
	 */
	@Override
	@SuppressWarnings("unchecked")
	public void enqueueEmailNotification(String rootOrg, String eventId, String recipientRole,
			List<String> emailRecipientUserIds, Map<String, List<String>> recipients,
			Map<String, UserInfo> usersInfoMap, Map<String, Object> tagValuePairs,
			Map<String, String> templateIdToOrgMap, Map<String, String> orgDomainMap,
			Map<String, String> targetDataMapping,
			Map<String, String> orgAppEmailMap) {


		List<String> userOrgs;
		String domainName;
		String appEmail;
		List<String> userPreferredLanguages;
		Set<String> templateIds = templateIdToOrgMap.keySet();

		//this map will be used to store the final list segregated user based on thier org 
		//and language preference
		Map<String ,Object> languageOrgUserBucket = new HashMap<>();
		
		
		//language map has language as key and value as map of the org and templateid
		Map<String, Object> languageOrgTemplateMap = this.getLanguageOrgsMapForTemplates(templateIdToOrgMap, templateIds,
				eventId, recipientRole, "email");
		UserInfo userInfo;
		
		//This map will be used for langaugeorguserbucket map
		Map<String,List<String>> orgUserIdsMap ;
		
		
		// org of the template for which user email is sent
		String selectedOrg = null;
		String selectedLang = null;


		for (String userId : emailRecipientUserIds) {
			if (!usersInfoMap.containsKey(userId)) {
				consumerUtilServ.saveError(rootOrg, eventId,
						new InvalidDataInputException("User data not found For userId : " + userId, null), "");
				continue;
			}
			userInfo = usersInfoMap.get(userId);
			userPreferredLanguages = userInfo.getPreferedLanguages();
			userOrgs = userInfo.getOrgs();

			// check if template exist which matches user language preference and org
			// TODO String selectedLang="";
			// TODO String selectOrg="";
			// TODO add rootOrg also
			for (String preferredLanguage : userPreferredLanguages) {
				if (languageOrgTemplateMap.containsKey(preferredLanguage.toLowerCase())) {
					Map<String, Map<String, Object>> orgTemplateDetailMap = (Map<String, Map<String, Object>>) languageOrgTemplateMap
							.get(preferredLanguage.toLowerCase());
					selectedOrg = userOrgs.stream().filter(userOrg -> orgTemplateDetailMap.containsKey(userOrg))
							.findFirst().orElse(null);
					if (selectedOrg != null) {
						selectedLang = preferredLanguage;
						break;

					}
				}
			}

			// if no template found then select the default template
			if (selectedOrg == null) {
				for (String preferredlanguage : userPreferredLanguages) {
					if (languageOrgTemplateMap.containsKey("DEFAULT_" + preferredlanguage.toLowerCase())) {
						selectedOrg = "default";
						selectedLang = "DEFAULT_"+ preferredlanguage;
						break;
					}
				}
			}
			
			if (selectedOrg != null)
			{
				if(languageOrgUserBucket.containsKey(selectedLang))
				{
					orgUserIdsMap = (Map<String,List<String>>)languageOrgUserBucket.get(selectedLang);
					if(orgUserIdsMap.containsKey(selectedOrg)) {
						orgUserIdsMap.get(selectedOrg).add(userId);
					}
					else {
						orgUserIdsMap.put(selectedOrg, new ArrayList<String>(Arrays.asList(userId)));						
					}
				}
				else {
					orgUserIdsMap = new HashMap<String,List<String>>();
					orgUserIdsMap.put(selectedOrg,new ArrayList<String>(Arrays.asList(userId)) );
					languageOrgUserBucket.put(selectedLang, orgUserIdsMap);
				}
			}
			else
				consumerUtilServ.saveError(rootOrg, eventId, new Exception("Template not found for userId : " + userId), "");

		}
		
		//this iterates through the selected lang and the org and fetches the list 
		//of userids and send mail to this set of ids
		for (String langKey: languageOrgUserBucket.keySet())
		{
			orgUserIdsMap = (Map<String,List<String>>)languageOrgUserBucket.get(langKey);
			Map<String, Map<String, Object>> orgTemplateDetailMap = (Map<String,Map<String,Object>>)languageOrgTemplateMap.get(langKey);
			for (String orgKey : orgUserIdsMap.keySet() )
			{
				Map<String, String> userIdEmailMap = ProjectCommonUtil.getUserIdEmailMap(orgUserIdsMap.get(orgKey), usersInfoMap);
				List<String> emailIds = new ArrayList<>(userIdEmailMap.values());
				try {		
					Map<String, Object> emailTemplate = orgTemplateDetailMap.get(orgKey);
					emailTemplate = ProjectCommonUtil.convertToHashMap(emailTemplate);
					ProjectCommonUtil.templateValidations(rootOrg, eventId, recipientRole, emailTemplate);
					domainName = NotificationTemplateUtil.getDomainForUser(Arrays.asList(orgKey), orgDomainMap);
					appEmail = !orgAppEmailMap.isEmpty()
							? NotificationTemplateUtil.getAppEmailForUser(Arrays.asList(orgKey), orgAppEmailMap)
							: null;
					emailTemplate.put("template_subject",
							NotificationTemplateUtil.replaceTags(rootOrg, tagValuePairs, emailTemplate.get("template_subject").toString(),
									usersInfoMap, recipients, recipientRole, targetDataMapping, domainName, appEmail));

					emailTemplate.put("template_text",
							NotificationTemplateUtil.replaceTags(rootOrg, tagValuePairs, emailTemplate.get("template_text").toString(), usersInfoMap,
									recipients, recipientRole, targetDataMapping, domainName, appEmail));

					producerServ.enqueueEmailEvent(new EmailRequest(rootOrg, "",
							emailTemplate.get("template_text").toString(), emailTemplate.get("template_subject").toString(),
							eventId, emailIds, new ArrayList<>(), new ArrayList<>(), true));
				} catch (Exception e) {
					// not throwing exception as it would stop other notifications getting sent
					consumerUtilServ.saveError(rootOrg, eventId, e, new HashMap<>());
					logger.error("Could not send email  for rootOrg " + rootOrg + " emails "
							+ emailIds.toString());
				}
			}
		}
		
		
	}
	
	
	/*
	 * This method returns a map where the keys are languages which is mapped to
	 * another map where the key is org and the value is the template detail In case
	 * of default org the langauge key will in the format of DEFAULT_{langcode} for
	 * the main map
	 */
	@SuppressWarnings("unchecked")
	private Map<String, Object> getLanguageOrgsMapForTemplates(Map<String, String> templateIdToOrgMap,
			Set<String> templateIds, String eventId, String recipientRole, String mode) {

		//fetch all the templates for template id
		List<Map<String, Object>> templates = tenantTemplateService.fetchAllTemplatesByTemplateIds(templateIds, eventId,
				recipientRole, mode);
		Map<String, Object> resp = new HashMap<String, Object>();

		String templateId;
		String templateLang;
		String org;
		Map<String, Map<String, Object>> orgTemplateDetailMap;

		// process the templates(create the map)
		for (Map<String, Object> templateMap : templates) {
			templateId = templateMap.get("template_id").toString();
			templateLang = templateMap.get("language").toString().toLowerCase();
			// templates configured by default rootorg
			if (templateId.equals("default")) {
				templateLang = "DEFAULT_" + templateLang;
				orgTemplateDetailMap = new HashMap<>();
				orgTemplateDetailMap.put("default", templateMap);

			} else {
				org = templateIdToOrgMap.get(templateId);
				if (resp.containsKey(templateLang))
					orgTemplateDetailMap = (Map<String, Map<String, Object>>) resp.get(templateLang);
				else
					orgTemplateDetailMap = new HashMap<>();

				orgTemplateDetailMap.put(org, templateMap);
			}
			resp.put(templateLang, orgTemplateDetailMap);
		}
		return resp;
	}
	
	
}
