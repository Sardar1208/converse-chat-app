import React from 'react';

function LeftNav(props) {

    return (
        <div className="left-navbar">
            <div>
                <span className="my-profile">Sarthak</span>
            </div>
            <div className="options">
                <button onClick={() => { props.function("add_friend") }}><img src="/svg/add.svg" /></button>
                <button onClick={() => { props.function("pending_requests") }}><img src="/svg/friends.svg" /></button>
            </div>
        </div>
    )
}

export default LeftNav;