/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
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
public class LeaderBoardControllerTests {

	private static String user;

	@Autowired
	private TestRestTemplate restTemplate;

	@BeforeClass
	public static void setUp() {
		user="";
	}

	@SuppressWarnings("unchecked")
	@Test
	public void getMonthlyLeaderboard() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=L&duration_type=M&email_id="+user, Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("leaderboard response").isNotNull();

		try {
			Map<String, Object> mapObject = (Map<String, Object>) resultMap.get("response");
			List<Map<String,Object>> ls=(List<Map<String,Object>>) mapObject.get("items");
			assertThat(ls).isNotNull();
			for(Map<String,Object> mp:ls) {
				assertThat(mp.get("first_name")).isNotNull();
				assertThat(mp.get("first_name")).isNotEqualTo("");
				assertThat(mp.get("last_name")).isNotNull();
				assertThat(mp.get("last_name")).isNotEqualTo("");
			}
			Map<String,Object> prev=(Map<String, Object>) mapObject.get("prev");
			
			if(prev!=null) {
				ResponseEntity<Response> prevResponseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=L&duration_type=M&email_id="+user+"&year="+prev.get("leaderboard_year")+"&duration_value="+prev.get("duration_value"), Response.class);
				Response prevResponse = prevResponseEntity.getBody();
				Map<String, Object> prevResultMap = prevResponse.getResult();

				assertThat(prevResultMap.get("response")).as("leaderboard response").isNotNull();
				
				Map<String, Object> prevMapObject = (Map<String, Object>) prevResultMap.get("response");
				List<Map<String,Object>> prevls=(List<Map<String,Object>>) prevMapObject.get("items");
				assertThat(ls).isNotNull();
				for(Map<String,Object> mp:prevls) {
					assertThat(mp.get("first_name")).isNotNull();
					assertThat(mp.get("first_name")).isNotEqualTo("");
					assertThat(mp.get("last_name")).isNotNull();
					assertThat(mp.get("last_name")).isNotEqualTo("");
				}
				
				Map<String,Object> next=(Map<String, Object>) mapObject.get("next");
				if(next!=null) {
					ResponseEntity<Response> nextResponseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=L&duration_type=M&email_id="+user+"&year="+next.get("leaderboard_year")+"&duration_value="+next.get("duration_value"), Response.class);
					Response nextResponse = nextResponseEntity.getBody();
					Map<String, Object> nextResultMap = nextResponse.getResult();

					assertThat(nextResultMap.get("response")).as("leaderboard response").isNotNull();
					
					Map<String, Object> nextMapObject = (Map<String, Object>) nextResultMap.get("response");
					List<Map<String,Object>> nextls=(List<Map<String,Object>>) nextMapObject.get("items");
					assertThat(ls).isNotNull();
					for(Map<String,Object> mp:nextls) {
						assertThat(mp.get("first_name")).isNotNull();
						assertThat(mp.get("first_name")).isNotEqualTo("");
						assertThat(mp.get("last_name")).isNotNull();
						assertThat(mp.get("last_name")).isNotEqualTo("");
					}
				}
			}
			
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for monthly leaderboard");
		}
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void getWeeklyLeaderboard() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=L&duration_type=W&email_id="+user, Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("leaderboard response").isNotNull();

		try {
			Map<String, Object> mapObject = (Map<String, Object>) resultMap.get("response");
			List<Map<String,Object>> ls=(List<Map<String,Object>>) mapObject.get("items");
			assertThat(ls).isNotNull();
			for(Map<String,Object> mp:ls) {
				assertThat(mp.get("first_name")).isNotNull();
				assertThat(mp.get("first_name")).isNotEqualTo("");
				assertThat(mp.get("last_name")).isNotNull();
				assertThat(mp.get("last_name")).isNotEqualTo("");
			}
			Map<String,Object> prev=(Map<String, Object>) mapObject.get("prev");
			
			if(prev!=null) {
				ResponseEntity<Response> prevResponseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=L&duration_type=W&email_id="+user+"&year="+prev.get("leaderboard_year")+"&duration_value="+prev.get("duration_value"), Response.class);
				Response prevResponse = prevResponseEntity.getBody();
				Map<String, Object> prevResultMap = prevResponse.getResult();

				assertThat(prevResultMap.get("response")).as("leaderboard response").isNotNull();
				
				Map<String, Object> prevMapObject = (Map<String, Object>) prevResultMap.get("response");
				List<Map<String,Object>> prevls=(List<Map<String,Object>>) prevMapObject.get("items");
				assertThat(ls).isNotNull();
				for(Map<String,Object> mp:prevls) {
					assertThat(mp.get("first_name")).isNotNull();
					assertThat(mp.get("first_name")).isNotEqualTo("");
					assertThat(mp.get("last_name")).isNotNull();
					assertThat(mp.get("last_name")).isNotEqualTo("");
				}
			}
			
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for weekly leaderboard");
		}
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void getMonthlyCollaboratorLeaderboard() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=C&duration_type=M&email_id="+user, Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("leaderboard response").isNotNull();

		try {
			Map<String, Object> mapObject = (Map<String, Object>) resultMap.get("response");
			List<Map<String,Object>> ls=(List<Map<String,Object>>) mapObject.get("items");
			assertThat(ls).isNotNull();
			for(Map<String,Object> mp:ls) {
				assertThat(mp.get("first_name")).isNotNull();
				assertThat(mp.get("first_name")).isNotEqualTo("");
				assertThat(mp.get("last_name")).isNotNull();
				assertThat(mp.get("last_name")).isNotEqualTo("");
			}
			Map<String,Object> prev=(Map<String, Object>) mapObject.get("prev");
			
			if(prev!=null) {
				ResponseEntity<Response> prevResponseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=C&duration_type=M&email_id="+user+"&year="+prev.get("leaderboard_year")+"&duration_value="+prev.get("duration_value"), Response.class);
				Response prevResponse = prevResponseEntity.getBody();
				Map<String, Object> prevResultMap = prevResponse.getResult();

				assertThat(prevResultMap.get("response")).as("leaderboard response").isNotNull();
				
				Map<String, Object> prevMapObject = (Map<String, Object>) prevResultMap.get("response");
				List<Map<String,Object>> prevls=(List<Map<String,Object>>) prevMapObject.get("items");
				assertThat(ls).isNotNull();
				for(Map<String,Object> mp:prevls) {
					assertThat(mp.get("first_name")).isNotNull();
					assertThat(mp.get("first_name")).isNotEqualTo("");
					assertThat(mp.get("last_name")).isNotNull();
					assertThat(mp.get("last_name")).isNotEqualTo("");
				}
			}
			
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for monthly collaborator's leaderboard");
		}
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void getWeeklyCollaboratorLeaderboard() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=C&duration_type=W&email_id="+user, Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("leaderboard response").isNotNull();

		try {
			Map<String, Object> mapObject = (Map<String, Object>) resultMap.get("response");
			List<Map<String,Object>> ls=(List<Map<String,Object>>) mapObject.get("items");
			assertThat(ls).isNotNull();
			for(Map<String,Object> mp:ls) {
				assertThat(mp.get("first_name")).isNotNull();
				assertThat(mp.get("first_name")).isNotEqualTo("");
				assertThat(mp.get("last_name")).isNotNull();
				assertThat(mp.get("last_name")).isNotEqualTo("");
			}
			Map<String,Object> prev=(Map<String, Object>) mapObject.get("prev");
			
			if(prev!=null) {
				ResponseEntity<Response> prevResponseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=C&duration_type=W&email_id="+user+"&year="+prev.get("leaderboard_year")+"&duration_value="+prev.get("duration_value"), Response.class);
				Response prevResponse = prevResponseEntity.getBody();
				Map<String, Object> prevResultMap = prevResponse.getResult();

				assertThat(prevResultMap.get("response")).as("leaderboard response").isNotNull();
				
				Map<String, Object> prevMapObject = (Map<String, Object>) prevResultMap.get("response");
				List<Map<String,Object>> prevls=(List<Map<String,Object>>) prevMapObject.get("items");
				assertThat(ls).isNotNull();
				for(Map<String,Object> mp:prevls) {
					assertThat(mp.get("first_name")).isNotNull();
					assertThat(mp.get("first_name")).isNotEqualTo("");
					assertThat(mp.get("last_name")).isNotNull();
					assertThat(mp.get("last_name")).isNotEqualTo("");
				}
			}
			
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for weekly collaborator's leaderboard");
		}
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void getPastToppers() {
		ResponseEntity<Response> responseEntity = restTemplate.getForEntity("/v1/LeaderBoard?leaderboard_type=C&duration_type=M&email_id="+user, Response.class);
		Response response = responseEntity.getBody();
		Map<String, Object> resultMap = response.getResult();

		assertThat(resultMap.get("response")).as("leaderboard response").isNotNull();

		try {
			List<Map<String, Object>> ls = (List<Map<String, Object>>) resultMap.get("response");
			assertThat(ls).isNotNull();
			for(Map<String,Object> mp:ls) {
				assertThat(mp.get("first_name")).isNotNull();
				assertThat(mp.get("first_name")).isNotEqualTo("");
				assertThat(mp.get("last_name")).isNotNull();
				assertThat(mp.get("last_name")).isNotEqualTo("");
			}
		} catch (Exception e) {
			ProjectLogger.log("exception caught while Testing for top learners");
		}
	}
	
}
*/
