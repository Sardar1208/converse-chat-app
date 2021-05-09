import React from 'react';
import { AppContext } from "../../AppContext";

function LeftNav(props) {

  const { loggedInUsername } = React.useContext(AppContext);

    let pendingButtonStyles = {
        border: "3px solid",
        borderColor: props.pendingRequestcolor,
        transition: "borderColor 0.3s ease"
    }

    return (
        <div className="left-navbar">
            <div>
                <span className="my-profile">{loggedInUsername}</span>
            </div>
            <div className="options">
                <button onClick={() => { props.function("add_friend") }}><img src="/svg/add.svg" /></button>
                <button onClick={() => { props.function("pending_requests") }} style={pendingButtonStyles}><img src="/svg/friends.svg"/></button>
            </div>
        </div>
    )
}

export default LeftNav;