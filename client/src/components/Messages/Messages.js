import React from 'react';

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
        </div>
    )
}

export default Messages;