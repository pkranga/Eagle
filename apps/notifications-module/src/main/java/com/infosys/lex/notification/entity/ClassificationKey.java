/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
//
//import java.io.Serializable;
//
//import javax.persistence.Column;
//import javax.persistence.Embeddable;
//
//@Embeddable
//public class ClassificationKey implements Serializable {
//
//	/**
//	 * 
//	 */
//	private static final long serialVersionUID = 6800339138554340853L;
//
//	@Column(name = "event_id", columnDefinition = "VARCHAR")
//	private String eventId;
//
//	@Column(name = "recipient", columnDefinition = "VARCHAR")
//	private String recipient;
//
//	public String getEventId() {
//		return eventId;
//	}
//
//	public String getRecipient() {
//		return recipient;
//	}
//
//	public void setEventId(String eventId) {
//		this.eventId = eventId;
//	}
//
//	public void setRecipient(String recipient) {
//		this.recipient = recipient;
//	}
//
//	public ClassificationKey() {
//		super();
//	}
//
//	public ClassificationKey(String eventId, String recipient) {
//		super();
//		this.eventId = eventId;
//		this.recipient = recipient;
//	}
//
//	@Override
//	public String toString() {
//		return "ClassificationKey [eventId=" + eventId + ", recipient=" + recipient + "]";
//	}
//
//}
