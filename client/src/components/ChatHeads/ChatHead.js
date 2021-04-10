import { React, useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import "./ChatHead.css";

function ChatHead() {

    const [usersList, SetUsersList] = useState();

    useEffect(async () => {
        const res = await fetch("http://localhost:8080/get_data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'get': 'users'
            },
        })

        const result = await res.json();
        const newResult = result.result.split(",");
        console.log(newResult);
        if (result.result != "no users") {
            let List = newResult.map((user) => {
                return (
                    <Link to="/textPage">
                        <div className="chat-head" onClick={openChat}>
                            <div className="card-text">
                                <h1>{user}</h1>
                                <span><img src="/svg/sent.svg" /></span>
                                <h5>This is your last text...</h5>
                            </div>
                        </div>
                    </Link>
                )
            })
            SetUsersList(List);
        }
    }, [])

    function openChat() {

    }


    return (
        <div>
            {usersList}
        </div>
    )
}

export default ChatHead;