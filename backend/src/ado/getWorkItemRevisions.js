const needle = require("needle");

const httpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json-patch+json",
};

async function getWIRevisions(workItemId, top = 200, skip = 0) {
  const url = `https://dev.azure.com/ProfoundLogic/Transformation/_apis/wit/workItems/${workItemId}/revisions?$top=${top}&$skip=${skip}&api-version=7.2-preview.3`;

  let getWI = await needle("GET", url, httpOptions);

  if (!getWI.body) {
    console.log(getWI);
    throw new Error("getWIRevisions failed");
  } else {
    const revisions = getWI.body.value;

    if (revisions.length === top) {
      const nextRevisions = await getWIRevisions(workItemId, top, skip + top);
      return [...revisions, ...nextRevisions];
    } else {
      return revisions;
    }
  }
}

module.exports = getWIRevisions;
