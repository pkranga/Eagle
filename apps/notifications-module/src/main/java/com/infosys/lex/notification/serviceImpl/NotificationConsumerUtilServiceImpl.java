/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at 
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NotificationConsumerUtilServiceImpl implements NotificationConsumerUtilService{
	
	@Autowired
	NotificationErrorsRepo notificationErrorsRepo;
	
	
	@Autowired
	TenantTemplateFooterRepository templateFooterRepo;
	
	
	@Autowired
	ApplicationServerProperties appServerProps;
	
	@Autowired
	RestTemplate restTemplate;
	
	private LexNotificationLogger logger = new LexNotificationLogger(getClass().getName());

	private static final ObjectMapper mapper = new ObjectMapper();
	
	@Override
	public void saveError(String rootOrg, String eventId, Exception e, Object requestBody) {

		try {
			notificationErrorsRepo.save(new NotificationErrors(new NotificationErrorsPrimaryKey(rootOrg, eventId),
					e.getMessage(), mapper.writeValueAsString(requestBody), e.getStackTrace().toString()));
		} catch (Exception e1) {
			logger.error("could not save error event for rootOrg" + rootOrg + " and eventId " + eventId + "req body "
					+ requestBody.toString());
		}
	}

	@Override
	public Map<String, String> getOrgDomainMap(String rootOrg) {
		Map<String, String> orgDomainMap = new HashMap<>();
		HttpHeaders headers = new HttpHeaders();
		String domainName;
		String org;

		String url = "http://" + appServerProps.getPidServiceUrl() + "/org/" + rootOrg;

		List<Map<String, Object>> responseMap;
		try {
			ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET,
					new HttpEntity<Object>(headers), String.class);

			responseMap = new ObjectMapper().readValue(responseEntity.getBody(),
					new TypeReference<List<Map<String, Object>>>() {
					});

			if (responseMap.isEmpty())
				throw new ApplicationLogicException("No domain found for the given rootOrg");

			for (Map<String, Object> map : responseMap) {
				org = map.get("org").toString();
				domainName = map.get("domain_name").toString();
				if (!domainName.contains("https://"))
					domainName = "https://" + domainName;
				orgDomainMap.put(org, domainName);

			}
		} catch (HttpStatusCodeException ex) {
			throw new ApplicationLogicException("Pid domain service error : " + ex.getResponseBodyAsString());
		} catch (IOException e) {
			throw new ApplicationLogicException("Error fetching domain for rootOrg,org. Err : " + e.getMessage());
		}
		return orgDomainMap;
	}

	@Override
	public Map<String, String> getOrgFooterEmailMap(String rootOrg, List<String> orgs) {

		List<TemplateFooter> templateFooterEmails = templateFooterRepo.getFooterEmailsForGivenOrgs(rootOrg, orgs);

		Map<String, String> returnMap = new HashMap<>();
		for (TemplateFooter footer : templateFooterEmails) {
			returnMap.put(footer.getPrimaryKey().getOrg(), footer.getAppEmail());
		}
		return returnMap;
	}
}
