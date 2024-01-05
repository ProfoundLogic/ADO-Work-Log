const getProjectWorkItems = require("../ado/getProjectWorkItems");
const hasChangedItems = require("../ado/hasChangedItems.js");
const getProjectChildWorkItems = require("../ado/getProjectChildWorkItems.js");
const getWorkItemRevisions = require("../ado/getWorkItemRevisions.js");
const database = require("../db/database.js");

async function refreshWorkItems() {
  database.insert({
    name: "Work Items Refresh",
    description: "Refreshes the items in the Work Items table.",
    status: "In Progress",
  });

  const projectWorkItems = await getProjectWorkItems();

  database
    .insert(projectWorkItems)
    .into("WorkItems")
    .onConflict(["workItemId", "revision"])
    .ignore()
    .then((rows) => {});

  for (let projectWorkItem of projectWorkItems) {
    const hasChanged = await hasChangedItems(projectWorkItem);

    if (hasChanged) {
      const childWorkItems = await getProjectChildWorkItems(projectWorkItem);

      // Log the job in the jobs table
      let childWorkItemJobId;
      database
        .insert({
          name: `Work Item Refresh - ${projectWorkItem.workItemId}`,
          description: "",
          segments: childWorkItems.length,
        })
        .into("Jobs")
        .then((insertedIDs) => (childWorkItemJobId = insertedIDs[0]));

      for (const wi of childWorkItems) {
        const wiRevisions = await getWorkItemRevisions(wi.workItemId);

        const flattenedRevisions = wiRevisions.map((x) => {
          return {
            workItemId: x.id,
            revision: x.rev,
            title: x.fields["System.Title"],
            assignedTo:
              x.fields["System.AssignedTo"]?.displayName || "Unassigned",
            state: x.fields["System.State"],
            lastUpdated: x.fields["System.ChangedDate"],
            created: x.fields["System.CreatedDate"],
          };
        });

        database
          .insert(flattenedRevisions)
          .into("WorkItems")
          .onConflict(["workItemId", "revision"])
          .merge()
          .then((result) => {
            database
              .insert({ jobId: childWorkItemJobId })
              .into("Actions")
              .then((result) => {});
          });
      }
    }
  }
}

module.exports = refreshWorkItems;
