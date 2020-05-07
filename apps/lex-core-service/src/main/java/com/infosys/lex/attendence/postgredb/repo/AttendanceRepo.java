/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
substitute url based on requirement

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

substitute url based on requirement
substitute url based on requirement

@Repository
public interface AttendanceRepo extends JpaRepository<ContentAttendance, ContentAttendancePrimaryKey> {

	@Query(nativeQuery = true,value="SELECT ca.content_id from content_attendance ca where ca.root_org = ?1 and ca.user_id = ?2 and ca.content_id in ?3")
	List<String> findByRootorgAndUserIdandContentId(String rootOrg, String userId,List<String> contentIds);

	
	@Query(nativeQuery = true,value="SELECT ca.content_id from content_attendance ca where ca.root_org = ?1 and ca.user_id = ?2")
	List<String> findByRootorgAndUserId(String rootOrg, String userId);

	@Query(nativeQuery = true,value="SELECT ca.user_id from content_attendance ca where ca.root_org = ?1 and ca.content_id = ?2")
	List<String> findByRootorgAndContentId(String rootOrg, String contentId);

}
