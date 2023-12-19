#!/usr/bin/env node
const fs = require("fs").promises;
const azureInfo = require("./azureInfo.js");
const cron = require("node-cron");
const allWorkItemsUnderAreaPath = "Transformation";

process.env.TZ = "UTC";

collectWorkItems();

function collectWorkItems() {
  getAllProjectWIs().then(async (projectWIs) => {
    const projectWIRevisions = [];
    for (let projectWI of projectWIs) {
      let hasChanges = await hasChangedItems(projectWI);

      if (hasChanges) {
        const matrix = await buildMatrix(projectWI);

        projectWIRevisions.push(...matrix);
      }
    }

    console.log("Writing to file...");
    await fs.writeFile(
      `./all_cleaned.json`,
      JSON.stringify(projectWIRevisions, null, 2)
    );
  });
}

// console.log("Scheduling cron job...");
// cron.schedule("0 * * * *", () => {
//   console.log("Fetching work items...");
//   collectWorkItems();
// });

async function getAllProjectWIs() {
  let projectWIs = null;
  let query = `Select [System.Id], [System.Title] From WorkItems Where [System.WorkItemType] = 'Application Project' AND [System.State] <> 'Closed' AND [Custom.Recalc] <> 'false' AND [System.AreaPath] UNDER '${allWorkItemsUnderAreaPath.trim()}' Order by [System.Id]`;
  projectWIs = await azureInfo.queryWIs(query, null, null, false);

  return projectWIs;
}

async function hasChangedItems(projectWI) {
  let now = new Date().toJSON().split("T").shift();

  let lastSync = projectWI.fields["Custom.LastSyncDateTime"];

  if (lastSync) lastSync = lastSync.split("T").shift();

  let projectPath = projectWI.fields["System.AreaPath"]
    .split("\\")
    .slice(0, 2)
    .join("\\");

  let query = `Select [System.Id], [System.Title] From WorkItems Where [System.Id] <> ${projectWI.id} AND [System.TeamProject] = @project AND [System.AreaPath] UNDER '${projectPath}'`;

  if (lastSync) query += ` AND [System.ChangedDate] >= '${lastSync}'`;

  let lastChangedWI = await azureInfo.queryWIs(query, 1, true);

  if (!lastChangedWI)
    if (lastSync != now) {
      let updatePJWI = [
        { op: "add", path: "/fields/Custom.LastSyncDateTime", value: now },
      ];
      await azureInfo.updateWorkItem(projectWI.id, updatePJWI);
    }
  return lastChangedWI != null;
}

async function buildMatrix(projectWI) {
  let projectPath = projectWI.fields["System.AreaPath"]
    .split("\\")
    .slice(0, 2)
    .join("\\");
  let customerPath = projectPath.replace("Transformation\\", "") + " Testing";

  const areaPaths = [projectPath, customerPath];

  const matrix = [];
  for (let areaPath of areaPaths) {
    let query = `Select [System.Id] From WorkItems Where [System.AreaPath] UNDER '${areaPath}' Order by [System.Id]`;

    const wis = await azureInfo.queryWIs(query);
    matrix.push(...wis);
  }

  for (let idx = 0; idx < matrix.length; idx++) {
    let wi = matrix[idx];

    let item = (matrix[idx] = { wi, id: wi.id });
    if (wi.relations) {
      let childrenLinks = wi.relations.filter(
        (i) => i.rel == "System.LinkTypes.Hierarchy-Forward"
      );
      if (childrenLinks.length) {
        item.children = [];
        for (let link of childrenLinks)
          item.children.push(Number(link.url.split("/").pop()));
      }
      let predecessorLinks = wi.relations.filter(
        (i) => i.rel == "System.LinkTypes.Dependency-Reverse"
      );
      if (predecessorLinks.length) {
        item.predecessors = [];
        for (let link of predecessorLinks)
          item.predecessors.push(Number(link.url.split("/").pop()));
      }
      let successorLinks = wi.relations.filter(
        (i) => i.rel == "System.LinkTypes.Dependency-Forward"
      );
      if (successorLinks.length) {
        item.successors = [];
        for (let link of successorLinks)
          item.successors.push(Number(link.url.split("/").pop()));
      }
    }
  }

  const oneWeekAgo = getOneWorkWeekAgo();

  const flattenedMatrix = matrix
    .map((x) => {
      return {
        id: x.id,
        revision: x.wi.rev,
        title: x.wi.fields["System.Title"],
        assignedTo:
          x.wi.fields["System.AssignedTo"]?.displayName || "Unassigned",
        state: x.wi.fields["System.State"],
        lastUpdated: x.wi.fields["System.ChangedDate"],
        created: x.wi.fields["System.CreatedDate"],
      };
    })
    .filter((x) => {
      return new Date(x.lastUpdated) > oneWeekAgo;
    });

  const revisions = [];
  for (const wi of flattenedMatrix) {
    const wiRevisions = await azureInfo.getWIRevisions(wi.id);
    revisions.push(wiRevisions);
  }

  const cleanedRevisions = revisions.reduce((acc, cur) => {
    return [...acc, ...cur.value];
  }, []);

  const flattenedRevisions = cleanedRevisions
    .map((x) => {
      return {
        id: x.id,
        revision: x.rev,
        title: x.fields["System.Title"],
        assignedTo: x.fields["System.AssignedTo"]?.displayName || "Unassigned",
        state: x.fields["System.State"],
        lastUpdated: x.fields["System.ChangedDate"],
        created: x.fields["System.CreatedDate"],
      };
    })
    .filter((x) => {
      return new Date(x.lastUpdated) > oneWeekAgo;
    });

  return flattenedRevisions;
}

function getOneWorkWeekAgo() {
  let date = new Date();
  let dayOfWeek = date.getDay();
  let daysToSubtract = 5;

  // Subtract the number of weekends
  let weekends = Math.floor(daysToSubtract / 5) * 2;
  if (dayOfWeek - (daysToSubtract % 5) < 1) weekends += 2;

  date.setDate(date.getDate() - daysToSubtract - weekends);
  return date;
}

module.exports = {
  collectWorkItems,
};
