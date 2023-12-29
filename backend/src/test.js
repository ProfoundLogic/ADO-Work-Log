const database = require("./db/database");
const getProjectWorkItems = require("./ado/getProjectWorkItems.js");
const hasChangedItems = require("./ado/hasChangedItems.js");
const getProjectChildWorkItems = require("./ado/getProjectChildWorkItems.js");
const getWorkItemRevisions = require("./ado/getWorkItemRevisions.js");

test();

async function test() {
  const projectWorkItems = await getProjectWorkItems();

  for (let projectWorkItem of projectWorkItems) {
    const hasChanged = await hasChangedItems(projectWorkItem);

    if (hasChanged) {
      const childWorkItems = await getProjectChildWorkItems(projectWorkItem);

      console.log("Fetching work item revisions...");

      for (const wi of childWorkItems) {
        const wiRevisions = await getWorkItemRevisions(wi.workItemId);
        console.log(`Flattening ${wiRevisions.length} work item revisions...`);

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

        console.log(
          `Inserting ${flattenedRevisions.length} work item revisions.`
        );

        database
          .insert(flattenedRevisions)
          .into("WorkItems")
          .onConflict("workItemId")
          .merge()
          .then((rows) => {
            console.log("Rows inserted: ", rows.length);
          });
      }
    }
  }
}
