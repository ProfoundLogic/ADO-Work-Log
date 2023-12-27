const needle = require("needle");
const getAllWorkItems = require("./getAllWorkItems.js");

const queryHttpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json",
};
const url = `https://dev.azure.com/ProfoundLogic/Transformation/_apis/wit/wiql?api-version=7.1-preview.2`;

// You are part way through converting buildMatrix to use this funciton instead. You need the queryWIs function from azureInfo.js to be able to do that.
async function getChildWorkItems(query, topCount) {
  let lastWorkItemID = 0;
  let done = false;
  let wiIds = [];
  topCount = topCount || 1000;

  do {
    let queryParts = query.split(/ Where /i);

    query =
      queryParts.shift() +
      ` WHERE [System.Id] > ${lastWorkItemID} ${
        !queryParts.length ? "" : "AND " + queryParts.join(" Where ")
      }`;

    let queryUrl = url + `&$top=${topCount}`;

    let queryWIs = await needle(
      "POST",
      queryUrl,
      JSON.stringify({ query }),
      queryHttpOptions
    );

    if (
      queryWIs &&
      queryWIs.body &&
      queryWIs.body.workItems &&
      queryWIs.body.workItems.length
    ) {
      for (let wi of queryWIs.body.workItems) {
        wiIds.push(wi.id);
        lastWorkItemID = wi.id;
      }
    } else {
      // If no further child items, exit
      if (queryWIs.body.workItems == null) {
        logger.log(queryWIs.body, "error");
      }

      done = true;
    }

    if (topCount == 1) {
      wiIds = wiIds[0];
      done = true;
    }
  } while (!done);

  console.log("Getting all child work items...");
  return await getAllWorkItems(wiIds);
}

module.exports = getChildWorkItems;
