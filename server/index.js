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

  socket.on("sending_request", (data) => {
    console.log("new friend request: ", data);
    const query = `select * from pendingrequests where sender_mobile='${data.sender_mobile}' and reciever_mobile='${data.reciever_mobile}'`;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);

      } else {
        console.log("adding request to db...");
        if (result.length == 0) {
          const query = `insert into pendingrequests values("${data.sender_mobile}", "${data.reciever_mobile}", "pending")`;
          db.query(query, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("inserted successfully");
              const query = `select socket_ID from users where mobile_no='${data.reciever_mobile}'`;
              db.query(query, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("emmiting request to reciever with id: ", result[0]);
                  socket.broadcast.to(`${result[0].socket_ID}`).emit("recieving_request", data);
                }
              })
            }
          })
        }
      }
    })

    // TODO - check if already sent request, if not add to db, get reciever socket id and emit to it.
    // TODO - can this be done in single query or not.



    // socket.broadcast.to()

    //add this to database
    //emit this to the reciever

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);
    });
  });

  app.get("/create", (req, res) => {
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
    const query = `select * from users where mobile_no="${req.body.mobile}"`;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.json({ result: "failure" });
      } else {
        if (result.length != 0) {
          console.log(result);
          const query = `UPDATE users SET socket_ID="${req.body.socketID}" WHERE mobile_no="${req.body.mobile}"`;
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
          console.log("query result: ", result);
          res.json({ result: "new user" });
        }
      }
    });
  });

  app.post("/user_details", (req, res) => {
    console.log("the reqbody: ", req.body);
    console.log("sdfsfs: ", parseInt(req.body.mobile));
    const query = `INSERT INTO users VALUES ('${req.body.email}','${req.body.username}','${req.body.mobile}', '${req.body.socket_ID}','offline')`;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.json({ result: "failure" });
      } else {
        res.json({ result: "success" });
        console.log("the later result: ", result)
      }
    })
  })

  app.post("/get_data", (req, res) => {
    console.log(req.headers.get);
    if (req.headers.get == "users") {
      const query = `select username from users
                    join pendingrequests
                    on pendingrequests.sender_mobile = users.mobile_no
                    where pendingrequests.reciever_mobile="${req.body.reciever_mobile}" and req_status="accepted"`;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.json({ result: "no users" });
        } else {
          let users = result.map((item) => {
            console.log("from map: ", item.username)
            return `${item.username}`;
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
    else if (req.headers.get == "user_contact") {
      const query = `select Username from users where mobile_no="${req.body.mobile}"`;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.json({ result: "failure" });
        } else {
          console.log("search result: ", result);
          res.json({ result: result });
        }
      })
    }
    else if (req.headers.get == "pending_requests") {
      const query = `select sender_mobile from pendingrequests where reciever_mobile="${req.body.mobile}" and req_status="pending"`;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.json({ result: "failure" });
        } else {
          console.log("requests pending: ", result);
          res.json({ result: result });
        }
      })
    }

  });

  app.post("/respond_request", (req, res) => {
    const query = `update pendingrequests set req_status='${req.body.response}' where sender_mobile='${req.body.sender_mobile}' and reciever_mobile='${req.body.reciever_mobile}'`
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.json({ result: "failure" });
      } else {
        console.log("responded to a request...");
        res.json({ result: "success" });
      }
    })
  })
})
