/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
substitute url based on requirement

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

substitute url based on requirement
substitute url based on requirement

@Repository
public interface UserPlaylistRepo
		extends CassandraRepository<UserPlaylist, UserPlaylistKey>, UserPlaylistCustomRepository {

	List<Map<String, Object>> findByUserPlayListKeyRootOrgAndUserPlayListKeyUserId(String rootOrg, String userId);

	@Query("select * from user_playlist where root_org=?0 and user_id=?1 and source_playlist_id=?2 allow filtering")
	Optional<UserPlaylist> findByRootOrgAndSharedWithAndSourcePlaylistId(String rootOrg, String sharedWith,
			UUID fromString);


}
