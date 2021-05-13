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
            return { data: i.data, sender: i.sender, time: i.time }
        });
        let totalMsg2 = await props.pendingMsg.map((i) => {
            return { data: i.data, sender: i.sender, time: i.time }
        })
        let temp = totalMsg.concat(totalMsg2);
        setfinalMsg(temp);
        // console.log("temp: ", temp);
    }, [props.pendingMsg, props.commonMsg])

    return (
        <div className="messeges bg-white">

            {/* <div className="unread-messages" style={{ display: (props.pendingMsg.length > 0 && props.pendingMsg[0].sender != "me") ? "block" : 'none' }}>
                <div>
                    <span>UNREAD MESSAGES</span>
                </div>
            </div> */}
            {finalMsg.map((value, key) => {
                return (
                    <div className="baap-div">
                        <div key={key + "-" + value.data} className={(value.sender == "me" ? "bg-violet-500 text-white ml-auto mr-8 rounded-l-2xl rounded-br-2xl relative" : "bg-blueGray-200 max-w-2xl mr-auto ml-8 rounded-r-2xl rounded-bl-2xl relative") + " p-3 px-4 my-3 break-words chat-bubble"}>
                            {value.sender == "me" ? <div className="border-violet-500 triangle absolute top-0 -right-4"></div>
                                : <div className="border-blueGray-200 triangle absolute top-0 -left-4"></div>}
                            <span>{value.data}</span>
                            <span>{value.time}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Messages;