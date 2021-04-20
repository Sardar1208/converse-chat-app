import React, { useEffect } from "react";
import "./TextPage.css";
import ChatHead from "../ChatHeads/ChatHead"
import { AppContext } from "../../AppContext";
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from "react-router-dom";

function TextPage() {
  const history = useHistory();
  const { currentContact, userSocket } = React.useContext(AppContext);
  const [textValue, setTextValue] = React.useState("");
  const [friendsText, setfriendsText] = React.useState("");
  const [msg, setMsg] = React.useState([]);
  const [myMsg, setmyMsg] = React.useState([]);
  const [commonMsg, setcommonMsg] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [requestList, setRequestList] = React.useState([]);

  useEffect(() => {
    //TODO - run this when the app loads
    let listOfRequests =
      requests.map((request) => {
        return (
          <div className="request-block">
            <span>{request.sender_mobile}</span>
            <div>
              <button className="accept-btn" onClick={() => { respond_request("accepted", request.sender_mobile) }}><img src="/svg/sent.svg" /></button>
              <button className="decline-btn" on onClick={() => { respond_request("declined", request.sender_mobile) }}><img src="/svg/cross.svg" /></button>
            </div>
          </div>
        )
      })
    setRequestList(listOfRequests);

  }, [requests])

  useEffect(() => {

    let unmounted = false;
    if (!unmounted) {
      if (!userSocket) {
        console.log("in here brouh")
        history.push("/login");
      } else {
        userSocket.on("incoming-text", (data) => {
          let temp = [...commonMsg, { isSender: false, data: data }];
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

  async function sendText() {
    const temp = [...commonMsg, { isSender: true, data: textValue }];
    setcommonMsg(temp);


    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: "socketID",
      },
      body: JSON.stringify({
        username: `${currentContact}`,
      }),
    });
    const result = await res.json();
    if (result.result != "not found") {
      userSocket.emit("texty", {
        recieverID: `${result.result}`,
        text: `${textValue}`,
      });
      // render chat page and remove this page
      setTextValue("");
    }
  }

  function openTab(name) {
    if (name == "request") {

    }
  }

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

  async function searchContact() {
    userSocket.emit("sending_request", { sender_mobile: `${sessionStorage.getItem("loggedInUser")}`, reciever_mobile: `${friendsText}` });
  }

  return (
    <div className="split-view">
      <div className="contacts-section">
        <div className="left-navbar">
          <div>
            <span className="my-profile">Sarthak</span>
          </div>
          <div className="options">
            <button onClick={() => { pending_requests() }}><img src="/svg/add.svg" /></button>
            <button><img src="/svg/friends.svg" /></button>
          </div>
        </div>
        <ChatHead />

        <div className="friends-section">
          <div className="friends-innerdiv">
            <h3 className="friends-heading">Add your friends to the chat. Search using their unique mobile numbers.</h3>
            <input
              className="friends-input"
              type="text"
              placeholder="Search..."
              width="100%"
              onChange={(e) => {
                setfriendsText(e.target.value);
              }}
              value={friendsText}
            />
            <button className="friends-button" onClick={searchContact}>Search</button>
          </div>
        </div>

        <div className="pending_requests">
          {requestList}
        </div>
      </div>



      <div className="chat-section">
        <div className="my-navbar">
          <button className="back-button">
            <img src="/svg/back.svg" />
          </button>

          <img src="/images/pic_1.jpg" className="profile-img " />
          <a href="/home">
            <h3 className="chat-title">{currentContact}</h3>
          </a>

          <img src="/svg/status.svg" className="status" />
        </div>

        <div className="messeges">
          {commonMsg.map((value, key) => {
            return (
              <div key={key + "-" + value.data} className={value.isSender ? "my-text-box" : "text-box"}>
                <span>{value.data}</span>
              </div>
            );
          })}
        </div>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter something..."
            width="100%"
            onChange={(e) => {
              setTextValue(e.target.value);
            }}
            value={textValue}
          />
          <button className="send-button" onClick={sendText}>
            Send <img src="/svg/send.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextPage;
