DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id             SERIAL PRIMARY KEY,
    firstname           VARCHAR NOT NULL,
    lastname            VARCHAR NOT NULL,
    username            VARCHAR NOT NULL,
    email               VARCHAR NOT NULL,
    cell                VARCHAR,
    pass                VARCHAR,
    verified_status     BOOLEAN DEFAULT FALSE,
    join_date           TIMESTAMPTZ DEFAULT NOW(),
    method              INTEGER REFERENCES fasting_methods(method_id),
    fasting_start       TIMESTAMPTZ
);