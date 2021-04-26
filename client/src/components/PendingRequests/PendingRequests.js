import React, { useEffect } from 'react';

function PendingRequests(props) {

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
        props.setRequestList(listOfRequests);

    }, [props.requests])

    return (
        <div>
            {props.requestList}
        </div>
    )
}

export default PendingRequests;