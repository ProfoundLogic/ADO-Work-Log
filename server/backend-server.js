const express = require("express");
const cors = require("cors");
const { collectWorkItems } = require("./getLastDayWorkItems.js");

const app = express();
const PORT = 3001; // Define the port for your proxy server

app.use(cors());

app.get("/", (req, res) => {
  console.log("Submitting manual refresh request...");
  collectWorkItems();
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
