const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { query } = require("express");
const { v4: uuid } = require("uuid");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env, emit } = require("process");

// const { Socket } = require("dgram");
dotenv.config();
// const userSocketDB = require("./user-socket.js");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_Password,
  database: process.env.DB_Name,
});

const AvatarInitiator = () => {
  const values = ["A", "B", "C", "D", "E", "F"];
  const rno = Math.floor(Math.random() * 24) % 6;
  return values[rno];
};
console.log("db name", process.env.DB_Name);

db.connect((err) => {
  if (err) throw err;

  console.log("user socket database connected");
});

const app = express();

const server = http.createServer(app);

const jsonparser = bodyParser.json();
const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));

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

server.listen(process.env.PORT || 8080, () => {
  console.log("Server started on port " + process.env.PORT || "5000");
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
  });
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
        await doQuery(
          query,
          null,
          (result) => {
            console.log(
              "the current_char result is: ",
              result[0].current_chat,
              data.sender_ID
            );
            if (result[0].current_chat == data.sender_ID) {
              console.log("in here in here in here in here in here");
              const time = Date.now();
              socket.broadcast.to(`${data.recieverID}`).emit("incoming-text", {
                text: `${data.text}`,
                sender_ID: `${data.sender_ID}`,
                time: `${time}`,
                conversation_ID: `${data.conversation_ID}`,
              });
              const query = `insert into messages(msg, msg_time, conversation_ID, sender_ID) values ('${data.text}', '${time}', '${data.conversation_ID}', '${data.sender_ID}')`;
              doQuery(query, null, (result) => {
                console.log("saved");
                socket.emit("text-sent", {});
              });
            }
            // if online, sends the message directly.
            else {
              console.log("going into pending table...");
              const query = `insert into pending_queue(conversation_ID, msg, msg_time, sender_ID) values ('${
                data.conversation_ID
              }', '${data.text}', '${Date.now()}', '${data.sender_ID}')`;
              doQuery(query, null, (result) => {
                console.log("savedin pending table");
                socket.broadcast
                  .to(`${data.recieverID}`)
                  .emit("incoming-pending-text", {
                    info: "sending signal to user",
                  });
                socket.emit("text-sent", {});
              });
            }
          },
          "current_chat result: "
        );
        break;
      }
    }
    if (idFound == false) {
      console.log("going into pending table from 2...");
      const query = `insert into pending_queue(conversation_ID, msg, msg_time, sender_ID) values ('${
        data.conversation_ID
      }', '${data.text}', '${Date.now()}', '${data.sender_ID}')`;
      doQuery(query, null, (result) => {
        socket.emit("text-sent", {});
        console.log("savedin pending table");
      });
    }
  });

  socket.on("sending_request", (data) => {
    // console.log("new friend request: ", data);
    const query1 = `select mobile_no from users where mobile_no="${data.reciever_uniqueKey}" or username="${data.reciever_uniqueKey}"`;
    doQuery(query1, null, (result1) => {
      if (result1.length > 0) {
        const query = `select * from pendingrequests where sender_mobile='${data.sender_mobile}' and reciever_mobile='${result1[0].mobile_no}'`;
        doQuery(query, null, (result) => {
          if (result.length == 0) {
            const query = `insert into pendingrequests values("${data.sender_mobile}", "${result1[0].mobile_no}", "pending")`;
            doQuery(query);
            const query2 = `select socket_ID from users where mobile_no='${result1[0].mobile_no}'`;
            doQuery(query2, null, (result) => {
              // console.log("emmiting request to reciever with id: ", result[0]);
              socket.broadcast
                .to(`${result[0].socket_ID}`)
                .emit("recieving_request", data);
              socket.emit("request-sent", { info: "success" });
            });
          }
        });
      } else {
        socket.emit("request-sent", { info: "failure" });
      }
    });
  });
  socket.on("update_current_chat", (data) => {
    // console.log("called called called", data.contact_mobile, data.user_mobile);
    const query = `update users set current_chat="${data.contact_mobile}" where mobile_no="${data.user_mobile}"`;
    doQuery(query, null, null, "updatation done: ");
  });

  socket.on("unfriend", (data) => {
    const query = `select socket_ID,mobile_no from users where username="${data.unfriended_username}"`;
    doQuery(query, null, (result) => {
      const query2 = `delete from messages where conversation_ID="${data.conversation_ID}"`;
      doQuery(query2, null, (result2) => {
        const query3 = `delete from conversation where conversation_ID="${data.conversation_ID}"`;
        doQuery(query3, null, (result3) => {
          const query4 = `delete from pendingrequests where sender_mobile in("${data.mobile}", "${result[0].mobile_no}") and reciever_mobile in("${data.mobile}", "${result[0].mobile_no}")`;
          doQuery(query4, null, (result4) => {
            socket.broadcast
              .to(result[0].socket_ID)
              .emit("unfriended", { conversation_ID: data.conversation_ID });
            socket.emit("unfriend done", {
              conversation_ID: data.conversation_ID,
            });
          });
        });
      });
    });
  });

  socket.on("delete_request", (data) => {
    const { sender_mobile, reciever_mobile, socket_ID } = data;
    const query = `delete from pendingrequests where sender_mobile="${sender_mobile}" and reciever_mobile="${reciever_mobile}" and req_status="pending"`;
    doQuery(query, null, (result) => {
      const query2 = `select socket_ID from users where mobile_no="${reciever_mobile}"`;
      doQuery(query2, null, (result2) => {
        socket.broadcast
          .to(`${result2[0].socket_ID}`)
          .to(`${socket_ID}`)
          .emit("deleted active request", {
            info: "deleted active pendind request",
          });
        console.log("the deletion socket id: ", socket_ID);
        socket.emit("deleted active request", {
          info: "deleted active pendind request",
        });
      });
    });
  });

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

app.post("/login_user", authorize, async (req, res) => {
  console.log("req.body authorize: ", req.body);
  const query = `select * from users where username="${req.body.uniqueKey}" or mobile_no="${req.body.uniqueKey}"`;
  await doQuery(query, res, (result) => {
    // console.log("result from returned place: ", user);
    if (result.length != 0) {
      const query = `UPDATE users SET socket_ID="${req.body.socketID}", current_status="online" WHERE username="${req.body.uniqueKey}"  or mobile_no="${req.body.uniqueKey}"`;
      doQuery(query);
      res.json({
        result: "success",
        mobile: result[0].mobile_no,
        username: result[0].username,
        avatar: result[0].avatarFlag,
      });
    } else {
      res.json({ result: "new user" });
    }
  });
});

app.post("/signup", async (req, res) => {
  console.log("the signup body: ", req.body);
  const { fullName, username, email, mobile, password, socket_ID } = req.body;
  const AvatarFlag = AvatarInitiator();
  const query = `select username, email_ID, mobile_no from users where mobile_no="${mobile}" or username="${username}" or email_ID="${email}"`;
  doQuery(query, res, (result) => {
    if (result.length == 0) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          const query2 = `insert into users(email_ID, username, mobile_no, socket_ID, current_status, current_chat, pass, fullName,avatarFlag)
            values ('${email}', '${username}', '${mobile}', '${socket_ID}', 'offline', 'none', '${hash}', '${fullName}','${AvatarFlag}')`;
          doQuery(query2, res, (result2) => {
            res.json({ result: "success" });
          });
        });
      });
    } else {
      if (result && result[0].username == username) {
        res.json({ result: "username already exists" });
      } else if (result && result[0].email_ID == email) {
        res.json({ result: "An account with this email already exists" });
      } else if (result && result[0].mobile_no == mobile) {
        res.json({ result: "An account with this mobile no already exists" });
      }
    }
  });
});

function authorize(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.json({ result: "not authorized" });
  } else {
    jwt.verify(token, "access", (err, user) => {
      if (err) {
        console.log("token err: ", err);
        res.json({ result: "not authorized" });
      } else {
        console.log("token user: ", user);
        req.user = user;
        next();
      }
    });
  }
}

app.post("/signin", async (req, res) => {
  const { uniqueKey, password } = req.body;
  console.log("hulululululu: ", req.body);
  const query = `select pass,mobile_no,username from users where username='${uniqueKey}' or mobile_no='${uniqueKey}'`;
  doQuery(
    query,
    res,
    async (result) => {
      console.log("lulululululu: ", result);
      await bcrypt.compare(password, result[0]?.pass).then((bcrypt_result) => {
        if (bcrypt_result == true) {
          console.log("logged in");

          // authorize this user.
          const accessToken = jwt.sign({ user: result[0].username }, "access", {
            expiresIn: "1h",
          });
          console.log("authenticated");
          res.json({
            result: "success",
            accessToken: accessToken,
            mobile: result[0].mobile_no,
            username: result[0].username,
          });
        } else {
          //If the password is incorrect return to login page with error msg.
          console.log("incorrect credentials");
          res.json({ result: "failure" });
        }
      });
    },
    "database result: "
  );
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
    doQuery(
      query,
      res,
      (result) => {
        if (result.length != 0) {
          let users = result.map((item) => {
            if (item.sender_ID == req.body.reciever_mobile) {
              return item.reciever_ID;
            } else {
              return item.sender_ID;
            }
          });

          // from the above array, get their username.
          const query = `select username,mobile_no,avatarFlag from users where mobile_no in (${users})`;
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
                  // if(unread_count)
                  // const query2 = `select * from `

                  temp_detail.push({
                    name: i.username,
                    mobile: i.mobile_no,
                    conversation_ID: result[0].conversation_ID,
                    avatar: i.avatarFlag,
                    unread_count: "0",
                  });
                  if (temp_detail.length == theresult.length) {
                    res.json({ result: temp_detail });
                  }
                }
              });
            }
          });
        } else {
          res.json({ result: "no users" });
        }
      },
      "this is it"
    );
  } else if (req.headers.get == "socketID") {
    const query = `select socket_ID, current_chat from users WHERE mobile_no="${req.body.reciever_mobile}"`;
    doQuery(query, res, (result) => {
      res.json({
        result: "success",
        socket_ID: `${result[0].socket_ID}`,
        current_chat: `${result[0].current_chat}`,
      });
    });
  } else if (req.headers.get == "user_contact") {
    const query = `select Username from users where mobile_no="${req.body.mobile}"`;
    doQuery(query, res, (result) => {
      res.json({ result: result });
    });
  } else if (req.headers.get == "pending_requests") {
    const query = `select * from pendingrequests where (reciever_mobile="${req.body.mobile}" or sender_mobile="${req.body.mobile}") and req_status="pending"`;
    doQuery(query, res, (result) => {
      if (result.length > 0) {
        let numbers = [];
        for (let i of result) {
          if (!numbers.includes(i.sender_mobile)) {
            numbers.push(i.sender_mobile);
          }
          if (!numbers.includes(i.reciever_mobile)) {
            numbers.push(i.reciever_mobile);
          }
        }
        const query2 = `select fullName, mobile_no, avatarFlag from users where mobile_no in (${numbers})`;
        doQuery(query2, res, (result2) => {
          console.log("full names :", result2);
          res.json({ result: result, names: result2 });
        });
      } else {
        res.json({ result: result, names: [] });
      }
    });
  } else if (req.headers.get == "username") {
    const query = `select username from users where mobile_no="${req.body.mobile}"`;
    doQuery(query, res, (result) => {
      res.json({ result: "success", username: result });
    });
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
          console.log(
            "inserted pending messages to regular messages table successfully..."
          );

          // delete the pending messages
          const query4 = `delete from pending_queue where conversation_ID="${req.body.conversation_ID}"`;
          doQuery(query4);
        }
        res.json({
          result: "success",
          messages: result,
          pending_messages: result2,
        });
      });
    });
  } else if (req.headers.get == "pending_messages") {
    // console.log("pending messages to get are: ", req.body.conversation_IDs);
    let resultList = [];
    for (let id of req.body.conversation_IDs) {
      const query = `select count(*) as unread_count, conversation_ID from pending_queue where conversation_ID='${id}' and sender_ID not in('${req.body.sender_ID}') group by conversation_ID`;
      doQuery(
        query,
        res,
        (result) => {
          // let table = "pending_queue";
          // console.log("table: ". table);
          // console.log("id: ".id);
          const query2 = `select msg from pending_queue 
          where conversation_ID="${id}" 
          order by queue_ID desc limit 1`;

          doQuery(query2, res, async (result2) => {
            console.log("result2 is here: ", result2);
            if (result2[0]?.msg) {
              console.log("hulululululululu");
              const temp = {
                conversation_ID: id,
                unread_count: result[0] ? result[0].unread_count : "0",
                lastMessage: result2[0] ? result2[0].msg : null,
              };
              resultList.push(temp);
              if (req.body.conversation_IDs.length == resultList.length) {
                res.json({ result: resultList });
              }
            } else {
              console.log("halalalalalalalala");
              const query3 = `select msg from messages 
              where conversation_ID="${id}" 
              order by msg_ID desc limit 1`;

              await doQuery(query3, res, (result3) => {
                console.log("result3: ", result3);
                const temp = {
                  conversation_ID: id,
                  unread_count: result[0] ? result[0].unread_count : "0",
                  lastMessage: result3[0] ? result3[0].msg : null,
                };
                resultList.push(temp);
                console.log("result list from inside: ", resultList);
                if (req.body.conversation_IDs.length == resultList.length) {
                  res.json({ result: resultList });
                }
              });
            }

            console.log("resultList: ", resultList);
            // console.log("new whole array: ", temp);
          });
        },
        "the fukin result: "
      );
    }
  }
});

app.post("/respond_request", (req, res) => {
  const query = `update pendingrequests set req_status='${req.body.response}' where sender_mobile='${req.body.sender_mobile}' and reciever_mobile='${req.body.reciever_mobile}'`;
  doQuery(query, res);
  if (req.body.response == "accepted") {
    const id = uuid();
    const query = `insert into conversation values ('${id}', '${req.body.sender_mobile}', '${req.body.reciever_mobile}')`;
    doQuery(query, res, (result) => {
      res.json({ result: "success" });
    });
  }
});
