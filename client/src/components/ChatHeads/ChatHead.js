import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link,
} from "react-router-dom";
import "./ChatHead.css";
import { scroll } from "../Messages/Messages.js";
import { Profiles } from "../../Utils";
import { AppContext } from "../../AppContext";

export async function getUnreadCount(conversationIds, setUnreadCount) {
  console.log("running getunreadcount");
  const res2 = await fetch("http://localhost:8080/get_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      get: "pending_messages",
    },
    body: JSON.stringify({
      conversation_IDs: conversationIds,
      sender_ID: sessionStorage.getItem("loggedInMobile"),
    }),
  });

  const result2 = await res2.json();
  console.log("the wait is here: ", result2.result);
  let tempObj = {};
  for (let i of result2.result) {
    // console.log("this is i here: ", i.unread_count);
    // console.log("hihi");
    // let temp = [...unreadCount, { unread_count: i[0].unread_count, conversation_ID: i[0].conversation_ID }];
    const temp = tempObj;
    temp[i.conversation_ID] = [i.unread_count, i.lastMessage];
    tempObj = temp;
    // setUnreadCount(temp);
  }
  console.log("the new state: ", tempObj);
  setUnreadCount(tempObj);
}

export async function getContacts(setContacts, setConversationIds, from) {
  console.log("from :", from);
  const res = await fetch("http://localhost:8080/get_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      get: "users",
    },
    body: JSON.stringify({
      reciever_mobile: sessionStorage.getItem("loggedInMobile"),
    }),
  });

  const result = await res.json();
  setContacts(result.result);
  if (result.result != "no users") {
    console.log("the new result is::", from);

    const convoIds = result.result.map((i) => {
      return i.conversation_ID;
    });

    setConversationIds(convoIds);
  }
}

function ChatHead(props) {
  const history = useHistory();
  const [usersList, SetUsersList] = useState();
  // const [unreadCount, setUnreadCount] = useState({});
  // const [conversationIds, setConversationIds] = useState([]);
  const {
    contacts,
    setContacts,
    setCurrentContact,
    userSocket,
    lastElmRef,
    unreadCount,
    setUnreadCount,
    conversationIds,
    setConversationIds,
  } = useContext(AppContext);

  // useEffect(async () => {
  //   if (contacts.length == 0) {
  //     //get all the contacts
  //     console.log("getting contacts");
  //     getContacts(setContacts, setConversationIds, "chathead init");
  //   }
  // }, []);

  useEffect(() => {
    console.log("getting unread count");
    getUnreadCount(conversationIds, setUnreadCount);
  }, [conversationIds]);

  useEffect(() => {
    console.log("making final list", contacts);
    if (contacts.length > 0 && contacts != "no users") {
      let list = contacts.map((user) => {
        if (user) {
          console.log("dog cat: ", unreadCount);
          return (
            <div
              className="chat-head mb-2 hover:bg-violet-500 group grid grid-cols-10 bg-white-400 shadow-md p-4 mx-3 rounded-xl "
              onClick={() => {
                setCurrentContact(user);
                props.loadMessages(user.conversation_ID);
                openChat(user.mobile);
              }}
            >
              <div className="card-img col-span-2">
                <img src={`${Profiles[user.avatar]}`} />
              </div>
              <div className="card-text col-span-7 text-white">
                <div className="text-body">
                  <h1 className="text-black group-hover:text-white text-2xl">
                    {user.name}
                  </h1>
                  <h5 className="group-hover:text-violet-200 text-gray-500 text-base">
                    {unreadCount[`${user.conversation_ID}`] &&
                    unreadCount[`${user.conversation_ID}`][1]
                      ? unreadCount[`${user.conversation_ID}`][1]
                      : "No chat history"}
                  </h5>
                </div>
              </div>
              <div className="unread col-span-1">
                <div>
                  <span>
                    {unreadCount[`${user.conversation_ID}`] &&
                    unreadCount[`${user.conversation_ID}`][0] > 0
                      ? unreadCount[`${user.conversation_ID}`][0]
                      : ""}
                  </span>
                </div>
              </div>

              {/* <hr /> */}
            </div>
          );
        }
      });
      if (list.length == contacts.length) {
        SetUsersList(list);
      }
    }
  }, [unreadCount, contacts]);

  function openChat(mobile) {
    scroll(lastElmRef);
    userSocket.emit("update_current_chat", {
      user_mobile: sessionStorage.getItem("loggedInMobile"),
      contact_mobile: mobile,
    });
  }

  return (
    <div className="my-2" style={{ display: props.display }}>
      {console.log("rendered")}
      {usersList}
    </div>
  );
}

export default ChatHead;
