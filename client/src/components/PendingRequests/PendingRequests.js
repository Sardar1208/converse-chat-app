import React, { useState, useEffect } from 'react';

function PendingRequests(props) {

    const [noReqDisplay, setNoReqDisplay] = useState("none");

    useEffect(() => {
        //TODO - run this when the app loads
        let listOfRequests =
            props.requests.map((request) => {
                return (
                    <div className="request-block">
                        <span>{request.sender_mobile}</span>
                        <div>
                            <button className="accept-btn" onClick={() => { props.respond_request("accepted", request.sender_mobile) }}><img src="/svg/sent.svg" /></button>
                            <button className="decline-btn" on onClick={() => { props.respond_request("declined", request.sender_mobile) }}><img src="/svg/cross.svg" /></button>
                        </div>
                    </div>
                )
            })
        if(listOfRequests.length == 0){
            setNoReqDisplay("flex");
        }
        props.setRequestList(listOfRequests);

    }, [props.requests])

    console.log(props.requests)
    return (
        <div className="h-full">
            <div className="no-req h-full m-auto flex" style={{display: noReqDisplay}}>
                <h4 className="text-center m-auto self-center text-gray-600">There are no pending friend requests.</h4>
            </div>
            <div>
                {props.requestList}
            </div>
        </div>
    )
}

export default PendingRequests;