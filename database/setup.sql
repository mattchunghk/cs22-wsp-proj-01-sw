create TABLE users(
    id SERIAL PRIMARY key,
    username varchar(50) not null,
    password varchar(30) not null,
    is_admin boolean,
    created_at timestamp with time zone DEFAULT Now(),
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
create TABLE events(
    id SERIAL PRIMARY KEY,
    user_id integer not null,
    title text,
    country text,
    city text,
    introduction text,
    budget integer,
    start_date date,
    end_date date,
    people_quota integer,
    is_sporty boolean,
    is_luxury boolean,
    is_relax boolean,
    is_countryside boolean,
    status text,
    / / 'active',
    'inactive' Foreign Key (user_id) references users(id),
    created_at timestamp with time zone DEFAULT Now(),
    updated_at timestamp with time zone DEFAULT Now()
);
create TABLE messages(
    id SERIAL PRIMARY KEY,
    heading text not null,
    comment text not null,
    user_id integer,
    event_id integer,
    Foreign Key (user_id) references users(id),
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