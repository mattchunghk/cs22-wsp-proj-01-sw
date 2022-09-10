create TABLE users(
    id SERIAL PRIMARY key,
    username varchar(255) not null,
    password varchar(255) not null,
    is_admin boolean,
    created_at timestamp with time zone DEFAULT Now(),
    updated_at timestamp with time zone DEFAULT Now()
);
create TABLE events(
    id SERIAL PRIMARY KEY,
    user_id integer not null,
    Foreign Key (user_id) references users(id),
    title text,
    country text,
    city text,
    created_at timestamp with time zone DEFAULT Now(),
    updated_at timestamp with time zone DEFAULT Now(),
    introduction text,
    budget integer,
    start_date date,
    end_date date,
    people_quota integer,
    is_sporty boolean,
    is_luxury boolean,
    is_relax boolean,
    is_countryside boolean
);
create TABLE messages(
    id SERIAL PRIMARY KEY,
    comment text not null,
    user_id integer,
    Foreign Key (user_id) references users(id),
    event_id integer,
    Foreign Key (event_id) references events(id),
    created_at timestamp with time zone DEFAULT Now(),
    updated_at timestamp with time zone DEFAULT Now()
);
create TABLE favorite_events(
    id SERIAL PRIMARY KEY,
    user_id integer,
    Foreign Key (user_id) references users(id),
    event_id integer,
    Foreign Key (event_id) references events(id)
);
create TABLE event_participants(
    id SERIAL PRIMARY KEY,
    user_id integer,
    Foreign Key (user_id) references users(id),
    event_id integer,
    Foreign Key (event_id) references events(id)
);
create TABLE event_images(
    id SERIAL PRIMARY KEY,
    filename varchar(255),
    event_id integer,
    Foreign Key (event_id) references events(id)
);
create TABLE message_images(
    id SERIAL PRIMARY KEY,
    filename varchar(255),
    message_id integer,
    Foreign Key (message_id) references messages(id)
);
create TABLE user_favorite_messages(
    id SERIAL PRIMARY KEY,
    user_id integer,
    Foreign Key (user_id) references users(id),
    message_id integer,
    Foreign Key (message_id) references messages(id)
);