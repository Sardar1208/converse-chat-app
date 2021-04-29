import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from "react-router-dom";
import "./ChatHead.css";
import { AppContext } from "../../AppContext";

function ChatHead(props) {
  const history = useHistory();
  const [usersList, SetUsersList] = useState();
  const { contacts, setContacts, setCurrentContact, userSocket, currentContact } = useContext(AppContext);
  useEffect(async () => {

    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'get': "users",
      },
      body: JSON.stringify({
        reciever_mobile: sessionStorage.getItem("loggedInUser"),
      }),
    });
    //where sender_mobile="8459566516" and req_status="accepted"

    const result = await res.json();
    if (result.result != "failure") {
      console.log("the new result is::", result.result);

      const convoIds = result.result.map((i) => {
        return i.conversation_ID;
      })
      const res2 = await fetch("http://localhost:8080/get_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'get': "pending_messages",
        },
        body: JSON.stringify({
          conversation_IDs: convoIds,
          sender_ID: sessionStorage.getItem("loggedInUser"),
        }),
      });
      let result2 = await res2.json();
      
      //TODO - make the unreadmessages frontend

      const newResult = result.result;
      setContacts(newResult);
      console.log("contacts = ", contacts);
      if (result.result != "no users") {
        let List = newResult.map((user) => {

          // calculate the number of unread messages for the given contact and display it.
          let count = 0;
          for(let i of result2.result){
            if(i[0] && i[0].conversation_ID == user.conversation_ID){
              console.log("got it finally mf");
              count = i[0].unread_count;
            }
          }
          return (
            <div className="chat-head" onClick={() => { setCurrentContact(user); props.loadMessages(user.conversation_ID) }}>
              <div className="card-img">
                <img src="/images/pic_1.jpg" />
              </div>
              <div className="card-text">
                <div className ="text-body">
                  <h1>{user.name}</h1>
                  <span>
                    <img src="/svg/sent.svg" />
                  </span>
                  <h5>This is your last text...</h5>
                </div>
                <div className="unread">
                  <span>{count}</span>
                </div>
              </div>
              <hr />
            </div>
          );
        });
        SetUsersList(List);
      }
    }

  }, []);

  function openChat() { }

  return <div style={{ display: props.display }}>{usersList}</div>;
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
