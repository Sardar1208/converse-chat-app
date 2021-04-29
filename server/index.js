const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { query } = require("express");
const { v4: uuid } = require('uuid');
// const { Socket } = require("dgram");
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

  // runs whenever a msg is sent
  // sends the msg to reciever if online otherwise, puts it in pending_quere
  socket.on("texty", (data) => {
    console.log("text recieved: ", data);
    let idFound = false;

    // loops through all connected sockets and checks if the reciever is connected(online) or not.
    for (const [_, socket] of io.of("/").sockets) {
      console.log("conn sockets: ", _);
      if (_ == data.recieverID) {
        console.log("found");
        idFound = true;
      }
    }
    // if online, sends the message directly.
    if (idFound == true) {
      socket.broadcast.to(`${data.recieverID}`).emit("incoming-text", { text: `${data.text}`, sender_ID: `${data.sender_ID}` });
      const query = `insert into messages(msg, msg_time, conversation_ID, sender_ID) values ('${data.text}', '${Date.now()}', '${data.conversation_ID}', '${data.sender_ID}')`;
      doQuery(query, null, (result) => {
        console.log("saved");
      })
      // if offline, saves the message in the pending_queue table.
    } else {
      console.log("going into pending table...");
      const query = `insert into pending_queue(conversation_ID, msg, msg_time, sender_ID) values ('${data.conversation_ID}', '${data.text}', '${Date.now()}', '${data.sender_ID}')`;
      doQuery(query, null, (result) => {
        console.log("savedin pending table");
      })
    }
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
      console.log("client disconnected");
      // const query = `UPDATE users SET current_status="offline" WHERE socket_ID="${socket.id}"`;
      // doQuery(query); 
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
        const query = `UPDATE users SET socket_ID="${req.body.socketID}", current_status="online" WHERE mobile_no="${req.body.mobile}"`;
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
      const query = `select * from conversation where sender_ID="${req.body.reciever_mobile}" or reciever_ID="${req.body.reciever_mobile}"`;
      doQuery(query, res, (result) => {
        if (result.length != 0) {
          let users = result.map((item) => {
            if (item.sender_ID == req.body.reciever_mobile) {
              return item.reciever_ID;
            } else {
              return item.sender_ID;
            }
          });
          const query = `select username,mobile_no from users where mobile_no in (${users})`;
          doQuery(query, res, async (theresult) => {
            let temp_detail = [];
            for (let i of theresult) {
              const query = `select conversation_ID from conversation where sender_ID in (${req.body.reciever_mobile}, ${i.mobile_no}) and reciever_ID in (${req.body.reciever_mobile}, ${i.mobile_no})`;
              db.query(query, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  temp_detail.push({ name: i.username, mobile: i.mobile_no, conversation_ID: result[0].conversation_ID });
                  // console.log("for loop  gives us: ", temp_detail);
                  if (temp_detail.length == theresult.length) {
                    res.json({ result: temp_detail });
                  }
                }
              })
            }
          })
        } else {
          res.json({ result: "no users" });
        }
      }, "this is it")
    }
    else if (req.headers.get == "socketID") {
      const query = `select socket_ID from users WHERE mobile_no="${req.body.reciever_mobile}"`;
      doQuery(query, res, (result) => {
        res.json({ result: `${result[0].socket_ID}` });
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
    else if (req.headers.get == "messages") {
      const query = `select * from messages where conversation_ID="${req.body.conversation_ID}"`;
      doQuery(query, res, (result) => {
        // res.json({ result: result });
        const query2 = `select * from pending_queue where conversation_ID="${req.body.conversation_ID}"`;
        doQuery(query2, res, (result2) => {
          console.log("this is result2: ", result2.length);
          if (result2.length > 0 && result2[0].sender_ID != req.body.sender_ID) {
            const ms = result2.map((i) => {
              const query3 = `insert into messages(conversation_ID, msg, msg_time, sender_ID) values ('${i.conversation_ID}', '${i.msg}', '${i.msg_time}', '${i.sender_ID}')`;
              doQuery(query3);
            });
            console.log("inserted pending messages to regular messages table successfully...");
            const query4 = `delete from pending_queue where conversation_ID="${req.body.conversation_ID}"`;
            doQuery(query4);
            console.log("this is ms: ", ms[0]);
          }
          res.json({ result: "success", messages: result, pending_messages: result2 });
        })
        //TODO elete the entries from pending_queue.

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
