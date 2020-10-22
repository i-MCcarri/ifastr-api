DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS fasting_tracker;
DROP TABLE IF EXISTS fasting_methods;

CREATE TABLE fasting_methods
(
    method_id       SERIAL PRIMARY KEY,
    method_options   VARCHAR,
    fasting_length  VARCHAR,
    feast_length    VARCHAR
); 