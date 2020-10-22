DROP TABLE IF EXISTS fasting_tracker;

CREATE TABLE tracker
(
    fasting_id      SERIAL PRIMARY KEY,
    fasting_start   TIMESTAMPTZ REFERENCES users(user_id),
    fasting_length  INTEGER,
    feast_start     TIMESTAMPTZ,
    completed       BOOLEAN
);