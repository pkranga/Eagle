/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

import java.io.IOException;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EmailNotificationConsumerImpl implements EmailNotificationConsumer{
	
	@Autowired
	EmailService emailService;
	
	@Autowired
	NotificationConsumerUtilService consumerUtilServ;

	
	private LexNotificationLogger logger = new LexNotificationLogger(getClass().getName());

	private static final ObjectMapper mapper = new ObjectMapper();
	
	
	@KafkaListener(id = "id1", groupId = "email-notification-consumer", topicPartitions = {
			@TopicPartition(topic = "email_notification_events", partitions = { "0", "1", "2", "3" }) })
	public void consumeEmailEvent(ConsumerRecord<?, ?> consumerRecord) {

		String message = String.valueOf(consumerRecord.value());
		EmailRequest emailEvent = null;
		try {
			emailEvent = mapper.readValue(message, new TypeReference<EmailRequest>() {
			});
			emailService.sendEmail(emailEvent);
		} catch (IOException e) {
			logger.error(e);
			consumerUtilServ.saveError("Could not parse request body", "Could not parse request body", e, emailEvent);
		} catch (ApplicationLogicException e) {
			logger.error(e);
			consumerUtilServ.saveError(emailEvent.getRootOrg(), emailEvent.getEventId(), e, emailEvent);
		} catch (Exception e) {
			logger.fatal(e);
			consumerUtilServ.saveError(emailEvent.getRootOrg(), emailEvent.getEventId(), e, emailEvent);
		}
	}

}
