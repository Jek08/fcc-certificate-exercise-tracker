const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "db", "users.json");

function getExerciseLogs(id, from, to) {
  let db;
  let data;
  try {
    db = fs.readFileSync(dbPath);
    data = JSON.parse(db);
  } catch (e) {
    console.log("Failed open db: ", e);
  }

  const newUser = data.users.find(
    (user) => parseInt(user._id) === parseInt(id)
  );
  if (!newUser) return console.log("user not found");

  let userExerciseLogs;
  if (from && to) {
    const fromIndex = newUser.logs.findIndex(
      (log) => Date(log.date) >= Date(from)
    );
    const toIndex = newUser.logs.findIndex((log) => Date(log.date) <= Date(to));
    userExerciseLogs = newUser.logs.slice(fromIndex, toIndex + 2);
    userExerciseLogs.sort((a, b) =>
      Date(a.date) < Date(b.date) ? -1 : Date(a.date) > Date(b.date) ? 1 : 0
    );
  } else {
    userExerciseLogs = newUser.logs.slice();
  }

  // format exercise logs to the desired result
  userExerciseLogs = userExerciseLogs.map((log) => ({
    description: log.description,
    duration: parseInt(log.duration),
    date: new Date(log.date).toDateString(),
  }));

  return {
    username: newUser.username,
    count: parseInt(newUser.count),
    _id: String(newUser._id),
    log: userExerciseLogs,
  };
}

module.exports = getExerciseLogs;
