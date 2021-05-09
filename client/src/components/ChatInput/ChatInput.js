import React from 'react';
import { AppContext } from "../../AppContext";

function ChatInput(props) {

    const { currentContact, userSocket } = React.useContext(AppContext);
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
                sender_ID: `${sessionStorage.getItem("loggedInUser")}`,
            });
            const temp = [...props.commonMsg, { sender: "me", data: textValue }];
            props.setcommonMsg(temp);
            // if (result.current_chat == sessionStorage.getItem("loggedInUser")) {

            // } else {
            //     const temp = [...props.pendingMsg, { sender: "me", data: textValue }];
            //     props.setpendingMsg(temp);
            // }
            console.log("and the lucky number is: ", result.current_chat);
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
            <button className="the-send-button self-center justify-self-center" onClick={sendText}>
                Send <img src="/svg/send.svg" />
            </button>
        </div>
    )
}

export default ChatInput;