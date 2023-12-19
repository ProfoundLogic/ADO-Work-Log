const needle = require("needle");
const logger = require("./logger.js");
const fs = require("fs").promises;

const apiVersion = "?api-version=6.0";
const httpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json-patch+json",
};
const queryHttpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json",
};

const organization = "ProfoundLogic";
const project = "Transformation";

const rootURL = `https://dev.azure.com/${organization}/${project}`;
const crudApiURL = `${rootURL}/_apis/wit/workitems/`;
const queryApiUrl = `${rootURL}/_apis/wit/wiql?api-version=7.1-preview.2`;
const deleteAPIUrl = `${rootURL}/_apis/wit/workitemsdelete${apiVersion}`;

const getWorkItems = crudApiURL + `${apiVersion}&$top=1000&ids=`;

module.exports = {
  apiVersion,
  httpOptions,
  queryHttpOptions,
  organization,
  project,
  rootURL,
  crudApiURL,
  queryApiUrl,
  getWorkItems,

  getWI,
  getWIRevisions,
  queryWIs,
  getAllWorkItems,
  updateWorkItem,
  createWorkItem,
  deleteWorkItems,
};

async function updateWorkItem(id, parms) {
  if (!Array.isArray(parms)) parms = turnFieldsObjectIntoParms(parms);

  let updateUrl = crudApiURL + `${id}${apiVersion}`;
  let updateWI = await needle(
    "PATCH",
    updateUrl,
    JSON.stringify(parms),
    httpOptions
  );
  if (!updateWI.body.id) logger.log(updateWI.body, "error");
  return updateWI.body;
}

async function getWI(id) {
  let getUrl = crudApiURL + `${id}${apiVersion}`;

  let getWI = await needle("GET", getUrl, httpOptions);
  if (!getWI.body.id) logger.log(getWI.body, "error");
  return getWI.body;
}

async function getWIRevisions(id) {
  const getUrl = `${rootURL}/_apis/wit/workItems/${id}/revisions?api-version=7.1-preview.3`;

  let getWI = await needle("GET", getUrl, httpOptions);
  if (!getWI.body) logger.log(getWI.body, "error");
  return getWI.body;
}

async function queryWIs(query, topCount, justIDs, includeRelationships = true) {
  if (typeof justIDs != "boolean") justIDs = false;
  if (typeof includeRelationships != "boolean") includeRelationships = true;

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

    let queryUrl = queryApiUrl + `&$top=${topCount}`;
    console.log(queryHttpOptions);
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
      if (queryWIs.body.workItems == null) logger.log(queryWIs.body, "error");
      done = true;
    }

    if (topCount == 1) {
      wiIds = wiIds[0];
      done = true;
    }
  } while (!done);

  if (justIDs) return wiIds;

  return await getAllWorkItems(wiIds, includeRelationships);
}

async function getAllWorkItems(wiIds, includeRelationships = true) {
  if (typeof includeRelationships != "boolean") includeRelationships = true;

  let isArray = Array.isArray(wiIds);

  if (!isArray) wiIds = [wiIds];

  let allWI = [];
  do {
    let batch = wiIds.splice(0, 100);
    let getWorkItemsUrl = getWorkItems + batch.join(",");
    if (includeRelationships) getWorkItemsUrl += "&$expand=relations";
    let queryWIs = await needle("GET", getWorkItemsUrl, httpOptions);
    if (
      queryWIs &&
      queryWIs.body &&
      queryWIs.body.value &&
      queryWIs.body.value.length
    )
      allWI.push(...queryWIs.body.value);
  } while (wiIds.length);

  return !isArray ? allWI[0] : allWI;
}

async function createWorkItem(parms) {
  let createURL = crudApiURL + "$" + parms["System.WorkItemType"] + apiVersion;

  if (!Array.isArray(parms)) parms = turnFieldsObjectIntoParms(parms);

  let createWI = await needle(
    "POST",
    createURL,
    JSON.stringify(parms),
    httpOptions
  );
  if (!createWI.body || !createWI.body.id) logger.log(createWI.body, "error");

  return createWI.body;
}

async function deleteWorkItems(ids, destroy) {
  if (!Array.isArray(ids)) ids = [ids];
  let parms = {
    ids: ids,
    destroy: destroy,
    skipNotifications: true,
  };

  let deleteWIs = await needle(
    "POST",
    deleteAPIUrl,
    JSON.stringify(parms),
    httpOptions
  );
  if (deleteWIs.errorCode) logger.log(deleteWIs.body, "error");

  return destroy ? null : deleteWIs.body;
}

function turnFieldsObjectIntoParms(fields) {
  let parms = [];
  for (let prop in fields) {
    if (prop == "/relations/-") {
      if (!Array.isArray(fields[prop])) fields[prop] = [fields[prop]];
      for (let value of fields[prop])
        parms.push({ op: "add", path: prop, value: value });
    } else if (prop == "System.Tags")
      parms.push({
        op: "replace",
        path: `/fields/${prop}`,
        value: fields[prop],
      });
    else {
      parms.push({ op: "add", path: `/fields/${prop}`, value: fields[prop] });
    }
  }
  return parms;
}
