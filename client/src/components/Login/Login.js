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
  const [mobile, setMobile] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [socketID, setsocketID] = useState("");
  const [loadingDisplay, setLoadingDisplay] = useState("block");
  const [loginDisplay, setLoginDisplay] = useState("none");
  const [loginDivDisplay, setLoginDivDisplay] = useState("block");
  const [addDetailsDisplay, setaddDetailsDisplay] = useState("none");

  let loadingStyle = {
    display: loadingDisplay,
  };

  let loginStyle = {
    display: loginDisplay,
  };

  let addDetailsStyle = {
    display: addDetailsDisplay,
  };

  let loginDivStyle = {
    display: loginDivDisplay,
  };

  useEffect(async () => {
    const socket = io(`${process.env.REACT_APP_API_URL}`);

    socket.on("connect", () => {
      console.log(`connected with id: ${socket.id}`);
      //Sets the state after connection
      setuserSocket(socket);
      setsocketID(socket.id);

      //checks if user is in sessionStorage and logs in directly
      const localUsername = sessionStorage.getItem("loggedInUser");
      if (localUsername) {
        setMobile(localUsername);
        CheckSignin(localUsername, socket.id);
      } else {
        setLoadingDisplay("none");
        setLoginDisplay("block");
      }
    });
  }, []);

  // if user is exists directly logs in, else asks for additional details.
  async function CheckSignin(mobile_no, id) {
    const res = await fetch(process.env.REACT_APP_API_URL + "/login_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: mobile_no,
        socketID: `${id}`,
      }),
    });

    const result = await res.json();
    console.log(await result);

    // if user exists then login
    if (result.result == "success") {
      sessionStorage.setItem("loggedInUser", `${mobile_no}`);
      history.push("/textPage");
    }
    //id new user ask additional info
    else if (result.result == "new user") {
      setaddDetailsDisplay("block");
      setLoginDivDisplay("none");
    }
  }

  // Sign in the newly created user
  async function Signin() {
    const res = await fetch(process.env.REACT_APP_API_URL + "/user_details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: username,
        mobile: mobile,
        socket_ID: socketID,
      }),
    });

    const result = await res.json();
    console.log(await result);
    if (result.result == "success") {
      sessionStorage.setItem("loggedInUser", `${mobile}`);
      history.push("/textPage");
    }
  }

  return (
    <div className="login-page">
      <div className="loading-screen" style={loadingStyle}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
      <div className="Login" style={loginStyle}>
        <div className="text">
          <h1 className="login-heading">Welcome to Converse!</h1>
          <p className="login-desc">
            Hi! Converse is a real time chat application that offers the basic
            functionality of chat along with the features like groups, broadcast
            channels and more...
          </p>
          <hr className="hr"></hr>

          <div className="login-div" style={loginDivStyle}>
            <h1 className="login-heading">Login with your mobile no: </h1>
            <input
              className="input-field"
              type="number"
              placeholder="Mobile No."
              onChange={(e) => {
                setMobile(e.target.value);
              }}
              value={mobile}
            />
            <button
              className="login-btn"
              onClick={() => {
                CheckSignin(mobile, userSocket.id);
              }}
            >
              Login
            </button>
          </div>

          <div className="additional-details" style={addDetailsStyle}>
            <h1 className="login-heading">
              We just need a few additional details...
            </h1>
            <input
              className="input-field"
              type="email"
              placeholder="email id."
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />

            <input
              className="input-field"
              type="text"
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            />

            <button
              className="login-btn"
              onClick={() => {
                Signin();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
