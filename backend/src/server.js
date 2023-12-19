const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const { collectWorkItems } = require("./getLastDayWorkItems");

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

app.get("/refresh", function (req, res, next) {
  console.log("Received manual refresh request");
  collectWorkItems();
  res.send("Manual Work Item Refresh sent.\n");
});

module.exports = app;
