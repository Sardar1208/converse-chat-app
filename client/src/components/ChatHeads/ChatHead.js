import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from "react-router-dom";
import "./ChatHead.css";
import { AppContext } from "../../AppContext";

export async function getUnreadCount(conversationIds, setUnreadCount) {
  console.log("running getunreadcount");
  const res2 = await fetch("http://localhost:8080/get_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'get': "pending_messages",
    },
    body: JSON.stringify({
      conversation_IDs: conversationIds,
      sender_ID: sessionStorage.getItem("loggedInMobile"),
    }),
  });

  const result2 = await res2.json();

  let tempObj = {};
  for (let i of result2.result) {
    if (i && i.length > 0) {
      console.log("this is i here: ", i[0].unread_count);
      console.log("hihi");
      // let temp = [...unreadCount, { unread_count: i[0].unread_count, conversation_ID: i[0].conversation_ID }];
      const temp = tempObj;
      temp[i[0].conversation_ID] = i[0].unread_count;
      tempObj = temp;
      // setUnreadCount(temp);
    }
  }
  console.log("the new state: ", tempObj);
  setUnreadCount(tempObj);
}

function ChatHead(props) {
  const history = useHistory();
  const [usersList, SetUsersList] = useState();
  // const [unreadCount, setUnreadCount] = useState({});
  // const [conversationIds, setConversationIds] = useState([]);
  const { contacts, setContacts, setCurrentContact, userSocket, currentContact, unreadCount, setUnreadCount, conversationIds, setConversationIds } = useContext(AppContext);



  useEffect(async () => {
    console.log("getting contacts");
    // userSocket.on("incoming-pending-text", (data) => {
    //   //TODO - this signal is not working fix this
    //   // TODO - re render chat head on this signal
    //   console.log("got it hululululu");
    //   // setPending_text_in(!pending_text_in);
    // })


    //get all the contacts
    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'get': "users",
      },
      body: JSON.stringify({
        reciever_mobile: sessionStorage.getItem("loggedInMobile"),
      }),
    });

    const result = await res.json();
    setContacts(result.result);
    if (result.result != "no users") {
      console.log("the new result is::", result.result);

      const convoIds = result.result.map((i) => {
        return i.conversation_ID;
      })

      setConversationIds(convoIds);
    }
  }, []);

  useEffect(() => {
    console.log("getting unread count");
    getUnreadCount(conversationIds, setUnreadCount);
  }, [conversationIds, props.commonMsg])

  useEffect(() => {
    console.log("making final list", contacts);
    if (contacts.length > 0 && contacts != "no users") {
      console.log("why in there")
      let list = contacts.map((user) => {
        console.log("dog cat: ", unreadCount['d23febf4-9cb1-49cc-a35d-6f10a61172b3']);
        return (
          <div className="chat-head" onClick={() => { setCurrentContact(user); props.loadMessages(user.conversation_ID); openChat(user.mobile); }}>
            <div className="card-img">
              <img src="/images/pic_1.jpg" />
            </div>
            <div className="card-text">
              <div className="text-body">
                <h1>{user.name}</h1>
                <span>
                  <img src="/svg/sent.svg" />
                </span>
                <h5>This is your last text...</h5>
              </div>
            </div>
            <div className="unread">
              <div>
                <span>{unreadCount[`${user.conversation_ID}`] ? unreadCount[`${user.conversation_ID}`] : ""}</span>
              </div>
            </div>
            <hr />
          </div>
        );
      });
      SetUsersList(list);

    }
  }, [unreadCount, setUnreadCount])


  function openChat(mobile) {
    console.log("this has to be updated: ", mobile)
    userSocket.emit("update_current_chat", { user_mobile: sessionStorage.getItem("loggedInMobile"), contact_mobile: mobile });
  }

  return <div style={{ display: props.display }}>{usersList}</div>;
}

export default ChatHead;
