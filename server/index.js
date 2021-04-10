const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { query } = require("express");
dotenv.config();
// const userSocketDB = require("./user-socket.js");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_Password,
  database: process.env.DB_Name,
});

db.connect((err) => {
  if (err) throw err;

  console.log("user socket database connected");
});

const app = express();

const server = http.createServer(app);

const jsonparser = bodyParser.json();

app.use(jsonparser);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

server.listen(8080, () => {
  console.log("Server started on port 8080");
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("texty", (data) => {
    console.log("text recieved: ", data);
    socket.broadcast.to(`${data.recieverID}`).emit("incoming-text", `${data.text}`);
  })

  socket.on("disconnect", () => {
    console.log("client disconnected", socket.id);
  });
});

app.get("/create", (req, res) => {
  // const sql = 'CREATE DATABASE userSocket';
  // db.query(sql, (err, result) => {
  //     if (err)
  //     throw err;

  //     console.log(result);
  //     res.send("database created");
  // })

  const sql =
    "CREATE TABLE UserSocketTable (Username varchar(255), SocketID varchar(255))";
  userSocketDB.query(sql, (err, result) => {
    if (err) throw err;

    console.log(result);
    res.send("table created");
  });
});

app.post("/login_user", async (req, res) => {
  console.log(req.body);
  const query = `select * from UserSocketTable where Username="${req.body.username}"`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ result: "failure" });
    } else {
      if (result.length != 0) {
        console.log(result);
        const query = `UPDATE UserSocketTable SET SocketID="${req.body.socketID}" WHERE Username="${req.body.username}"`;
        db.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.json({ result: "failure" });
          } else {
            console.log(result);
            res.json({ result: "success" });
          }
        });
      } else {
        const query = `INSERT INTO UserSocketTable VALUES ("${req.body.username}", "${req.body.socketID}")`;
        db.query(query, (err, result) => {
          if (err) {
            console.log(err);
            res.json({ result: "failure" });
          } else {
            console.log(result);
            res.json({ result: "success" });
          }
        });
      }
    }
  });
  // TODO - ADD sql query for creating a table and saving values to it.
});

app.post("/get_data", (req, res) => {
  console.log(req.headers.get);
  if (req.headers.get == "users") {
    const query = "SELECT Username FROM UserSocketTable";
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.json({ result: "no users" });
      } else {
        let users = result.map((item) => {
          // console.log("from map: ", item.Username)
          return `${item.Username}`;
        });
        res.json({ result: `${users}` });
      }
    });
  }
  else if (req.headers.get == "socketID") {
    const query = `select SocketID from UserSocketTable WHERE Username="${req.body.username}"`;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.json({ result: "not found" });
      } else {
        console.log(result);
        res.json({ result: `${result[0].SocketID}` });
      }
    });
  }
});
//select * from UserSocketTable where Username="sarthak"
//INSERT INTO UserSocketTable VALUES ("Sarthak", "sd34sdf34242aAASD")
//UPDATE UserSocketTable
//SET Username="Rohit"
//WHERE SocketID="sd34sdf34242aAASD"
