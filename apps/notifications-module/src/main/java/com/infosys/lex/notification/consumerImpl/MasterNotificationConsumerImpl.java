/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MasterNotificationConsumerImpl implements MasterNotificationConsumer {
	
	private final NotificationConsumerService consumerService;
	private final NotificationConsumerUtilService consumerUtilService;

	
	

	@Autowired
	public MasterNotificationConsumerImpl(NotificationConsumerService consumerService,NotificationConsumerUtilService consumerUtilService) {
		this.consumerService = consumerService;
		this.consumerUtilService = consumerUtilService;
	}

	private LexNotificationLogger logger = new LexNotificationLogger(getClass().getName());

	private static final ObjectMapper mapper = new ObjectMapper();
	
	
	@KafkaListener(id = "id0", groupId = "notification-consumer", topicPartitions = {
			@TopicPartition(topic = "notification_events", partitions = { "0", "1", "2", "3" }) },containerFactory = "kafkaListenerStringContainerFactory")
	public void consumeNotificationEvent(ConsumerRecord<String, String> consumerRecord) throws Exception {

		String message = String.valueOf(consumerRecord.value());
		NotificationEvent notificationEvent = new NotificationEvent();

		try {
			notificationEvent = mapper.readValue(message, new TypeReference<NotificationEvent>() {
			});
			logger.info("received notification event " + notificationEvent.toString());
			consumerService.consumeNotificationEvent(notificationEvent);
			logger.info("completed processing for event " + notificationEvent.toString());
		} catch (JsonParseException | JsonMappingException e) {
			logger.error(e);
			consumerUtilService.saveError(notificationEvent.getRootOrg(), notificationEvent.getEventId(), e, notificationEvent);
		} catch (ApplicationLogicException e) {
			logger.error(e);
			consumerUtilService.saveError(notificationEvent.getRootOrg(), notificationEvent.getEventId(), e, notificationEvent);
		} catch (Exception e) {
			logger.fatal(e);
			consumerUtilService.saveError(notificationEvent.getRootOrg(), notificationEvent.getEventId(), e, notificationEvent);
		}
	}
	
	
	
}
