const express = require("express");
const morgan = require("morgan");
const database = require("./db/database");
const seedDatabase = require("./db/seed");
const getProjectWorkItems = require("./ado/getProjectWorkItems");

seedDatabase();

const app = express();

app.use(morgan("common"));

app.get("/", function (req, res, next) {
  database
    .raw("select VERSION() version")
    .then(([rows, columns]) => rows[0])
    .then((row) => res.json({ message: `Hello from MySQL ${row.version}` }))
    .catch(next);
});

app.get("/healthz", function (req, res) {
  res.send("I am happy and healthy\n");
});

app.post("/refresh", async function (req, res, next) {
  console.log("Received manual refresh request");
  res.send("Manual Work Item Refresh sent.\n");

  const projectWorkItems = await getProjectWorkItems();
  database
    .insert(projectWorkItems)
    .into("WorkItems")
    .onConflict("workItemId")
    .merge()
    .then((rows) => {
      console.log("Rows inserted: ", rows.length);
    });

  console.log("Manual refresh complete.");
});

app.get("/workItems", function (req, res, next) {
  database
    .select()
    .from("WorkItems")
    .then((rows) => res.json(rows))
    .catch(next);
});

module.exports = app;
