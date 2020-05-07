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

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DatabaseProperties {

	@Value("${spring.data.cassandra.bodhi.contact-points}")
	private String bodhiContactPoint;

	@Value("${spring.data.cassandra.bodhi.port}")
	private String bodhiContactPort;

	@Value("${spring.data.cassandra.bodhi.keyspace-name}")
	private String bodhiKeyspace;

	@Value("${spring.data.cassandra.sunbird.contact-points}")
	private String sunbirdContactPoint;

	@Value("${spring.data.cassandra.sunbird.port}")
	private String sunbirdContactPort;

	@Value("${spring.data.cassandra.sunbird.keyspace-name}")
	private String sunbirdKeyspace;

	@Value("${spring.data.cassandra.username}")
	private String cassandraUserName;

	@Value("${spring.data.cassandra.password}")
	private String cassandraPassword;

	@Value("${spring.datasource.url}")
	private String springDatasourceUrl;

	@Value("${spring.datasource.username}")
	private String springDatasourceUsername;

	@Value("${spring.datasource.password}")
	private String springDatasourcePassword;

	public String getCassandraUserName() {
		return cassandraUserName;
	}

	public void setCassandraUserName(String cassandraUserName) {
		this.cassandraUserName = cassandraUserName;
	}

	public String getCassandraPassword() {
		return cassandraPassword;
	}

	public void setCassandraPassword(String cassandraPassword) {
		this.cassandraPassword = cassandraPassword;
	}

	public String getBodhiContactPoint() {
		return bodhiContactPoint;
	}

	public void setBodhiContactPoint(String bodhiContactPoint) {
		this.bodhiContactPoint = bodhiContactPoint;
	}

	public String getBodhiContactPort() {
		return bodhiContactPort;
	}

	public void setBodhiContactPort(String bodhiContactPort) {
		this.bodhiContactPort = bodhiContactPort;
	}

	public String getBodhiKeyspace() {
		return bodhiKeyspace;
	}

	public void setBodhiKeyspace(String bodhiKeyspace) {
		this.bodhiKeyspace = bodhiKeyspace;
	}

	public String getSunbirdContactPoint() {
		return sunbirdContactPoint;
	}

	public void setSunbirdContactPoint(String sunbirdContactPoint) {
		this.sunbirdContactPoint = sunbirdContactPoint;
	}

	public String getSunbirdContactPort() {
		return sunbirdContactPort;
	}

	public void setSunbirdContactPort(String sunbirdContactPort) {
		this.sunbirdContactPort = sunbirdContactPort;
	}

	public String getSunbirdKeyspace() {
		return sunbirdKeyspace;
	}

	public void setSunbirdKeyspace(String sunbirdKeyspace) {
		this.sunbirdKeyspace = sunbirdKeyspace;
	}

	public String getSpringDatasourceUrl() {
		return springDatasourceUrl;
	}

	public void setSpringDatasourceUrl(String springDatasourceUrl) {
		this.springDatasourceUrl = springDatasourceUrl;
	}

	public String getSpringDatasourceUsername() {
		return springDatasourceUsername;
	}

	public void setSpringDatasourceUsername(String springDatasourceUsername) {
		this.springDatasourceUsername = springDatasourceUsername;
	}

	public String getSpringDatasourcePassword() {
		return springDatasourcePassword;
	}

	public void setSpringDatasourcePassword(String springDatasourcePassword) {
		this.springDatasourcePassword = springDatasourcePassword;
	}

	@Override
	public String toString() {
		return "DatabaseProperties [bodhiContactPoint=" + bodhiContactPoint + ", bodhiContactPort=" + bodhiContactPort
				+ ", bodhiKeyspace=" + bodhiKeyspace + ", sunbirdContactPoint=" + sunbirdContactPoint
				+ ", sunbirdContactPort=" + sunbirdContactPort + ", sunbirdKeyspace=" + sunbirdKeyspace
				+ ", cassandraUserName=" + cassandraUserName + ", cassandraPassword=" + cassandraPassword
				+ ", springDatasourceUrl=" + springDatasourceUrl + ", springDatasourceUsername="
				+ springDatasourceUsername + ", springDatasourcePassword=" + springDatasourcePassword + "]";
	}
}
