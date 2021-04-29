import React from 'react';


// TODO - when the text is seen delete it from the pending_queue table and insert into messages table.
// TODD - improve the frontend of unread messages div.

function Messages(props) {
    return (
        <div className="messeges">
            {props.commonMsg.map((value, key) => {
                return (
                    <div key={key + "-" + value.data} className={value.sender == "me" ? "my-text-box" : "text-box"}>
                        <span>{value.data}</span>
                    </div>
                );
            })}
            <div style={{display: (props.pendingMsg.length > 0 && props.pendingMsg[0].sender != "me") ? "block" : 'none'}}>
                <span>Unread messages!</span>
            </div>
            {props.pendingMsg.map((value, key) => {
                return (
                    <div key={key + "-" + value.data} className={value.sender == "me" ? "my-text-box" : "text-box"}>
                        <span>{value.data}</span>
                    </div>
                );
            })}
        </div>
    )
}

export default Messages;