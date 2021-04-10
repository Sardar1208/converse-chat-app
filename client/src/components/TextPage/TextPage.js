import React, { useEffect } from "react";
import { Nav } from "react-bootstrap";
import "./TextPage.css";
import { AppContext } from "../../AppContext";
const login_page = require("../Login/Login");

function TextPage() {
  const { currentContact, userSocket } = React.useContext(AppContext);
  const [textValue, setTextValue] = React.useState("");
  const [msg, setMsg] = React.useState([]);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      console.log("hi there");
      userSocket.on("incoming-text", (data) => {
        let temp = [...msg, data];
        setMsg(temp);
      });
    }
    return () => {
      unmounted = true;
    };
  }, [msg]);

  async function sendText() {
    console.log("socket from login: ", userSocket);
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
    console.log("recievers socketID: ", await result);
    if (result.result != "not found") {
      userSocket.emit("texty", {
        recieverID: `${result.result}`,
        text: `${textValue}`,
      });
      // render chat page and remove this page
      setTextValue("");
    }
  }
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
        {React.Children.map(msg, (value) => {
          return (
            <div className="text-box">
              <span>{value}</span>
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
