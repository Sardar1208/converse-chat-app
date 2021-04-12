import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from "react-router-dom";
import "./ChatHead.css";
import { AppContext } from "../../AppContext";

function ChatHead() {
  const history = useHistory();
  const [usersList, SetUsersList] = useState();
  const { contacts, setContacts, setCurrentContact, userSocket } = useContext(AppContext);
  useEffect(async () => {

    if (!userSocket) {
      history.push("/login");
    }
    const res = await fetch("http://localhost:8080/get_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'get': "users",
      },
    });

    const result = await res.json();
    const newResult = result.result.split(",");
    console.log(newResult);
    setContacts(newResult);
    console.log("contacts = ", contacts);
    if (result.result != "no users") {
      let List = newResult.map((user) => {
        return (
          <Link onClick={() => setCurrentContact(user)} to="/textPage">
            <div className="chat-head" onClick={openChat}>
              <div className="card-text">
                <h1>{user}</h1>
                <span>
                  <img src="/svg/sent.svg" />
                </span>
                <h5>This is your last text...</h5>
              </div>
            </div>
          </Link>
        );
      });
      SetUsersList(List);
    }
  }, []);

  function openChat() { }

  return <div>{usersList}</div>;
}

export default ChatHead;
