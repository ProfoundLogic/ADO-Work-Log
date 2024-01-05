const needle = require("needle");
const database = require("../db/database");

async function getAllTimeCards() {
  let childWorkItemJobId;
  database
    .insert({
      name: `Time Card Refresh`,
      description: "Daily timecard fetch",
      segments: 1,
    })
    .into("Jobs")
    .then((insertedIDs) => (childWorkItemJobId = insertedIDs[0]));

  const queryHttpOptions = {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
    content_type: "application/json",
  };

  const url =
    "https://extmgmt.dev.azure.com/ProfoundLogic/_apis/ExtensionManagement/InstalledExtensions/TechsBCN/DevOps-TimeLog/Data/Scopes/Default/Current/Collections/TimeLogData/Documents";

  let timeCards = await needle("GET", url, queryHttpOptions);

  if (timeCards.body.value == null) {
    console.error("No time cards found.");
    return;
  }

  timeCards = timeCards.body.value;

  const processedCards = timeCards.map((timeCard) => {
    return {
      timeCardId: timeCard.id,
      workItemId: timeCard.workItemId,
      user: timeCard.user,
      minutesLogged: timeCard.time,
      description: timeCard.notes.slice(0, 255),
      created: timeCard.date,
    };
  });

  database
    .insert(processedCards)
    .into("TimeCards")
    .onConflict("timeCardId")
    .ignore()
    .then((rows) => {
      database
        .insert({ jobId: childWorkItemJobId })
        .into("Actions")
        .then((rows) => {});
    });

  return processedCards;
}

module.exports = getAllTimeCards;
