import { React, useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import io from 'socket.io-client';
import TextPage from "../TextPage/TextPage"
import './Login.css';

function Login() {

    const [username, setUsername] = useState("");
    const [socketID, setsocketID] = useState("");
    // let socketID = "";


    useEffect(() => {
        console.log("asdada");

        const socket = io("http://localhost:8080/")

        socket.on('connect', () => {
            console.log(`connected with id: ${socket.id}`);
            setsocketID(socket.id);
            // console.log(socketID);
        })
    }, [])



    async function Signin() {
        console.log("from signin", socketID);
        const res = await fetch("http://localhost:8080/login_user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': `${username}`,
                'socketID': `${socketID}`,
            })
        })

        const result = await res.json();
        console.log(await result);
        if (result.result == "success") {
            // render chat page and remove this page
        }
    }

    return (
        <div>
            <div className="Login">
                <div className="text">
                    <div>
                        <input className="text" type="text"
                            placeholder="Login"
                            onChange={(e) => { setUsername(e.target.value) }} />
                    </div>
                    <div>
                        <Link to="/chatHead"><button onClick={Signin}>Login</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;