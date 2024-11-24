const Lucy = require("./handlers/lucy.js");
require("dotenv").config();

const client = new Lucy({
  intents: 65043,
  prefix: "g.",
  developers: ["1005290241743143043", "967486659560079420"],
  token: process.env.token,
});
const { userDB } = require("./database");

client.userDB = userDB;
client.setup();

require('./handlers/slash.js')(client);
require('./handlers/prefix.js')(client);