CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tasks (
	uuid UUID DEFAULT uuid_generate_v4 (),
	task_name VARCHAR(250),
	"is_complete" bool,
	PRIMARY KEY (uuid)

);

INSERT INTO "tasks"
    ("task_name", "is_complete")
    VALUES
	('Wake Up', false),
	('Grab a Brush', true),
	('Put a Little Makeup', false);

DELETE FROM tasks;

DROP TABLE tasks;
