CREATE TABLE IF NOT EXISTS TimeCards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  timeCardId VARCHAR(255) UNIQUE,
  workItemId INT,
  user VARCHAR(255),
  description VARCHAR(255),
  minutesLogged INT,
  created VARCHAR(255)
);
