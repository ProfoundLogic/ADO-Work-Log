const needle = require("needle");
const database = require("../db/database");

getAllTimeCards();

async function getAllTimeCards() {
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
    .onConflict("id")
    .merge()
    .then((rows) => {
      console.log("Rows inserted: ", rows.length);
    });

  return processedCards;
}
