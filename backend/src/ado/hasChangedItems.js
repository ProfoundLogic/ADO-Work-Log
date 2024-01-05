const database = require("../db/database.js");
const needle = require("needle");

const queryHttpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json",
};
const url = `https://dev.azure.com/ProfoundLogic/Transformation/_apis/wit/wiql?api-version=7.1-preview.2`;

if (queryHttpOptions.username == null || queryHttpOptions.password == null)
  console.error("Missing username or password", queryHttpOptions);

async function hasChangedItems(projectWI) {
  const currentProjectWI = await database
    .select()
    .from("WorkItems")
    .where("workItemId", projectWI.workItemId)
    .first()
    .then((rows) => rows);

  let query = `Select [System.Id], [System.Title] From WorkItems Where [System.Id] <> ${
    currentProjectWI.workItemId
  } AND [System.TeamProject] = @project AND [System.AreaPath] UNDER 'Transformation' AND [System.ChangedDate] >= '${currentProjectWI.lastUpdated
    .split("T")
    .shift()}'`;

  return await needle("POST", url, JSON.stringify({ query }), queryHttpOptions)
    .then((response) => {
      return response.body.workItems.length > 0;
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = hasChangedItems;
