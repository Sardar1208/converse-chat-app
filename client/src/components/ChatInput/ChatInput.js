import React from "react";
import { AppContext } from "../../AppContext";
import { scroll } from "../Messages/Messages.js";

function ChatInput(props) {
  const { currentContact, userSocket, lastElmRef } =
    React.useContext(AppContext);
  const [textValue, setTextValue] = React.useState("");

  async function sendText() {
    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: "socketID",
      },
      body: JSON.stringify({
        reciever_mobile: `${currentContact.mobile}`,
      }),
    });
    const result = await res.json();
    if (result.result == "success") {
      userSocket.emit("texty", {
        recieverID: `${result.socket_ID}`,
        text: `${textValue}`,
        reciever_mobile: `${currentContact.mobile}`,
        conversation_ID: `${currentContact.conversation_ID}`,
        sender_ID: `${sessionStorage.getItem("loggedInMobile")}`,
      });
      const temp = [...props.commonMsg, { sender: "me", data: textValue }];
      props.setcommonMsg(temp);
      console.log("and the lucky number is: ", result.current_chat);

      // render chat page and remove this page
      setTextValue("");
      scroll(lastElmRef);
    }
  }

  return (
    <div className="flex flex-start bg-white items-center pb-3">
      <div className="mb-1 pt-1 flex relative flex-1">
        <input
          type="text"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendText();
            }
          }}
          placeholder="Type a message"
          className="text-base ml-4 mr-12 px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
          value={textValue}
        />
      </div>
      <div
        className="mr-4 bg-violet-500 px-4 py-2.5 rounded-xl"
        onClick={sendText}
      >
        <img src="/svg/send.svg" width="24px" />
      </div>
    </div>
  );
}

export default ChatInput;
