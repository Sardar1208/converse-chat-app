import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import ChatHead from "./components/ChatHeads/ChatHead.js";
import TextPage from "./components/TextPage/TextPage.js";
import Login from "./components/Login/Login.js";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContext } from "./AppContext";
import io from "socket.io-client";


function App() {
  const [contacts, setContacts] = React.useState([]);
  const [currentContact, setCurrentContact] = React.useState(null);
  const [userSocket, setuserSocket] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const AppState = { contacts, setContacts, currentContact, setCurrentContact, userSocket, setuserSocket, username, setUsername};

  

  return (
    <AppContext.Provider value={AppState}>
      <Router>
        <div className="App">
          {/* <ChatHead info={{'name':"Sarthak"}} />
      <hr className="divide"/>
      <ChatHead info={{'name':"Rohit"}} />
      <hr className="divide"/>
      <ChatHead info={{'name':"Priyansh"}} />
      <hr className="divide"/> */}
          {/* <TextPage /> */}
          {/* <Login /> */}
        </div>

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/textPage" component={TextPage} />
          <Route path="/chatHead" component={ChatHead} />
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
