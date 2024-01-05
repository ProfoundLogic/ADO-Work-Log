var router = require("express").Router();
const database = require("../db/database.js");

router.get("/list", function (req, res, next) {
  database
    .select()
    .from("Jobs")
    .orderBy("modified", "desc")
    .then((rows) => res.json(rows))
    .catch(next);
});

router.get("/:jobId", function (req, res, next) {
  database
    .select()
    .from("Actions")
    .where("jobId", req.params.jobId)
    .then((rows) => {
      return res.json(rows);
    })
    .catch(next);
});

module.exports = router;
