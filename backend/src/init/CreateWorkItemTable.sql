CREATE TABLE IF NOT EXISTS WorkItems (
  id INT PRIMARY KEY AUTO_INCREMENT,
  workItemId INT,
  revision INT,
  title VARCHAR(255),
  assignedTo VARCHAR(255),
  state VARCHAR(255),
  areaPath VARCHAR(255),
  lastUpdated VARCHAR(255),
  created VARCHAR(255)
);
