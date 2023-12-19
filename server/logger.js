const localeInfo = Intl.DateTimeFormat().resolvedOptions();

module.exports = {
  log: (message, type = "log") => {
    console[type](
      new Date().toLocaleString(),
      localeInfo.timeZone,
      message,
      type !== "error" ? "" : new Error().stack
    );
  },
};
