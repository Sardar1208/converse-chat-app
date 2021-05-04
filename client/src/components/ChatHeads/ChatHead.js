import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from "react-router-dom";
import "./ChatHead.css";
import { AppContext } from "../../AppContext";

function ChatHead(props) {
  const history = useHistory();
  const [usersList, SetUsersList] = useState();
  const [unreadCount, setUnreadCount] = useState([]);
  const [conversationIds, setConversationIds] = useState([]);
  const { contacts, setContacts, setCurrentContact, userSocket, currentContact } = useContext(AppContext);

  async function getUnreadCount() {
    const res2 = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'get': "pending_messages",
      },
      body: JSON.stringify({
        conversation_IDs: conversationIds,
        sender_ID: sessionStorage.getItem("loggedInUser"),
      }),
    });

    const result2 = await res2.json();

    for (let i of result2.result) {
      if (i && i.length > 0) {
        console.log("this is i here: ", i[0].unread_count);
        console.log("hihi");
        let temp = [...unreadCount, { unread_count: i[0].unread_count, conversation_ID: i[0].conversation_ID }];
        setUnreadCount(temp);
        console.log("the new state: ", unreadCount);
      }
    }

    return await result2;
  }

  useEffect(async () => {
    //get all the contacts
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

    const result = await res.json();
    setContacts(result.result);
    if (result.result != "failure") {
      console.log("the new result is::", result.result);

      const convoIds = result.result.map((i) => {
        return i.conversation_ID;
      })

      setConversationIds(convoIds);
    }
  }, []);

  useEffect(() => {
    getUnreadCount();
  }, [conversationIds])

  useEffect(() => {
    console.log("dog cat: ", unreadCount.length);
    let list = contacts.map((user) => {
      let count = -1;
      for (let i = 0; i < unreadCount.length; i++) {
        console.log("ur: ", unreadCount[i].conversation_ID);
        console.log("us: ", user.conversation_ID);
        if (unreadCount[i].conversation_ID == user.conversation_ID) {
          console.log("got it finally mf");
          count = i;
          break;
        }
      }
      return (
        <div className="chat-head" onClick={() => { setCurrentContact(user); props.loadMessages(user.conversation_ID); openChat(user.mobile);}}>
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
            <div className="unread">
              <span>{(unreadCount[count]) ? unreadCount[count].unread_count : ""}</span>
            </div>
          </div>
          <hr />
        </div>
      );
    });
    SetUsersList(list);
  }, [unreadCount])
  // useEffect(async () => {
  //   console.log("the new state: ", unreadCount);



  //   const result = await res.json();
  //   if (result.result != "failure") {
  //     console.log("the new result is::", result.result);

  //     const convoIds = result.result.map((i) => {
  //       return i.conversation_ID;
  //     })

  //     setConversationIds(convoIds);

  //     // get the unread message count
  //     const result2 = await getUnreadCount();

  //     //TODO - make the unreadmessages frontend

  //     const newResult = result.result;
  //     setContacts(newResult);
  //     console.log("contacts = ", contacts);
  //     // if (result.result != "no users") {
  //     //   let List = newResult.map((user) => {
  //     //     let count = 0;
  //     //     for (let i = 0; i < result2.result.length; i++) {
  //     //       if (result2.result[i][0] && result2.result[i][0].conversation_ID == user.conversation_ID) {
  //     //         console.log("got it finally mf");
  //     //         count = i;
  //     //         break;
  //     //       }
  //     //     }
  //     //     console.log("the index is : ", count)

  //     //   });
  //     //   SetUsersList(List);
  //     // }
  //   }

  // }, []);

  function openChat(mobile) {
    console.log("this has to be updated: ", mobile)
    userSocket.emit("update_current_chat", { user_mobile: sessionStorage.getItem("loggedInUser"), contact_mobile: mobile });
  }

  return <div style={{ display: props.display }}>{usersList}</div>;
}

export default ChatHead;
