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
      // console.log(`${log_msg}`, result);
      if (cb) {
        cb(result);
      }
    }
  })
}

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  // runs whenever a msg is sent
  // sends the msg to reciever if online otherwise, puts it in pending_queue

  // TODO - not working || rewrite this whole thing again
  socket.on("texty", async (data) => {
    console.log("text recieved: ", data);
    let idFound = false;

    // loops through all connected sockets and checks if the reciever is connected(online) or not.
    for (const [_, the_socket] of io.of("/").sockets) {
      console.log("conn sockets: ", _);
      if (_ == data.recieverID) {
        idFound = true;
        console.log("found");
        const query = `select current_chat from users where mobile_no="${data.reciever_mobile}"`;
        await doQuery(query, null, (result) => {
          console.log("the current_char result is: ",result[0].current_chat, data.sender_ID)
          if (result[0].current_chat == data.sender_ID) {
            console.log("in here in here in here in here in here");

            socket.broadcast.to(`${data.recieverID}`).emit("incoming-text", { text: `${data.text}`, sender_ID: `${data.sender_ID}` });
            const query = `insert into messages(msg, msg_time, conversation_ID, sender_ID) values ('${data.text}', '${Date.now()}', '${data.conversation_ID}', '${data.sender_ID}')`;
            doQuery(query, null, (result) => {
              console.log("saved");
            });
          }
          // if online, sends the message directly.
          else {
            console.log("going into pending table...");
            const query = `insert into pending_queue(conversation_ID, msg, msg_time, sender_ID) values ('${data.conversation_ID}', '${data.text}', '${Date.now()}', '${data.sender_ID}')`;
            doQuery(query, null, (result) => {
              console.log("savedin pending table");
              socket.broadcast.to(`${data.reciever_ID}`).emit("incoming-pending-text", {info: "sending signal to user"});
            })
          }
        }, "current_chat result: ");
        break;
      }
    }
    if (idFound == false) {
      console.log("going into pending table from 2...");
      const query = `insert into pending_queue(conversation_ID, msg, msg_time, sender_ID) values ('${data.conversation_ID}', '${data.text}', '${Date.now()}', '${data.sender_ID}')`;
      doQuery(query, null, (result) => {
        console.log("savedin pending table");
      })
    }
  })

  socket.on("sending_request", (data) => {
    // console.log("new friend request: ", data);
    const query = `select * from pendingrequests where sender_mobile='${data.sender_mobile}' and reciever_mobile='${data.reciever_mobile}'`;
    doQuery(query, null, (result) => {
      if (result.length == 0) {
        const query = `insert into pendingrequests values("${data.sender_mobile}", "${data.reciever_mobile}", "pending")`;
        doQuery(query);
        const query2 = `select socket_ID from users where mobile_no='${data.reciever_mobile}'`;
        doQuery(query2, null, (result) => {
          // console.log("emmiting request to reciever with id: ", result[0]);
          socket.broadcast.to(`${result[0].socket_ID}`).emit("recieving_request", data);
        })
      }
    })
  });
  socket.on("update_current_chat", (data) => {
    // console.log("called called called", data.contact_mobile, data.user_mobile);
    const query = `update users set current_chat="${data.contact_mobile}" where mobile_no="${data.user_mobile}"`;
    doQuery(query, null, null, "updatation done: ");
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
    // console.log("result from returned place: ", user);
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
  const query = `INSERT INTO users VALUES ('${req.body.email}','${req.body.username}','${req.body.mobile}', '${req.body.socket_ID}','offline','none')`;
  await doQuery(query, res);
  res.json({ result: "success" });
});

app.post("/get_data", (req, res) => {

  //returns the detailed list of all contacts in form (name, mobile, conversation_ID)
  if (req.headers.get == "users") {

    // get the list of all our contacts and make an array of their mobile numbers.
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

        // from the above array, get their username.
        const query = `select username,mobile_no from users where mobile_no in (${users})`;
        doQuery(query, res, async (theresult) => {
          let temp_detail = [];

          // traverse through the mobile number array, and get their conversation_ID
          for (let i of theresult) {
            const query = `select conversation_ID from conversation where sender_ID in (${req.body.reciever_mobile}, ${i.mobile_no}) and reciever_ID in (${req.body.reciever_mobile}, ${i.mobile_no})`;
            db.query(query, (err, result) => {
              if (err) {
                console.log(err);
              } else {

                // make a detailed array of each contact and return to the client
                temp_detail.push({ name: i.username, mobile: i.mobile_no, conversation_ID: result[0].conversation_ID, unread_count: '0' });
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
  // gets the past messages + pending messages(if any)
  // also transfers texts from pending_queue to messages table when seen.
  else if (req.headers.get == "messages") {

    // get all the past messages
    const query = `select * from messages where conversation_ID="${req.body.conversation_ID}"`;
    doQuery(query, res, (result) => {

      // get all the pending messages
      const query2 = `select * from pending_queue where conversation_ID="${req.body.conversation_ID}"`;
      doQuery(query2, res, (result2) => {

        //if you are the reciever of the pendding messages, make the transfer
        if (result2.length > 0 && result2[0].sender_ID != req.body.sender_ID) {
          const ms = result2.map((i) => {

            // insert the pending messages into the messages table
            const query3 = `insert into messages(conversation_ID, msg, msg_time, sender_ID) values ('${i.conversation_ID}', '${i.msg}', '${i.msg_time}', '${i.sender_ID}')`;
            doQuery(query3);
          });
          console.log("inserted pending messages to regular messages table successfully...");

          // delete the pending messages
          const query4 = `delete from pending_queue where conversation_ID="${req.body.conversation_ID}"`;
          doQuery(query4);
        }
        res.json({ result: "success", messages: result, pending_messages: result2 });
      })
    })
  }
  // bhosdiwala madarchod code
  else if (req.headers.get == "pending_messages") {
    // console.log("pending messages to get are: ", req.body.conversation_IDs);
    let resultList = [];
    for (id of req.body.conversation_IDs) {
      const query = `select count(*) as unread_count, conversation_ID from pending_queue where conversation_ID='${id}' and sender_ID not in('${req.body.sender_ID}') group by conversation_ID`;
      doQuery(query, res, (result) => {
        resultList.push(result);
        if (req.body.conversation_IDs.length == resultList.length) {
          console.log("resultList: ", resultList);
          res.json({ result: resultList });
        }
      }, "the fukin result: ")
    }
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

