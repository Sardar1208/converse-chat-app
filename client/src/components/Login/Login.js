import React, { useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { Spinner } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link,
} from "react-router-dom";
import io from "socket.io-client";
import "./Login.css";

function Login() {
  const { userSocket, setuserSocket } = React.useContext(AppContext);

  const history = useHistory();
  const [username, setUsername] = useState("");
  const [socketID, setsocketID] = useState("");
  const [loadingDisplay, setLoadingDisplay] = useState("block");
  const [loginDisplay, setLoginDisplay] = useState("none");

  let loadingStyle = {
    display: loadingDisplay,
  }

  let loginStyle = {
    display: loginDisplay,
  }

  useEffect(async () => {
    console.log("asdada");
    const socket = io("http://localhost:8080/");

    socket.on("connect", () => {
      console.log(`connected with id: ${socket.id}`);
      setuserSocket(socket);
      setsocketID(socket.id);
      console.log(socket.id);
      const localUsername = sessionStorage.getItem("loggedInUser");
      if (localUsername) {
        setUsername(localUsername);
        Signin(localUsername, socket.id);
      } else {
        setLoadingDisplay("none");
        setLoginDisplay("block");
      }
    });


  }, []);

  async function Signin(uname, id) {

    console.log("in signin");
    console.log("from signin", id);
    const res = await fetch("http://localhost:8080/login_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: `${uname}`,
        socketID: `${id}`,
      }),
    });

    const result = await res.json();
    console.log(await result);
    if (result.result == "success") {
      sessionStorage.setItem("loggedInUser", `${uname}`)
      history.push("/chatHead");
      // render chat page and remove this page
    }
  }

  return (
    <div>
      <div className="loading-screen" style={loadingStyle}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
      <div className="Login" style={loginStyle}>
        <div className="text">
          <div>
            <input
              className="text"
              type="text"
              placeholder="Login"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            />
          </div>
          <div>
            <button onClick={() => { Signin(username, userSocket.id) }}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
