import React from 'react';
import { AppContext } from "../../AppContext";

function RightNav() {

    const { currentContact } = React.useContext(AppContext);

    return (
        <div className="my-navbar">
            <button className="back-button">
                <img src="/svg/back.svg" />
            </button>

            <img src="/images/pic_1.jpg" className="profile-img " />
            <a href="/home">
                <h3 className="chat-title">{currentContact.name}</h3>
            </a>

            <img src="/svg/status.svg" className="status" />
        </div>
    )
}

export default RightNav;