const fs = require("fs");
const path = require("path");
const database = require("./database");

const initDir = path.join(__dirname, "../init");

function seedDatabase() {
  fs.readdir(initDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${initDir}:`, err);
      return;
    }

    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        if (path.extname(file) === ".sql") {
          const filePath = path.join(initDir, file);
          fs.readFile(filePath, "utf8", (err, sql) => {
            if (err) {
              console.error(`Error reading file ${filePath}:`, err);
              reject(err);
            }

            database
              .raw(sql)
              .then(() => {
                console.log(`Executed SQL file ${filePath}`);
                resolve();
              })
              .catch((err) => {
                console.error(`Error executing SQL file ${filePath}:`, err);
                reject(err);
              });
          });
        } else {
          resolve();
        }
      });
    });

    Promise.all(promises)
      .then(() => {
        console.log("All SQL files executed");
      })
      .catch((err) => {
        console.error("Error executing SQL files:", err);
      });
  });
}

module.exports = seedDatabase;
