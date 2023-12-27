const database = require("../db/database.js");
const needle = require("needle");
const getChildWorkItems = require("./getChildWorkItems.js");

const queryHttpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json",
};
const url = `https://dev.azure.com/ProfoundLogic/Transformation/_apis/wit/wiql?api-version=7.1-preview.2`;

if (queryHttpOptions.username == null || queryHttpOptions.password == null)
  console.error("Missing username or password", queryHttpOptions);

async function getProjectChildWorkItems(projectWorkItem) {
  let projectPath = projectWorkItem.areaPath.split("\\").slice(0, 2).join("\\");
  let customerPath = projectPath.replace("Transformation\\", "") + " Testing";

  const areaPaths = [projectPath, customerPath];

  const matrix = [];
  for (let areaPath of areaPaths) {
    let query = `Select [System.Id] From WorkItems Where [System.AreaPath] UNDER '${areaPath}' Order by [System.Id]`;

    const wis = await getChildWorkItems(query);
    matrix.push(...wis);
  }

  console.log(`Found ${matrix.length} work items. Flattening...`);

  const flattenedMatrix = matrix.map((x) => {
    return {
      workItemId: x.id,
      revision: x.rev,
      title: x.fields["System.Title"],
      assignedTo: x.fields["System.AssignedTo"]?.displayName || "Unassigned",
      state: x.fields["System.State"],
      lastUpdated: x.fields["System.ChangedDate"],
      created: x.fields["System.CreatedDate"],
    };
  });

  console.log("Fetching work item revisions...");

  const revisions = [];
  for (const wi of flattenedMatrix) {
    const wiRevisions = await azureInfo.getWIRevisions(wi.workItemId);
    revisions.push(wiRevisions);
  }

  console.log(`Flattening ${revisions.length} work item revisions...`);

  const cleanedRevisions = revisions.reduce((acc, cur) => {
    return [...acc, ...cur.value];
  }, []);

  console.log(`Cleaning work item revisions...`);

  const flattenedRevisions = cleanedRevisions.map((x) => {
    return {
      workItemId: x.id,
      revision: x.rev,
      title: x.fields["System.Title"],
      assignedTo: x.fields["System.AssignedTo"]?.displayName || "Unassigned",
      state: x.fields["System.State"],
      lastUpdated: x.fields["System.ChangedDate"],
      created: x.fields["System.CreatedDate"],
    };
  });

  console.log(`Returned ${flattenedRevisions.length} work item revisions.`);

  return flattenedRevisions;
}

module.exports = getProjectChildWorkItems;
