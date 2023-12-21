const needle = require("needle");

const queryHttpOptions = {
  username: process.env.REACT_APP_USERNAME,
  password: process.env.REACT_APP_PASSWORD,
  content_type: "application/json",
};

if (queryHttpOptions.username == null || queryHttpOptions.password == null)
  console.error("Missing username or password", queryHttpOptions);

async function getWorkItem(workItemID) {
  const url = `https://dev.azure.com/ProfoundLogic/Transformation/_apis/wit/workitems/${workItemID}?api-version=6.0`;

  return await needle("GET", url, queryHttpOptions)
    .then((res) => {
      return res.body;
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = getWorkItem;
