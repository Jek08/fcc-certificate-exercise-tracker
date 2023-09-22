const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// import api
const createUser = require("./api/CreateUser.js");
const { createExercise, getUserExercise } = require("./api/CreateExercise.js");
const getExerciseLogs = require("./api/GetExerciseLogs.js");
const getUsers = require("./api/GetUsers.js");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(function(req,res,next){setTimeout(next,2000)});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", (req ,res) => {
  const users = getUsers();
  if (users) {
    res.status(200).json(users);
  } else {
    console.log("Users database is empty.");
    res.status(404);
  }
});

app.post("/api/users", (req, res) => {
  let newUser;
  try {
    newUser = createUser(req.body.username);
  } catch (e) {
    console.error(e);
  }
  res.status(200).json(newUser);
});

app.all("/api/users/:_id/exercises", (req, res) => {
  let result;
  if (req.method === "POST") {
    const userId = parseInt(req.params["_id"]);
    const description = req.body.description;
    const duration = req.body.duration;
    const date = req.body.date;
    result = createExercise(userId, description, duration, date);
    result = {
      _id: result._id,
      username: result.username,
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
      duration: parseInt(duration),
      description: description,
    };
    res.status(200).json(result);
  }
  if (req.method === "GET") {
    const user = getUserExercise(parseInt(req.params["_id"]));
    result = {
      _id: user._id,
      username: user.username,
      date: date ? new Date(date).toDateString() : new Date().toDateString(),
      duration: parseInt(duration),
      description: description,
    }
    res.status(200).json(result);
  }
});

// handle GET /api/users/:_id/logs?[from][&to][&limit]
app.get("/api/users/:_id/logs", (req, res) => {
  let fromDate = req.query.from;
  let toDate = req.query.to;
  let limit = req.query.limit;
  let id = req.params._id;
  let result = getExerciseLogs(id, fromDate, toDate, limit);

  if (!result) {
    res.status(400).json({ errorMsg: "Wrong from and to format" });
  }
  res.status(200).json(result);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
