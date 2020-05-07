/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
//
//import java.util.List;
//
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.CrudRepository;
//
//
//public interface NotificationClassificationRepository extends CrudRepository<Classification, ClassificationKey> {
//
////	@Query(nativeQuery = true, value = "Select * from wingspan.notification_classification where event_id = ?1 and recipient in ?2")
////	public List<Classification> getNotificationClassificationByEventId(String eventId, List<String> recipient);
////
//	@Query(nativeQuery = true, value = "Select * from wingspan.notification_classification")
//	public List<Classification> getNotificationClassification();
//
//}
