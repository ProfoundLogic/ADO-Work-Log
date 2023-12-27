const getProjectWorkItems = require("./ado/getProjectWorkItems.js");
const hasChangedItems = require("./ado/hasChangedItems.js");
const getProjectChildWorkItems = require("./ado/getProjectChildWorkItems.js");

test();

async function test() {
  const projectWorkItems = await getProjectWorkItems();

  for (let projectWorkItem of projectWorkItems) {
    const hasChanged = await hasChangedItems(projectWorkItem);

    if (hasChanged) {
      const childWorkItems = await getProjectChildWorkItems(projectWorkItem);

      console.log(childWorkItems);
    }
  }
}
