import React, { useState } from "react";
import { AppContext } from "../../AppContext";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
    Link,
} from "react-router-dom";

export async function AuthorizeUser(token, uniqueKey, socket_ID, setLoggedInUsername, setLoggedInMobile, history) {

    const res = await fetch("http://localhost:8080/login_user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            uniqueKey: uniqueKey,
            socketID: socket_ID,
        }),
    });

    const result = await res.json();
    console.log(await result);

    // if user exists then login
    if (result.result == "success") {
        console.log("successfull login!!!", result);
        sessionStorage.setItem("loggedInUser", `${result.username}`)
        sessionStorage.setItem("loggedInMobile", `${result.mobile}`)
        setLoggedInUsername(result.username);
        setLoggedInMobile(result.mobile)
        history.push("/textPage");
    }
    //id new user ask additional info
    else if (result.result == "new user") {
        console.log("login failed");
        // setaddDetailsDisplay("block");
        // setLoginDivDisplay("none");
    }
}

function SignIn(props) {

    const { userSocket, setLoggedInUsername, setLoggedInMobile } = React.useContext(AppContext);
    const history = useHistory();
    const [uniqueKey, setUniqueKey] = useState("");
    const [password, setPassword] = useState("");

    async function SignIn() {
        const res = await fetch("http://localhost:8080/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uniqueKey: uniqueKey,
                password: password,
            }),
        });

        const result = await res.json();
        if (result.result === "success") {
            console.log("got an access token: ", result);
            sessionStorage.setItem("accessToken", result.accessToken);
            AuthorizeUser(result.accessToken, uniqueKey, userSocket.id, setLoggedInUsername, setLoggedInMobile, history);
            // setLoggedInUsername(username);
            // sessionStorage.setItem("loggedInUser", username);
            // history.push("/textPage");
            // AuthorizeUser(result.accessToken);
        }
    }




    return (
        <div className="w-100 px-4">
            <span className="font-bold text-4xl pl-2 border-l-4 border-red-400 text-gray-600">
                {/* Interested ?<br /> */}
              Login
            </span>
            <div>
                <div className="mb-3 pt-1 flex relative mt-12">
                    <input
                        type="text"
                        className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                        onChange={(e) => { setUniqueKey(e.target.value) }}
                        value={uniqueKey}
                    />
                    <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                        Phone Number / Username
                </span>
                </div>
                <div className="mb-3 pt-1 flex relative mt-4">
                    <input
                        type="password"
                        className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                    />
                    <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                        Password
                </span>
                </div>
                <div className="flex justify-center my-8">
                    <button onClick={SignIn} className="py-2 rounded-md px-8 bg-violet-500 text-white font-bold focus:bg-violet-700 hover:bg-violet-600">
                        Login
                </button>
                </div>
                <div className="flex items-center">
                    <hr />
                    <span className="px-2">OR</span>
                    <hr />
                </div>
                <div className="flex justify-center items-center mt-6">
                    <span>New to Converse?</span>
                    <button
                        className="ml-4 hover:bg-violet-500 px-8 py-2 text-violet-700 hover:text-white border-2 border-violet-500 rounded-lg"
                        onClick={() => props.setLoginSection(false)}
                    >
                        Register
                </button>
                </div>
            </div>
        </div>
    )
}

export default SignIn;