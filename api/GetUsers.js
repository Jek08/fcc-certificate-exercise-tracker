const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "db", "users.json");

function getUsers() {
  let db;
  try {
    db = fs.readFileSync(dbPath, { encoding: "utf-8" });
  } catch (e) {
    console.log("Failed open db: ", e);
  }

  const data = JSON.parse(db);
  const users = data.users.map((user) => ({
    _id: user._id,
    username: user.username,
  }));

  return users;
}

module.exports = getUsers;