import React, { useState, useEffect } from "react";
import { AppContext } from "../../AppContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  Link,
} from "react-router-dom";
import io from "socket.io-client";
import TextPage from "../TextPage/TextPage";
import connectSocket from "../Utility/connectSocket";
import "./Login.css";

function Login() {
  const { setuserSocket,userSocket,username,setUsername } = React.useContext(AppContext);

  const history = useHistory();
  // const [username, setUsername] = useState("");
  // const [socketID, setsocketID] = useState("");
  // let socketID = "";

  useEffect(() => {
    console.log("asdada");
    
  }, []);

  async function Signin() {
    if(username){
      history.push("/chatHead");
    }
    const result = await connectSocket(setuserSocket);
    console.log("result: ",await result);
    if (result.result == "success") {
      localStorage.setItem("username",`${username}`);
      history.push("/chatHead");
      // render chat page and remove this page
    }
  }

  return (
    <div>
      <div className="Login">
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
            <button onClick={Signin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
