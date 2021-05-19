import React, { useEffect } from "react";
import "./TextPage.css";
import ChatHead, { getUnreadCount } from "../ChatHeads/ChatHead";
import LeftNav from "../LeftNav/LeftNav";
import RightNav from "../RightNav/RightNav";
import FriendsDiv from "../FriendsDiv/FriendsDiv";
import PendingRequests from "../PendingRequests/PendingRequests";
import Messages from "../Messages/Messages";
import OnBoarding from "../OnBoarding/OnBoarding.js";
import { scroll } from "../Messages/Messages.js";
import { AppContext } from "../../AppContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link,
} from "react-router-dom";
import ChatInput from "../ChatInput/ChatInput";

function TextPage() {
  const history = useHistory();
  const {
    userSocket,
    setUnreadCount,
    unreadCount,
    conversationIds,
    setLoggedInUsername,
    currentContact,
    lastElmRef,
    textQueue,
    setTextQueue,
  } = React.useContext(AppContext);
  const [friendsText, setfriendsText] = React.useState("");
  const [commonMsg, setcommonMsg] = React.useState([]);
  const [pendingMsg, setpendingMsg] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [activeRequests, setActiveRequests] = React.useState([]);
  const [requestList, setRequestList] = React.useState([]);
  const [addFriendDisplay, setaddFriendDisplay] = React.useState("none");
  const [pendingRequestDisplay, setpendingRequestDisplay] =
    React.useState("none");
  const [chatsDisplay, setchatsDisplay] = React.useState("block");
  const [pending_text_in, setPending_text_in] = React.useState(true);
  const [textQueueOpen, setTextQueueOpen] = React.useState(true);
  const [pendingRequestcolor, setPendingRequestColor] =
    React.useState("transparent");

  const add_friendStyles = {
    display: addFriendDisplay,
  };

  const pendingRequestStyles = {
    display: pendingRequestDisplay,
  };

  // whenever there is a new msg, updates the msg state
  useEffect(async () => {
    let unmounted = false;
    if (!unmounted) {
      if (!userSocket) {
        console.log("in here brouh");
        history.push("/");
      } else {
        userSocket.once("incoming-text", (data) => {
          console.log("incoming-text");
          let temp = [
            ...commonMsg,
            { sender: data.sender_ID, data: data.text, time: data.time },
          ];
          let temp2 = unreadCount;
          temp2[data.conversation_ID] = [0, data.text];
          setUnreadCount(temp2);
          setcommonMsg(temp);
        });
        userSocket.on("incoming-pending-text", (data) => {
          //TODO - this signal is not working fix this
          // TODO - re render chat head on this signal
          console.log("got it hululululu");
          getUnreadCount(conversationIds, setUnreadCount);
          // setPending_text_in(!pending_text_in);
        });
        userSocket.once("recieving_request", (data) => {
          console.log("got a new friend request: ", data);
          setPendingRequestColor("rgb(121, 121, 233)");
        });
        userSocket.once("deleted active request", (data) => {
          console.log("info: ", data.info);
          pending_requests();
        });
        userSocket.on("text-sent", (data) => {
          if (textQueue.length > 0) {
            console.log("text sent: ", textQueue);
            let temp = [...textQueue];
            temp.splice(0, 1);
            setTextQueue(temp);
            setTextQueueOpen(true);
          }
        });
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
        reciever_mobile: sessionStorage.getItem("loggedInMobile"),
        response: status,
      }),
    });
    const result = await res.json();
    if (result.result == "success") {
      pending_requests();
    }
  }

  function encryptText(text) {
    const algorithm = "aes-192-cbc";
  }

  // switches between different tabs
  function openTab(name) {
    if (name == "add_friend") {
      setchatsDisplay("none");
      setpendingRequestDisplay("none");
      setaddFriendDisplay("flex");
    } else if (name == "pending_requests") {
      pending_requests();
      setchatsDisplay("none");
      setaddFriendDisplay("none");
      setpendingRequestDisplay("block");
    }
  }

  async function loadMessages(conversation_ID) {
    const user = sessionStorage.getItem("loggedInMobile");
    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: "messages",
      },
      body: JSON.stringify({
        conversation_ID: `${conversation_ID}`,
        sender_ID: `${user}`,
      }),
    });
    const result = await res.json();
    if (result.result == "success") {
      console.log("messages in this convo: ", result);
      const texts = result.messages.map((text) => {
        let sender = "";
        if (text.sender_ID == user) {
          sender = "me";
        } else {
          sender = text.sender_ID;
        }
        return {
          sender: `${sender}`,
          data: `${text.msg}`,
          time: `${text.msg_time}`,
        };
      });

      const pending_texts = result.pending_messages.map((text) => {
        let sender = "";
        if (text.sender_ID == user) {
          sender = "me";
        } else {
          sender = text.sender_ID;
        }
        return {
          sender: `${sender}`,
          data: `${text.msg}`,
          time: `${text.msg_time}`,
        };
      });
      console.log("the final texts are: ", texts);
      // setpendingMsg(pending_texts);
      setcommonMsg([...texts, ...pending_texts]);
      scroll(lastElmRef);
      // let temp = [...props.commonMsg, ...props.pendingMsg]
      // console.log("temp: ", temp);
      // props.setcommonMsg(temp);
      // props.setpendingMsg([]);
    }
  }

  // gets and shows all the pending requests
  async function pending_requests() {
    console.log("running pending requests...");
    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: "pending_requests",
      },
      body: JSON.stringify({
        mobile: `${sessionStorage.getItem("loggedInMobile")}`,
      }),
    });
    const result = await res.json();
    let listOfPendingRequests = result.result?.map((i) => {
      if (
        i.reciever_mobile == sessionStorage.getItem("loggedInMobile") &&
        i.req_status == "pending"
      ) {
        let senderName = result.names.filter(
          (j) => j.mobile_no == i.sender_mobile
        );
        let recieverName = result.names.filter(
          (j) => j.mobile_no == i.reciever_mobile
        );
        console.log(
          "sender name: ",
          senderName[0].fullName,
          recieverName[0].fullName
        );
        return {
          reciever_name: recieverName[0].fullName,
          sender_name: senderName[0].fullName,
          reciever_mobile: i.reciever_mobile,
          sender_mobile: i.sender_mobile,
        };
      }
    });

    let listOfActiveRequests = result.result?.map((i) => {
      if (
        i.sender_mobile == sessionStorage.getItem("loggedInMobile") &&
        i.req_status == "pending"
      ) {
        console.log("something");
        let senderName = result.names.filter(
          (j) => j.mobile_no == i.sender_mobile
        );
        let recieverName = result.names.filter(
          (j) => j.mobile_no == i.reciever_mobile
        );
        console.log(
          "sender name: ",
          senderName[0].fullName,
          recieverName[0].fullName
        );
        return {
          reciever_name: recieverName[0].fullName,
          sender_name: senderName[0].fullName,
          reciever_mobile: i.reciever_mobile,
          sender_mobile: i.sender_mobile,
        };
      } else {
        console.log("nothing");
        return null;
      }
    });
    // console.log("requestList: ")

    console.log("active requests: ", listOfActiveRequests);
    console.log("pending requests: ", listOfPendingRequests);
    if (listOfActiveRequests !== activeRequests) {
      setActiveRequests(listOfActiveRequests);
    }
    if (listOfPendingRequests !== requests) {
      setRequests(listOfPendingRequests);
    }
  }

  async function deleteActiveRequest(reciever_mobile) {
    userSocket.emit("delete_request", {
      sender_mobile: sessionStorage.getItem("loggedInMobile"),
      reciever_mobile: reciever_mobile,
      socket_ID: userSocket.id,
    });

    // sender_mobile: sessionStorage.getItem("loggedInMobile"),
    //     reciever_mobile: reciever_mobile
    // const result = await res.json();
    // if (result.result == "success") {
    //   pending_requests();
    // }
  }

  // sends a friend request to the user with socket.
  async function searchContact() {
    userSocket.emit("sending_request", {
      sender_mobile: `${sessionStorage.getItem("loggedInMobile")}`,
      sender_username: `${sessionStorage.getItem("loggedInUser")}`,
      reciever_uniqueKey: `${friendsText}`,
    });
  }

  return (
    <div className="split-view">
      <div className="contacts-section bg-blueGray-50">
        <LeftNav function={openTab} pendingRequestcolor={pendingRequestcolor} />
        <ChatHead
          display={chatsDisplay}
          loadMessages={loadMessages}
          commonMsg={commonMsg}
          setcommonMsg={setcommonMsg}
          pendingMsg={pendingMsg}
          setpendingMsg={setpendingMsg}
          pending_text_in={pending_text_in}
        />

        <div className="friends-section" style={add_friendStyles}>
          <FriendsDiv
            friendsText={friendsText}
            setfriendsText={setfriendsText}
            searchContact={searchContact}
          />
        </div>

        <div className="pending_requests" style={pendingRequestStyles}>
          <PendingRequests
            requests={requests}
            requestList={requestList}
            setRequestList={setRequestList}
            respond_request={respond_request}
            activeRequests={activeRequests}
            deleteActiveRequest={deleteActiveRequest}
          />
        </div>
      </div>

      {Object.keys(currentContact).length > 0 ? (
        <div className="chat-section">
          <>
            <RightNav />
            <Messages
              commonMsg={commonMsg}
              pendingMsg={pendingMsg}
              className="messages_section "
              setcommonMsg={setcommonMsg}
            />
            <ChatInput
              commonMsg={commonMsg}
              setcommonMsg={setcommonMsg}
              pendingMsg={pendingMsg}
              setpendingMsg={setpendingMsg}
              loadMessages={loadMessages}
              textQueueOpen={textQueueOpen}
              setTextQueueOpen={setTextQueueOpen}
            />
          </>
        </div>
      ) : (
        <OnBoarding username={sessionStorage.getItem("loggedInUser")} />
      )}
    </div>
  );
}

export default TextPage;
