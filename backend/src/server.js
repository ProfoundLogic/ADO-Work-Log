const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const database = require("./db/database");

const timecards = require("./routes/timecards.js");
const workitems = require("./routes/workitems.js");
const jobs = require("./routes/jobs.js");

const app = express();

app.use(cors());
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

app.use("/workitems", workitems);
app.use("/timecards", timecards);
app.use("/jobs", jobs);

module.exports = app;
