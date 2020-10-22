DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id             SERIAL PRIMARY KEY,
    firstname           VARCHAR,
    lastname            VARCHAR,
    username            VARCHAR,
    email               VARCHAR,
    cell                VARCHAR,
    pass                VARCHAR,
    verified_status     BOOLEAN,
    join_date           TIMESTAMPTZ DEFAULT NOW(),
    method              SERIAL REFERENCES fasting_methods(method_id),
    fasting_start       TIMESTAMPTZ,
);