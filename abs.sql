create TABLE Users(
    id serial PRIMARY KEY,
    usernames varchar(255) not null,
    password varchar(255) not null,
    is_admin boolean,
    created_at date with time zone,
    updated_at date with time zone
);
create TABLE Messages(
    id serial PRIMARY KEY,
    comment text not null,
    image varchar(255),
    user_id integer,
    created_at date with time zone,
    updated_at date with time zone
);
create TABLE Get_interested(
    id serial PRIMARY KEY,
    user_id integer,
    event_id integer,
);
create TABLE Event_participants(
    id serial PRIMARY KEY,
    user_id integer,
    event_id integer,
);
create TABLE Images(
    id serial PRIMARY KEY,
    filename varchar(255),
    messages_id integer,
    event_id integer,
);