/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v1/templates")
public class TenantTemplateController {

	@Autowired
	TenantTemplateService tenantTemplateService;

	/**
	 * This API is called when the tenant admin reaches on the 4th step of
	 * notification configuration to the display the configures/default templates to
	 * the admin.
	 * 
	 * @param eventIds
	 * @param rootOrg
	 * @param org
	 * @return
	 */
	@GetMapping
	public ResponseEntity<List<Map<String, Object>>> getTemplates(@RequestParam(name = "eventId") String eventId,
			@RequestParam(name = "modeId") String modeId,
			@RequestHeader(required = false, name = "langCode") String language,
			@RequestHeader("rootOrg") String rootOrg, @RequestHeader("org") String org) {

		return new ResponseEntity<>(tenantTemplateService.fetchTenantTemplates(rootOrg, org, eventId, modeId, language),
				HttpStatus.OK);
	}

	/**
	 * This API is called on the 4th step to configure the templates during
	 * notification configuration.
	 * 
	 * @param template
	 * @param language
	 * @param rootOrg
	 * @param org
	 * @param userUUID
	 * @return
	 * @throws Exception
	 */
	@PutMapping
	public ResponseEntity<?> configureTemplates(@Valid @RequestBody EventTemplateDTO template,
			@RequestHeader(required = false, name = "langCode") String language,
			@RequestHeader("rootOrg") String rootOrg, @RequestHeader("org") String org,
			@RequestParam("user_id") String userId) throws Exception {

		tenantTemplateService.configureTemplates(rootOrg, org, template, language, userId);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
