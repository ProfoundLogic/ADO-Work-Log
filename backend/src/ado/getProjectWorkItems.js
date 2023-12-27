const needle = require("needle");
const getWorkItem = require("./getWorkItem.js");

const queryHttpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json",
};
const url = `https://dev.azure.com/ProfoundLogic/Transformation/_apis/wit/wiql?api-version=7.1-preview.2`;

if (queryHttpOptions.username == null || queryHttpOptions.password == null)
  console.error("Missing username or password", queryHttpOptions);

async function getProjectWorkItems() {
  let query = `Select [System.Id], [System.Title] From WorkItems Where [System.WorkItemType] = 'Application Project' AND [System.State] <> 'Closed' AND [Custom.Recalc] <> 'false' AND [System.AreaPath] UNDER 'Transformation' Order by [System.Id]`;

  return await needle("POST", url, JSON.stringify({ query }), queryHttpOptions)
    .then(async (res) => {
      const projectWorkItemPromises = res.body.workItems.map(async (wi) => {
        return await getWorkItem(wi.id);
      });

      const projectWorkItems = await Promise.all(projectWorkItemPromises).then(
        (values) => {
          return values;
        }
      );

      const cleanedRevisions = projectWorkItems.map((x) => {
        return {
          id: x.id,
          revision: x.rev,
          title: x.fields["System.Title"],
          assignedTo:
            x.fields["System.AssignedTo"]?.displayName || "Unassigned",
          state: x.fields["System.State"],
          lastUpdated: x.fields["System.ChangedDate"],
          created: x.fields["System.CreatedDate"],
          areaPath: x.fields["System.AreaPath"],
        };
      });

      return cleanedRevisions;
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = getProjectWorkItems;
