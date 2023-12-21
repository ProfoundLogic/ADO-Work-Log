const getProjectWorkItems = require("./ado/getProjectWorkItems.js");

test();
async function test() {
  const projectWorkItems = await getProjectWorkItems();
  console.log(projectWorkItems);
}
