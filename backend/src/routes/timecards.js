var router = require("express").Router();
const database = require("../db/database.js");

const getAllTimeCards = require("../ado/getAllTimeCards.js");

router.get("/list", function (req, res, next) {
  database
    .select()
    .from("TimeCards")
    .then((rows) => res.json(rows))
    .catch(next);
});

router.get("/refresh", async function (req, res, next) {
  await getAllTimeCards();
  res.send("Timecard refresh complete.");
});

router.get("/lastUpdated", function (req, res, next) {
  database
    .select()
    .from("TimeCards")
    .orderBy("created", "desc")
    .limit(1)
    .then((rows) => res.json(rows))
    .catch(next);
});

module.exports = router;
