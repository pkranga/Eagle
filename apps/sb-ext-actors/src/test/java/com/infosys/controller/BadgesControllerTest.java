/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.sunbird.common.models.response.Response;
import org.sunbird.common.models.util.ProjectLogger;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class BadgesControllerTest {

	private static String user;
	private static String fakeUser;

	@Autowired
	private TestRestTemplate restTemplate;

	@BeforeClass
	public static void setUp() {
		user = "";
		fakeUser = "fakeuser";
	}

	@SuppressWarnings("unchecked")
	@Test
	public void getBadgesForActualUser() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/Users/" + user + "/Badges",
				Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("Badge response").isNotNull();

		try {
			Map<String, Object> mapObject = (Map<String, Object>) resultMap.get("response");
			assertThat(mapObject.get("earned")).isNotNull();
			assertThat(mapObject.get("lastUpdatedDate")).isNotNull();
			assertThat(mapObject.get("canEarn")).isNotNull();
			assertThat(mapObject.get("totalPoints")).isNotNull();
			assertThat(mapObject.get("closeToEarning")).isNotNull();
			assertThat(mapObject.get("recent")).isNotNull();
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for badges");
		}
	}

	@SuppressWarnings("unchecked")
	@Test
	public void getBadgesForAFakeUser() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/Users/" + fakeUser + "/Badges",
				Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("Badge response").isNotNull();

		try {
			Map<String, Object> mapObject = (Map<String, Object>) resultMap.get("response");
			assertThat(mapObject.get("earned")).isNotNull();
			assertThat(mapObject.get("lastUpdatedDate")).isNotNull();
			assertThat(mapObject.get("canEarn")).isNotNull();
			assertThat(mapObject.get("totalPoints")).isNotNull();
			assertThat(mapObject.get("closeToEarning")).isNotNull();
			assertThat(mapObject.get("recent")).isNotNull();
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for badges for fake user");
		}
	}

	@SuppressWarnings("unchecked")
	@Test
	public void getRecentForActualUser() {
		ResponseEntity<Response> responseEntity = restTemplate
				.getForEntity("/v1/Users/" + user + "/Achievements/Recent", Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("Recent response").isNotNull();

		try {
			Map<String, Object> mapObject = (Map<String, Object>) resultMap.get("response");
			if (mapObject.containsKey("recent_badge"))
				assertThat(mapObject.get("recent_badge")).isNotNull();
			assertThat(mapObject.get("totalPoints")).isNotNull();
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for recent activity");
		}
	}

	@SuppressWarnings("unchecked")
	@Test
	public void getRecentForAFakeUser() {
		ResponseEntity<Response> responseEntity = restTemplate
				.getForEntity("/v1/Users/" + fakeUser + "/Achievements/Recent", Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("Recent response").isNotNull();

		try {
			Map<String, Object> mapObject = (Map<String, Object>) resultMap.get("response");
			assertThat(mapObject.get("recent_badge")).isNull();
			assertThat(mapObject.get("totalPoints")).isNotNull();
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for recent activity for fake user");
		}
	}

}
*/
