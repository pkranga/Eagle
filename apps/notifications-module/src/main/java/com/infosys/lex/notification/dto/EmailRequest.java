/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.util.List;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EmailRequest {

	private String rootOrg;

	@JsonProperty(value = "from")
	private String from;

	@NotNull
	@NotEmpty
	@JsonProperty(value = "body")
	private String body;

	@NotNull
	@NotEmpty
	@JsonProperty(value = "subject")
	private String subject;

	@NotNull
	@NotEmpty
	@JsonProperty(value = "event-id")
	private String eventId;

	@JsonProperty(value = "to")
	private List<String> to;

	@JsonProperty(value = "cc")
	private List<String> cc;

	@JsonProperty(value = "bcc")
	private List<String> bcc;

	@NotNull
	@JsonProperty(value = "emails-passed")
	private Boolean emailsPassed;
	
	
	

	private Boolean isEventReceiverConfigured = false;
	
	

	public Boolean getIsEventReceiverConfigured() {
		return isEventReceiverConfigured;
	}

	public void setIsEventReceiverConfigured(Boolean isEventReceiverConfigured) {
		this.isEventReceiverConfigured = isEventReceiverConfigured;
	}

	public EmailRequest() {
		super();
	}

	public EmailRequest(String rootOrg, String from, @NotNull @NotEmpty String body, @NotNull @NotEmpty String subject,
			@NotNull @NotEmpty String eventId, List<String> to, List<String> cc, List<String> bcc,
			Boolean emailsPassed) {

		this.rootOrg = rootOrg;
		this.from = from;
		this.body = body;
		this.subject = subject;
		this.eventId = eventId;
		this.to = to;
		this.cc = cc;
		this.bcc = bcc;
		this.emailsPassed = emailsPassed;
	}
	
	public EmailRequest(String rootOrg, String from, @NotNull @NotEmpty String body, @NotNull @NotEmpty String subject,
			@NotNull @NotEmpty String eventId, List<String> to, List<String> cc, List<String> bcc,
			Boolean emailsPassed,Boolean isEventReceiverConfigured) {

		this.rootOrg = rootOrg;
		this.from = from;
		this.body = body;
		this.subject = subject;
		this.eventId = eventId;
		this.to = to;
		this.cc = cc;
		this.bcc = bcc;
		this.emailsPassed = emailsPassed;
		this.isEventReceiverConfigured = isEventReceiverConfigured;
	}

	@Override
	public String toString() {
		return "EmailEvent [rootOrg=" + rootOrg + ", from=" + from + ", body=" + body + ", subject=" + subject
				+ ", eventId=" + eventId + ", to=" + to + ", cc=" + cc + ", bcc=" + bcc + ", emailsPassed="
				+ emailsPassed + "]";
	}

	public String getRootOrg() {
		return rootOrg;
	}

	public void setRootOrg(String rootOrg) {
		this.rootOrg = rootOrg;
	}

	public String getEventId() {
		return eventId;
	}

	public void setEventId(String eventId) {
		this.eventId = eventId;
	}

	public List<String> getTo() {
		return to;
	}

	public void setTo(List<String> to) {
		this.to = to;
	}

	public List<String> getCc() {
		return cc;
	}

	public void setCc(List<String> cc) {
		this.cc = cc;
	}

	public List<String> getBcc() {
		return bcc;
	}

	public void setBcc(List<String> bcc) {
		this.bcc = bcc;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getFrom() {
		return from;
	}

	public void setFrom(String from) {
		this.from = from;
	}

	public boolean isEmailsPassed() {
		return emailsPassed;
	}

	public void setEmailsPassed(Boolean emailsPassed) {
		this.emailsPassed = emailsPassed;
	}
}
