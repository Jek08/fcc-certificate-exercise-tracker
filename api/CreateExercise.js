const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "db", "users.json");

function createExercise(uid, description, duration, date) {
  let db;
  try {
    db = fs.readFileSync(dbPath, { encoding: "utf-8" });
  } catch (e) {
    console.log("Failed open db: ", e);
  }

  if (date === "") {
    date = new Date().toJSON().substring(0, 10);
  }
  
  const data = JSON.parse(db);
  data.users = data.users.map((user) => {
    if (parseInt(user._id) === uid && user.hasOwnProperty("logs")) {
      let exerciseLog = [...user.logs];
      let newExercise = {
        description,
        duration,
        date: new Date(date).toDateString(),
      };
      exerciseLog.push(newExercise);
      user.logs = exerciseLog;
      user.count += 1;
    } else {
      user.logs = [];
      user.logs.push({
        description,
        duration,
        date: new Date(date).toDateString(),
      });
      user.count = 1;
    }
    return user;
  });

  try {
    fs.writeFileSync(dbPath, JSON.stringify(data), "utf-8");
    console.log("User updated");
  } catch (e) {
    console.log("Failed write user update to db");
  }
  // return saved user with new exercise entry
  return data.users.find((user) => {
    return parseInt(user._id) === uid;
  });
}

module.exports = createExercise;
