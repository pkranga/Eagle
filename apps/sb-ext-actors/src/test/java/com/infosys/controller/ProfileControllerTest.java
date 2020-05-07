/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.Map;

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

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ProfileControllerTest {

	private static String user;
	private static String fakeUser;

	@Autowired
	private TestRestTemplate restTemplate;

	@BeforeClass
	public static void setUp() {
		user="";
		fakeUser="fakeuser";
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void getUserData() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/Users/"+user+"/Data", Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();
		assertThat(resultMap.get("response")).as("profile").isNotNull();

		try {
			Map<String, Object> mp = (Map<String, Object>) resultMap.get("response");
			assertThat(mp.get("givenName")).isNotNull();
			assertThat(mp.get("givenName")).isNotEqualTo("");
			assertThat(mp.get("surname")).isNotNull();
			assertThat(mp.get("surname")).isNotEqualTo("");
			assertThat(mp.get("onPremisesUserPrincipalName")).isEqualTo(user);
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for user data");
		}
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void getFakeUserData() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/Users/"+fakeUser+"/Data", Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();
		try {
			Map<String, Object> mp = (Map<String, Object>) resultMap.get("response");
			assertThat(mp).as("profile").isNotNull();
			assertThat(mp).as("profile").isEqualTo(new HashMap<>());
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for fake user data");
		}
	}
	
	@Test
	public void getUserPhoto() {
		ResponseEntity<byte[]> responseEntity = restTemplate.getForEntity("/v1/Users/"+user+"/Photo", byte[].class);
		byte[] response = responseEntity.getBody();
		try {
			assertThat(response).as("profile photo").isNotNull();
			assertThat(response.length).as("profile photo").isGreaterThan(10);
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for user photo");
		}
	}
	
	@Test
	public void getFakeUserPhoto() {
		ResponseEntity<byte[]> responseEntity = restTemplate.getForEntity("/v1/Users/"+fakeUser+"/Photo", byte[].class);
		byte[] response = responseEntity.getBody();
		try {
			assertThat(response).as("profile photo").isNull();
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for fake user photo");
		}
	}
}
*/
