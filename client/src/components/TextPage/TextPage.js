import React, { useEffect } from "react";
import { Nav } from "react-bootstrap";
import "./TextPage.css";
import { AppContext } from "../../AppContext";
import connectSocket from "../Utility/connectSocket";
const login_page = require("../Login/Login");

function TextPage() {
  const { currentContact,setuserSocket,userSocket,username,setUsername } = React.useContext(AppContext);
  const [textValue, setTextValue] = React.useState("");
  const [msg, setMsg] = React.useState([]);
  const [myMsg, setmyMsg] = React.useState([]);
  const [commonMsg, setcommonMsg] = React.useState([]);

  useEffect(async() => {
    let unmounted = false;
    if (!unmounted) {
      await connectSocket(setuserSocket);
      userSocket.on("incoming-text", (data) => {
        let temp = [...commonMsg, { isSender: false, data: data }];
        setcommonMsg(temp);
      });
    }
    return () => {
      unmounted = true;
    };
  }, [commonMsg]);

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

  // function make(msgObj){
  //   for (const i of msgObj) {

  //   }
  // }

  return (
    <div>
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
  );
}

export default TextPage;
