import React from "react";
import { Nav } from "react-bootstrap";
import "./TextPage.css";

function TextPage() {
    return (
        <div>
            <div className="my-navbar" activeKey="/home">
                <button className="back-button"><img src="/svg/back.svg" /></button>

                <img src="/images/pic_1.jpg" className="profile-img " />
                <a href="/home"><h3 className="chat-title" >Sarthak</h3></a>


                <img src="/svg/status.svg" className="status" />

            </div>

            <div className="input-section">
                <input type="text" placeholder="Enter something..." width="100%" />
                <button className="send-button">Send <img src="/svg/send.svg" /></button>
            </div>
        </div>
    )
}

export default TextPage;