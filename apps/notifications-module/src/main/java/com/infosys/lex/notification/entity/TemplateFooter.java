/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "tenant_template_footer", schema = "wingspan")
public class TemplateFooter {

	public TemplateFooterPrimaryKey getPrimaryKey() {
		return primaryKey;
	}

	public void setPrimaryKey(TemplateFooterPrimaryKey primaryKey) {
		this.primaryKey = primaryKey;
	}

	public String getTemplateId() {
		return templateId;
	}

	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}

	public String getAppEmail() {
		return appEmail;
	}

	public void setAppEmail(String appEmail) {
		this.appEmail = appEmail;
	}

	@EmbeddedId
	private TemplateFooterPrimaryKey primaryKey;

	@Column(name = "template_id")
	private String templateId;

	@Override
	public String toString() {
		return "TemplateFooter [primaryKey=" + primaryKey + ", templateId=" + templateId + ", appEmail=" + appEmail
				+ "]";
	}

	public TemplateFooter(TemplateFooterPrimaryKey primaryKey, String templateId, String appEmail) {
		super();
		this.primaryKey = primaryKey;
		this.templateId = templateId;
		this.appEmail = appEmail;
	}

	public TemplateFooter() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Column(name = "app_email")
	private String appEmail;

}
