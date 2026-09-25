BEGIN;

INSERT INTO users (id, username, fullname, profile_description)
VALUES
  (1, 'alice', 'Alice', ''),
  (2, 'bob', 'Bob', ''),
  (3, 'charlie', 'Charlie', '')
ON CONFLICT (username) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1), true)
FROM users;

INSERT INTO tweets (id, text, author)
VALUES
  (1, 'Hello Twitter!', 'alice'),
  (2, 'Mein zweiter Tweet', 'bob')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('tweets', 'id'), COALESCE(MAX(id), 1), true)
FROM tweets;

COMMIT;
