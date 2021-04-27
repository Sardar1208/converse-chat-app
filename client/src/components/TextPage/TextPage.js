import React, { useEffect } from "react";
import "./TextPage.css";
import ChatHead from "../ChatHeads/ChatHead";
import LeftNav from "../LeftNav/LeftNav";
import RightNav from "../RightNav/RightNav";
import FriendsDiv from "../FriendsDiv/FriendsDiv";
import PendingRequests from "../PendingRequests/PendingRequests";
import Messages from "../Messages/Messages";
import { AppContext } from "../../AppContext";
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from "react-router-dom";
import ChatInput from "../ChatInput/ChatInput";

function TextPage() {
  const history = useHistory();
  const { userSocket } = React.useContext(AppContext);
  const [friendsText, setfriendsText] = React.useState("");
  const [commonMsg, setcommonMsg] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [requestList, setRequestList] = React.useState([]);
  const [addFriendDisplay, setaddFriendDisplay] = React.useState("none");
  const [pendingRequestDisplay, setpendingRequestDisplay] = React.useState("none");
  const [chatsDisplay, setchatsDisplay] = React.useState("block");

  const add_friendStyles = {
    display: addFriendDisplay,
  }

  const pendingRequestStyles = {
    display: pendingRequestDisplay,
  }

  // whenever there is a new msg, updates the msg state 
  useEffect(() => {

    let unmounted = false;
    if (!unmounted) {
      if (!userSocket) {
        console.log("in here brouh")
        history.push("/login");
      } else {
        userSocket.on("incoming-text", (data) => {
          let temp = [...commonMsg, { sender: data.sender_ID, data: data.text }];
          setcommonMsg(temp);
        });
        userSocket.on("recieving_request", (data) => {
          console.log("got a new friend request: ", data);
        })
      }

    }
    return () => {
      unmounted = true;
    };
  }, [commonMsg]);

  // accept or decline requests
  async function respond_request(status, sender) {
    console.log("in here");
    const res = await fetch("http://localhost:8080/respond_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_mobile: `${sender}`,
        reciever_mobile: sessionStorage.getItem("loggedInUser"),
        response: status,
      }),
    });
    const result = await res.json();
    if (result.result == "success") {
      pending_requests();
    }
  }

  // switches between different tabs
  function openTab(name) {
    if (name == "add_friend") {
      setchatsDisplay("none");
      setpendingRequestDisplay("none")
      setaddFriendDisplay("flex");
    } else if (name == "pending_requests") {
      pending_requests();
      setchatsDisplay("none");
      setaddFriendDisplay("none");
      setpendingRequestDisplay("block");
    }
  }

  async function loadMessages(conversation_ID) {
    const user = sessionStorage.getItem("loggedInUser");
    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: "messages",
      },
      body: JSON.stringify({
        conversation_ID: `${conversation_ID}`,
      }),
    });
    const result = await res.json();
    if (result.result != "no messages") {
      console.log("sfslkjdlsakfs;fslkajflfja;lk")
      const texts = result.result.map((text) => {
        let sender = "";
        if (text.sender_ID == user) {
          sender = "me";
        } else {
          sender = text.sender_ID;
        }
        return { sender: `${sender}`, data: `${text.msg}` }
      })
      console.log("the final texts are: ", texts);
      setcommonMsg(texts);
    }
  }

  // gets and shows all the pending requests
  async function pending_requests() {
    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: "pending_requests",
      },
      body: JSON.stringify({
        mobile: `${sessionStorage.getItem("loggedInUser")}`,
      }),
    });
    const result = await res.json();
    if (result.result.length != 0) {
      console.log(result.result);
      setRequests(result.result);
    }

  }

  // sends a friend request to the user with socket.
  async function searchContact() {
    userSocket.emit("sending_request", { sender_mobile: `${sessionStorage.getItem("loggedInUser")}`, reciever_mobile: `${friendsText}` });
  }

  return (
    <div className="split-view">
      <div className="contacts-section">
        <LeftNav function={openTab} />
        <ChatHead display={chatsDisplay} loadMessages={loadMessages} />

        <div className="friends-section" style={add_friendStyles}>
          <FriendsDiv friendsText={friendsText} setfriendsText={setfriendsText} searchContact={searchContact} />
        </div>

        <div className="pending_requests" style={pendingRequestStyles}>
          <PendingRequests requests={requests} requestList={requestList} setRequestList={setRequestList} respond_request={respond_request} />
        </div>
      </div>

      <div className="chat-section">
        <RightNav />

        <Messages commonMsg={commonMsg} />

        <ChatInput commonMsg={commonMsg} setcommonMsg={setcommonMsg} />
      </div>
    </div>
  );
}

export default TextPage;
