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
substitute url based on requirement

/**
 * Created by Krishnendu_C on 8/16/2018.
 */
public class LexProjectUtil {

	private static String bodhi_ui_index;

	static {
		if (System.getenv("bodhi_ui_index") == null)
substitute url based on requirement
		else
			bodhi_ui_index = System.getenv("bodhi_ui_index");
	}

	public static enum EsIndex {
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
substitute url based on requirement
																"accesscontrolgroups"), topic_topic(
substitute url based on requirement

		private String indexName;

		private EsIndex(String name) {
			this.indexName = name;
		}

		public String getIndexName() {
			return this.indexName;
		}
	}

	public static enum Status {
		DRAFT("Draft"), LIVE("Live"), RETIRED("Retired");

		private String value;

		private Status(String value) {
			this.value = value;
		}

		public String getValue() {
			return this.value;
		}
	}

	public static enum EsType {
		course("course"), content("content"), user("user"), organisation("org"), usercourses("usercourses"), usernotes(
				"usernotes"), history("history"), userprofilevisibility("userprofilevisibility"), feedback(
						"feedback"), resource("resource"), skills("skills"), unit("units"), client(
substitute url based on requirement
										"group"), topic_topic("topic_pid"), topic_details("doc");

		private String typeName;

		private EsType(String name) {
			this.typeName = name;
		}

		public String getTypeName() {
			return this.typeName;
		}
	}

	/**
	 * Enum to hold the content type
	 *
	 * @author Krishnendu
	 */
	public enum ContentType {
		learningPath("Learning Path"), course("Course"), collection("Collection"), resource("Resource");

		private String contentType;

		private ContentType(String contentType) {
			this.contentType = contentType;
		}

		public String get() {
			return contentType;
		}

		@SuppressWarnings("unused")
		private void set(String contentType) {
			this.contentType = contentType;
		}
	}

}