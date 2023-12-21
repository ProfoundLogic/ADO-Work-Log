CREATE TABLE IF NOT EXISTS Roles (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  description VARCHAR(255),
  lastUpdated TIMESTAMP,
  created TIMESTAMP
);