/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "smtp_config", schema = "wingspan")
public class SMTPConfig {

	@Id
	@Column(name = "root_org")
	private String rootOrg;

	@Column(name = "user_name")
	private String userName;

	@Column(name = "password")
	private String password;

	@Column(name = "host")
	private String host;

	@Column(name = "sign_email")
	private boolean signEmail;

	@Column(name = "port")
	private String port;

	@Column(name = "sender_id")
	private String senderId;

	@Column(name = "last_updated_on")
	private Timestamp lastUpdateOn;

	@Column(name = "last_updated_by")
	private String lastUpdateBy;
	
	@Column(name = "chunk_size")
	private Integer chunkSize;
	
	

	public Integer getChunkSize() {
		return chunkSize;
	}

	public void setChunkSize(Integer chunkSize) {
		this.chunkSize = chunkSize;
	}

	public boolean isSignEmail() {
		return signEmail;
	}

	public SMTPConfig() {

	}

	

	public SMTPConfig(String rootOrg, String userName, String password, String host, boolean signEmail, String port,
			String senderId, Timestamp lastUpdateOn, String lastUpdateBy, Integer chunkSize) {
		this.rootOrg = rootOrg;
		this.userName = userName;
		this.password = password;
		this.host = host;
		this.signEmail = signEmail;
		this.port = port;
		this.senderId = senderId;
		this.lastUpdateOn = lastUpdateOn;
		this.lastUpdateBy = lastUpdateBy;
		this.chunkSize = chunkSize;
	}

	public SMTPConfig(String rootOrg2, String userName2, Object object, String host2, String port2, String senderId2,
			Timestamp timestamp, String string) {
		// TODO Auto-generated constructor stub
	}

	public String getRootOrg() {
		return rootOrg;
	}

	public void setRootOrg(String rootOrg) {
		this.rootOrg = rootOrg;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public boolean signEmail() {
		return signEmail;
	}

	public void setSignEmail(boolean signEmail) {
		this.signEmail = signEmail;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public Timestamp getLastUpdateOn() {
		return lastUpdateOn;
	}

	public void setLastUpdateOn(Timestamp lastUpdateOn) {
		this.lastUpdateOn = lastUpdateOn;
	}

	public String getLastUpdateBy() {
		return lastUpdateBy;
	}

	public void setLastUpdateBy(String lastUpdateBy) {
		this.lastUpdateBy = lastUpdateBy;
	}

	public String getSenderId() {
		return senderId;
	}

	public void setSenderId(String senderId) {
		this.senderId = senderId;
	}
}
