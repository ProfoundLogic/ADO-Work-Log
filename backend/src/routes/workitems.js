var router = require("express").Router();
const refreshWorkItems = require("../ado/refreshWorkItems.js");
const database = require("../db/database.js");

router.get("/refresh", async function (req, res, next) {
  res.send("Manual Work Item Refresh sent.\n");

  await refreshWorkItems();

  console.log("Manual refresh complete.");
});

router.get("/list", function (req, res, next) {
  database
    .with(
      "Recent_WorkItems",
      database.raw(
        "SELECT id, workItemId, revision, title, assignedTo, state, areaPath, lastUpdated, created, ROW_NUMBER() OVER (PARTITION BY workItemId ORDER BY lastUpdated DESC) AS RowNum FROM WorkItems"
      )
    )
    .select()
    .where("RowNum", 1)
    .from("Recent_WorkItems")
    .orderBy("lastUpdated", "desc")
    .then((rows) => res.json(rows));
});

router.get("/lastUpdated", function (req, res, next) {
  database
    .select()
    .from("WorkItems")
    .limit(1)
    .then((rows) => res.json(rows))
    .catch(next);
});

router.get("/filters/names", function (req, res, next) {
  database
    .select("assignedTo")
    .from("WorkItems")
    .distinct()
    .then((rows) => res.json(rows))
    .catch(next);
});

module.exports = router;
