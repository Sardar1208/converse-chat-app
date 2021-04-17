import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from "react-router-dom";
import "./ChatHead.css";
import { AppContext } from "../../AppContext";

function ChatHead() {
  const history = useHistory();
  const [usersList, SetUsersList] = useState();
  const { contacts, setContacts, setCurrentContact, userSocket } = useContext(AppContext);
  useEffect(async () => {

    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'get': "users",
      },
    });

    const result = await res.json();
    const newResult = result.result.split(",");
    console.log(newResult);
    setContacts(newResult);
    console.log("contacts = ", contacts);
    if (result.result != "no users") {
      let List = newResult.map((user) => {
        return (
          <div className="chat-head" onClick={() => setCurrentContact(user)}>
            <div className="card-img">
              <img src="/images/pic_1.jpg" />
            </div>
            <div className="card-text">
              <h1>{user}</h1>
              <span>
                <img src="/svg/sent.svg" />
              </span>
              <h5>This is your last text...</h5>
            </div>
            <hr />
          </div>
        );
      });
      SetUsersList(List);
    }
  }, []);

  function openChat() { }

  return <div>{usersList}</div>;
}

export default ChatHead;

// create table conversation (
// 	conversation_ID varchar(20) not null,
//     sender_ID varchar(20)  not null,
//     reciever_ID varchar(20) not null,
//     primary key(conversation_ID)
// );

// create table message(
// 	msg_ID varchar(20) not null,
//     conversation_ID varchar(20),
//     msg varchar(255),
//     msg_time datetime,
//     constraint fk_conversation_ID foreign key(conversation_ID)
//     references conversation(conversation_ID),
//     sender_ID varchar(20)
// )

// insert into conversation(conversation_ID, sender_ID, reciever_ID) values
// ('ab','a','b'), ('cd','c','d'), ('ef','e','f')

// insert into message(msg_ID, conversation_ID, msg, msg_time, sender_ID) values
// ('1', 'ab', 'hello world', '1999-08-12', 'a')

// select * 
// from message
// inner join conversation
// on message.conversation_ID = conversation.conversation_ID
