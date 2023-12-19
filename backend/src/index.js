const app = require("./server");
const { port } = require("./config");
const cron = require("node-cron");

const server = app.listen(port, function () {
  console.log("Webserver is ready");
});

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// shut down server
// need in docker container to properly exit
function shutdown() {
  server.close(function onServerClosed(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
}

console.log("Scheduling cron job...");
cron.schedule("0 * * * *", () => {
  collectWorkItems();
});
