import React from 'react';
import { AppContext } from "../../AppContext";

function ChatInput(props) {

    const { currentContact, userSocket } = React.useContext(AppContext);
    const [textValue, setTextValue] = React.useState("");

    async function sendText() {
        const temp = [...props.commonMsg, { sender: "me", data: textValue }];
        props.setcommonMsg(temp);


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
        if (result.result != "not found") {
            userSocket.emit("texty", {
                recieverID: `${result.result}`,
                text: `${textValue}`,
                reciever_mobile: `${currentContact.mobile}`,
                conversation_ID: `${currentContact.conversation_ID}`,
                sender_ID: `${sessionStorage.getItem("loggedInUser")}`,
            });
            // render chat page and remove this page
            setTextValue("");
        }
    }

    return (
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
    )
}

export default ChatInput;