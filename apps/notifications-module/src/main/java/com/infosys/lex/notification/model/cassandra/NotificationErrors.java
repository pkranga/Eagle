/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

@Table("notification_errors")
public class NotificationErrors {

	@PrimaryKey
	private NotificationErrorsPrimaryKey notificationErrorPkey;

	@Column("error_message")
	private String errorMessage;

	@Column("request_body")
	private String requestBody;

	@Column("stack_trace")
	private String stackTrace;

	public NotificationErrors(NotificationErrorsPrimaryKey notificationErrorPkey, String errorMessage,
			String requestBody, String stackTrace) {
		this.notificationErrorPkey = notificationErrorPkey;
		this.errorMessage = errorMessage;
		this.requestBody = requestBody;
		this.stackTrace = stackTrace;
	}

	public NotificationErrorsPrimaryKey getNotificationErrorPkey() {
		return notificationErrorPkey;
	}

	public void setNotificationErrorPkey(NotificationErrorsPrimaryKey notificationErrorPkey) {
		this.notificationErrorPkey = notificationErrorPkey;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public String getRequestBody() {
		return requestBody;
	}

	public void setRequestBody(String requestBody) {
		this.requestBody = requestBody;
	}

	public String getStackTrace() {
		return stackTrace;
	}

	public void setStackTrace(String stackTrace) {
		this.stackTrace = stackTrace;
	}
}
