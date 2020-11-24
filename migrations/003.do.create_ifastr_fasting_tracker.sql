DROP TABLE IF EXISTS fasting_tracker;

CREATE TABLE fasting_tracker
(
    fasting_id      SERIAL PRIMARY KEY,
    fasting_start   TIMESTAMPTZ,
    fasting_length  INTEGER,
    feast_start     TIMESTAMPTZ DEFAULT now() NOT NULL,
    completed       BOOLEAN
);