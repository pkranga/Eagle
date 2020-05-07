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
public class ApplicationServerProperties {

	@Value("${pid.service.url}")
	private String pidServiceUrl;

	@Value("${}")
	private String siemensDomain;
	
	@Value("${Infosys.domain}")
	private String infosysDomain;

	public String getInfosysDomain() {
		return infosysDomain;
	}

	public void setInfosysDomain(String infosysDomain) {
		this.infosysDomain = infosysDomain;
	}

	public void setDomain(String siemensDomain) {
		this.siemensDomain = siemensDomain;
	}

	@Value("${kafka.bootstrapAddress}")
	private String kafkabootstrapAddress;

	@Value("${notification.admin.rootOrg}")
	private String notificationAdminRootOrg;

	@Value("${notification.admin.org}")
	private String notificationAdminOrg;

	@Value("${}")
	private Boolean adminStatus;

	@Value("${server.port}")
	private String serverPort;

	@Value("${spring.servlet.multipart.max-file-size}")
	private String maxFileSize;

	@Value("${spring.servlet.multipart.max-request-size}")
	private String maxRequestSize;

	@Value("${server.connection-timeout}")
	private String connectionTimeout;

	@Value("${server.tomcat.max-threads}")
	private String maxThreads;

	@Value("${server.tomcat.min-spare-threads}")
	private String minSpareThreads;

	@Value("${appserver.ip}")
	private String appServerIp;

	@Value("${sbext.service.port}")
	private String sbextPort;

	@Value("${content.service.port}")
	private String contentServicePort;

	@Value("${log.access.key}")
	private String logAccessKey;

	@Value("${aws.accesskey}")
	private String awsAccessKey;

	@Value("${aws.secretkey}")
	private String awsSecretKey;

	@Value("${aws.apns.platform.arn}")
	private String apnsPlatformArn;

	@Value("${aws.gcm.platform.arn}")
	private String gcmPlatformArn;

	@Value("${aws.clientconfiguration.proxyhost}")
	private String clientConfigurationProxyHost;

	@Value("${aws.clientconfiguration.proxyport}")
	private Integer clientConfigurationProxyPort;

	@Value("${aws.local}")
	private Boolean awsLocal;

	@Value("${banner.image.path}")
	private String bannerImagePath;

	@Value("${notification.application.rootOrg}")
	private String applicationRootOrg;

	@Value("${notification.application.org}")
	private String applicationOrg;

	@Value("${sender}")
	private String emailSender;

	@Value("${spring.data.cassandra.bodhi.username}")
	private String cassandraUserName;

	@Value("${spring.data.cassandra.bodhi.password}")
	private String cassandraPassword;
	
	@Value("${notification.markAsRead.count}")
	private Integer markAllAsReadCount;

	public Integer getMarkAllAsReadCount() {
		return markAllAsReadCount;
	}

	public void setMarkAllAsReadCount(Integer markAllAsReadCount) {
		this.markAllAsReadCount = markAllAsReadCount;
	}
	

	public String getDomain() {
		return siemensDomain;
	}

	public String getPidServiceUrl() {
		return pidServiceUrl;
	}

	public void setPidServiceUrl(String pidServiceUrl) {
		this.pidServiceUrl = pidServiceUrl;
	}

	public String getKafkabootstrapAddress() {
		return kafkabootstrapAddress;
	}

	public void setKafkabootstrapAddress(String kafkabootstrapAddress) {
		this.kafkabootstrapAddress = kafkabootstrapAddress;
	}

	public String getEmailSender() {
		return emailSender;
	}

	public void setEmailSender(String emailSender) {
		this.emailSender = emailSender;
	}

	public String getApplicationRootOrg() {
		return applicationRootOrg;
	}

	public void setApplicationRootOrg(String applicationRootOrg) {
		this.applicationRootOrg = applicationRootOrg;
	}

	public String getApplicationOrg() {
		return applicationOrg;
	}

	public void setApplicationOrg(String applicationOrg) {
		this.applicationOrg = applicationOrg;
	}

	public String getBannerImagePath() {
		return bannerImagePath;
	}

	public void setBannerImagePath(String bannerImagePath) {
		this.bannerImagePath = bannerImagePath;
	}

	public String getApnsPlatformArn() {
		return apnsPlatformArn;
	}

	public void setApnsPlatformArn(String apnsPlatformArn) {
		this.apnsPlatformArn = apnsPlatformArn;
	}

	public String getGcmPlatformArn() {
		return gcmPlatformArn;
	}

	public void setGcmPlatformArn(String gcmPlatformArn) {
		this.gcmPlatformArn = gcmPlatformArn;
	}

	public Boolean getAwsLocal() {
		return awsLocal;
	}

	public void setAwsLocal(Boolean awsLocal) {
		this.awsLocal = awsLocal;
	}

	public void setNotificationAdminOrg(String notificationAdminOrg) {
		this.notificationAdminOrg = notificationAdminOrg;
	}

	public String getClientConfigurationProxyHost() {
		return clientConfigurationProxyHost;
	}

	public void setClientConfigurationProxyHost(String clientConfigurationProxyHost) {
		this.clientConfigurationProxyHost = clientConfigurationProxyHost;
	}

	public Integer getClientConfigurationProxyPort() {
		return clientConfigurationProxyPort;
	}

	public void setClientConfigurationProxyPort(Integer clientConfigurationProxyPort) {
		this.clientConfigurationProxyPort = clientConfigurationProxyPort;
	}

	public String getNotificationAdminRootOrg() {
		return notificationAdminRootOrg;
	}

	public void setNotificationAdminRootOrg(String notificationAdminRootOrg) {
		this.notificationAdminRootOrg = notificationAdminRootOrg;
	}

	public String getNotificationAdminOrg() {
		return notificationAdminOrg;
	}

	public Boolean getAdminStatus() {
		return adminStatus;
	}

	public void setAdminStatus(Boolean adminStatus) {
		this.adminStatus = adminStatus;
	}

	public String getServerPort() {
		return serverPort;
	}

	public void setServerPort(String serverPort) {
		this.serverPort = serverPort;
	}

	public String getMaxFileSize() {
		return maxFileSize;
	}

	public void setMaxFileSize(String maxFileSize) {
		this.maxFileSize = maxFileSize;
	}

	public String getMaxRequestSize() {
		return maxRequestSize;
	}

	public void setMaxRequestSize(String maxRequestSize) {
		this.maxRequestSize = maxRequestSize;
	}

	public String getConnectionTimeout() {
		return connectionTimeout;
	}

	public void setConnectionTimeout(String connectionTimeout) {
		this.connectionTimeout = connectionTimeout;
	}

	public String getMaxThreads() {
		return maxThreads;
	}

	public void setMaxThreads(String maxThreads) {
		this.maxThreads = maxThreads;
	}

	public String getMinSpareThreads() {
		return minSpareThreads;
	}

	public void setMinSpareThreads(String minSpareThreads) {
		this.minSpareThreads = minSpareThreads;
	}

	public String getAppServerIp() {
		return appServerIp;
	}

	public void setAppServerIp(String appServerIp) {
		this.appServerIp = appServerIp;
	}

	public String getSbextPort() {
		return sbextPort;
	}

	public void setSbextPort(String sbextPort) {
		this.sbextPort = sbextPort;
	}

	public String getContentServicePort() {
		return contentServicePort;
	}

	public void setContentServicePort(String contentServicePort) {
		this.contentServicePort = contentServicePort;
	}

	public String getLogAccessKey() {
		return logAccessKey;
	}

	public void setLogAccessKey(String logAccessKey) {
		this.logAccessKey = logAccessKey;
	}

	public String getAwsAccessKey() {
		return awsAccessKey;
	}

	public void setAwsAccessKey(String awsAccessKey) {
		this.awsAccessKey = awsAccessKey;
	}

	public String getAwsSecretKey() {
		return awsSecretKey;
	}

	public void setAwsSecretKey(String awsSecretKey) {
		this.awsSecretKey = awsSecretKey;
	}

	public String getCassandraUserName() {
		return cassandraUserName;
	}

	public String getCassandraPassword() {
		return cassandraPassword;
	}

	public void setCassandraUserName(String cassandraUserName) {
		this.cassandraUserName = cassandraUserName;
	}

	public void setCassandraPassword(String cassandraPassword) {
		this.cassandraPassword = cassandraPassword;
	}

}
