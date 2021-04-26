const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { query } = require("express");
const { v4: uuid } = require('uuid');
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

async function doQuery(query, res, cb, log_msg = "the result: ") {
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      if (res) {
        res.json({ result: "success" });
      }
    } else {
      console.log(`${log_msg}`, result);
      if (cb) {
        cb(result);
      }
    }
  })
}

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("texty", (data) => {
    console.log("text recieved: ", data);

    socket.broadcast.to(`${data.recieverID}`).emit("incoming-text", `${data.text}`);
  })

  socket.on("sending_request", (data) => {
    console.log("new friend request: ", data);
    const query = `select * from pendingrequests where sender_mobile='${data.sender_mobile}' and reciever_mobile='${data.reciever_mobile}'`;
    doQuery(query, null, (result) => {
      if (result.length == 0) {
        const query = `insert into pendingrequests values("${data.sender_mobile}", "${data.reciever_mobile}", "pending")`;
        doQuery(query);
        const query2 = `select socket_ID from users where mobile_no='${data.reciever_mobile}'`;
        doQuery(query2, null, (result) => {
          console.log("emmiting request to reciever with id: ", result[0]);
          socket.broadcast.to(`${result[0].socket_ID}`).emit("recieving_request", data);
        })
      }
    })

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
    const query = `select * from users where mobile_no="${req.body.mobile}"`;
    await doQuery(query, res, (user) => {
      console.log("result from returned place: ", user);
      if (user.length != 0) {
        const query = `UPDATE users SET socket_ID="${req.body.socketID}" WHERE mobile_no="${req.body.mobile}"`;
        doQuery(query);
        res.json({ result: "success" });
      } else {
        res.json({ result: "new user" });
      }
    });
  });

  app.post("/user_details", async (req, res) => {
    const query = `INSERT INTO users VALUES ('${req.body.email}','${req.body.username}','${req.body.mobile}', '${req.body.socket_ID}','offline')`;
    await doQuery(query, res);
    res.json({ result: "success" });
  });

  app.post("/get_data", (req, res) => {
    if (req.headers.get == "users") {
      const query = `select sender_ID, reciever_ID from conversation where sender_ID="${req.body.reciever_mobile}" or reciever_ID="${req.body.reciever_mobile}"`;
      doQuery(query, res, (result) => {
        if (result.length != 0) {
          let users = result.map((item) => {
            if (item.sender_ID == req.body.reciever_mobile) {
              return item.reciever_ID;
            } else {
              return item.sender_ID;
            }
          });
          const query = `select username from users where mobile_no in (${users})`;
          doQuery(query, res, (result) => {
            const list = result.map((i, index) => {
              return { name: i.username, mobile: users[index] }
            })
            res.json({ result: list });
          })
        } else{
          res.json({ result: "no users" });
        }
      })
    }
    else if (req.headers.get == "socketID") {
      const query = `select SocketID from UserSocketTable WHERE Username="${req.body.username}"`;
      doQuery(query, res, (result) => {
        res.json({ result: `${result[0].SocketID}` });
      })
    }
    else if (req.headers.get == "user_contact") {
      const query = `select Username from users where mobile_no="${req.body.mobile}"`;
      doQuery(query, res, (result) => {
        res.json({ result: result });
      })
    }
    else if (req.headers.get == "pending_requests") {
      const query = `select sender_mobile from pendingrequests where reciever_mobile="${req.body.mobile}" and req_status="pending"`;
      doQuery(query, res, (result) => {
        res.json({ result: result });
      })
    }
  });

  app.post("/respond_request", (req, res) => {
    const query = `update pendingrequests set req_status='${req.body.response}' where sender_mobile='${req.body.sender_mobile}' and reciever_mobile='${req.body.reciever_mobile}'`
    doQuery(query, res);
    if (req.body.response == "accepted") {
      const id = uuid();
      const query = `insert into conversation values ('${id}', '${req.body.sender_mobile}', '${req.body.reciever_mobile}')`;
      doQuery(query, res, (result) => {
        res.json({ result: "success" });
      })
    }
  })
});
