
CREATE TABLE IF NOT EXISTS bodhi.user_notification_event(	
       user_id text,
       event_id text,
       receiving_role text,
       event_activated boolean,
       modes_activated map<text, boolean>,
       group_id text,
       primary key (user_id,event_id,receiving_role)
);

CREATE TABLE IF NOT EXISTS bodhi.user_device (
    user_id text PRIMARY KEY,
    target_arns list<text>
)

CREATE TABLE IF NOT EXISTS bodhi.user_notification (
    user_id text,
    notification_id text,
    event_id text,
    group_id text,
    message text,
    receiving_role text,
    receiving_ts timestamp,
    seen boolean,
    seen_ts timestamp,
    subject text,
    PRIMARY KEY (user_id, notification_id)
) WITH CLUSTERING ORDER BY (notification_id ASC)