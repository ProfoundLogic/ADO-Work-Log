const needle = require("needle");

const httpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json",
};

const url = `https://dev.azure.com/ProfoundLogic/Transformation/_apis/wit/workitems/?api-version=6.0&$top=1000&ids=`;

async function getAllWorkItems(wiIds) {
  let isArray = Array.isArray(wiIds);

  if (!isArray) wiIds = [wiIds];

  let allWI = [];
  do {
    let batch = wiIds.splice(0, 100);
    let getWorkItemsUrl = url + batch.join(",") + "&$expand=relations";
    let queryWIs = await needle("GET", getWorkItemsUrl, httpOptions);

    if (
      queryWIs &&
      queryWIs.body &&
      queryWIs.body.value &&
      queryWIs.body.value.length
    ) {
      allWI.push(...queryWIs.body.value);
    } else {
      console.log("No more work items found.");
    }
  } while (wiIds.length);

  return !isArray ? allWI[0] : allWI;
}

module.exports = getAllWorkItems;
