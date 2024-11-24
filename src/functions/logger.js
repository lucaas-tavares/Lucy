const logger = {
    info: (message) => console.log(colorize(`#green[INFO]: ${message}`)),
    error: (message) => console.error(colorize(`#red[ERROR]: ${message}`)),
    warn: (message) => console.warn(colorize(`#yellow[WARN]: ${message}`)),
};

module.exports = logger;
