create table note
(
    id          uuid                     not null primary key,
    title       character varying(200)   not null,
    content     text,
    created_at  timestamp with time zone not null,
    updated_at  timestamp with time zone not null
);

create index note_created_at_idx on note (created_at desc);
