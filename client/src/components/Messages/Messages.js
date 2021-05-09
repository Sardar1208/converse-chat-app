import React, { useEffect, useState } from 'react';

// TODD - improve the frontend of unread messages div.

function Messages(props) {

    const [finalMsg, setfinalMsg] = useState([]);
    // useEffect(() => {
    //     console.log("commonMsg: ", props.commonMsg);
    //     props.setcommonMsg(temp);
    //     props.setcommonMsg(finalMsg);
    // }, [finalMsg])

    useEffect(async () => {
        console.log("commonMsg are: ", props.commonMsg);
        console.log("pendingMsg are: ", props.pendingMsg);
        let totalMsg = await props.commonMsg.map((i) => {
            return { data: i.data, sender: i.sender }
        });
        let totalMsg2 = await props.pendingMsg.map((i) => {
            return { data: i.data, sender: i.sender }
        })
        let temp = totalMsg.concat(totalMsg2);
        setfinalMsg(temp);
        // console.log("temp: ", temp);
    }, [props.pendingMsg, props.commonMsg])

    return (
        <div className="messeges">
            {/* {props.commonMsg.map((value, key) => {
                return (
                    <div key={key + "-" + value.data} className={value.sender == "me" ? "my-text-box" : "text-box"}>
                        <span>{value.data}</span>
                    </div>
                );
            })}
            <div className="unread-messages" style={{ display: (props.pendingMsg.length > 0 && props.pendingMsg[0].sender != "me") ? "block" : 'none' }}>
                <div>
                    <span>UNREAD MESSAGES</span>
                </div>
            </div>
            {props.pendingMsg.map((value, key) => {
                return (
                    <div key={key + "-" + value.data} className={value.sender == "me" ? "my-text-box" : "text-box"}>
                        <span>{value.data}</span>
                    </div>
                );
            })} */}
            {finalMsg.map((value, key) => {
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