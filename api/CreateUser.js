const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "db", "users.json");

function createUser(username) {
  let db;
  try {
    db = fs.readFileSync(dbPath, { encoding: "utf-8", flag: "r" });
  } catch (e) {
    console.log("Failed open db: ", e);
  }

  // if db is empty, create new users array property
  if (db === "") {
    db += '{"users": []}';
    fs.writeFileSync(dbPath, db, "utf-8");
  }
  const data = JSON.parse(db);
  const dataLen = data.users.length;
  const newUser = {
    _id: String(dataLen),
    username: username,
  };
  data.users.push(newUser);

  try {
    fs.writeFileSync(dbPath, JSON.stringify(data), "utf-8");
    console.log("Added new user");
  } catch (e) {
    throw e;
  }

  return newUser;
}

module.exports = createUser;
