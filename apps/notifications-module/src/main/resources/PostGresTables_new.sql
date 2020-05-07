CREATE TABLE notification.tbl_tenant_mode
(
       root_org character varying NOT NULL, 
       org character varying NOT NULL,
       mode character varying NOT NULL,  
       activated boolean,  
       icon_id character varying, 
       updated_on TIMESTAMP,
       updated_by character varying,
       CONSTRAINT tenent_mode_pkey PRIMARY KEY (root_org, org, mode)
);

Create TABLE notification.tenant_mode_language (
	mode character varying NOT NULL,
	mode_name character varying NOT NULL,
	language character varying NOT NULL
	CONSTRAINT mode_pkey PRIMARY KEY(mode,language)
);

CREATE TABLE notification.tenant_event_notification
(
       root_org character varying NOT NULL,
       org character varying NOT NULL,
       event_id character varying NOT NULL,
       recipient character varying NOT NULL,
       mode character varying NOT NULL,
       mode_activated boolean NOT NULL,
       template_id character varying,
       updated_on TIMESTAMP,
       updated_by character varying,
       CONSTRAINT tenent_event_pkey PRIMARY KEY (root_org, org, event_id, recipient, mode)
);

CREATE TABLE notification.tenant_event_template(
       template_id character varying NOT NULL,
       language character varying NOT NULL,
       template_subject character varying NOT NULL,
       template_text character varying NOT NUll,
       updated_on TIMESTAMP,
       updated_by character varying,
       CONSTRAINT tenant_event_template_pKey PRIMARY KEY(template_id,language) 
);

CREATE TABLE notification.event_recipient(
       event_id character varying NOT NULL,
       recipient character varying NOT NULL,
       tag character varying NOT NULL,
       updated_on TIMESTAMP,
       updated_by character varying,
       CONSTRAINT event_group_pKey PRIMARY KEY(event_id,recipient)
);


CREATE TABLE notification.event_group(
       event_id character varying NOT NULL,
       language character varying NOT NULL,
       event_name character varying NOT NULL,
       group_id character varying NOT NULL,
       group_name character varying NOT NULL,
       updated_on TIMESTAMP,
       updated_by character varying,
       CONSTRAINT event_group_pKey PRIMARY KEY(event_id,language)
);


create table notification.notification_classification (
	event_id character varying NOT NULL,
	recipient character varying NOT NULL,
	classification character varying NOT NULL,
	CONSTRAINT class_pkey PRIMARY KEY(event_id,recipient),
	CONSTRAINT class_check CHECK(classification in ('Information','Action'))
);



