import React, { useEffect } from "react";
import { AppContext } from "../../AppContext";
import { scroll } from "../Messages/Messages.js";

function ChatInput(props) {
  const { currentContact, userSocket, lastElmRef, textQueue, setTextQueue } =
    React.useContext(AppContext);
  const [textValue, setTextValue] = React.useState("");
  // const [textQueue, setTextQueue] = React.useState([]);

  // sent text goes in texts array/queue.
  // when the first message is sent, it updates the array/queue.
  // Then, the new message is taken from the array ans is sent.

  useEffect(() => {
    console.log("textQueueOpen: ", props.textQueueOpen);
    if (props.textQueueOpen == true && textQueue.length > 0) {
      console.log("initiating sending procedure...");
      props.setTextQueueOpen(false);
      sendText(textQueue[0]);
    }
  }, [textQueue]);

  async function queueText() {
    if (textValue.length > 0) {
      const text = {
        // recieverID: `${result.socket_ID}`,
        text: `${textValue}`,
        reciever_mobile: `${currentContact.mobile}`,
        conversation_ID: `${currentContact.conversation_ID}`,
        // sender_ID: `${sessionStorage.getItem("loggedInMobile")}`,
      };
      setTextValue("");
      setTextQueue([...textQueue, text]);
    }
  }

  async function sendText(text) {
    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        get: "socketID",
      },
      body: JSON.stringify({
        reciever_mobile: `${text.reciever_mobile}`,
      }),
    });
    const result = await res.json();
    if (result.result == "success") {
      userSocket.emit("texty", {
        recieverID: `${result.socket_ID}`,
        text: `${text.text}`,
        reciever_mobile: `${text.reciever_mobile}`,
        conversation_ID: `${text.conversation_ID}`,
        sender_ID: `${sessionStorage.getItem("loggedInMobile")}`,
      });
      const temp = [
        ...props.commonMsg,
        { sender: "me", data: text.text, time: Date.now() },
      ];
      props.setcommonMsg(temp);
      console.log("and the lucky number is: ", result.current_chat);

      scroll(lastElmRef);
    }else{
      props.setTextQueueOpen(true);
    }
  }

  return (
    <div className="flex flex-start bg-white items-center pb-3">
      <div className="mb-1 pt-1 flex relative flex-1">
        <input
          type="text"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              queueText();
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
        onClick={queueText}
      >
        <img src="/svg/send.svg" width="24px" />
      </div>
    </div>
  );
}

export default ChatInput;
