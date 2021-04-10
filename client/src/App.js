import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import logo from './logo.svg';
import ChatHead from "./components/ChatHeads/ChatHead.js";
import TextPage from "./components/TextPage/TextPage.js";
import Login from "./components/Login/Login.js";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [height, setHeight] = useState("5rem");

  function popup() {
    setHeight("30rem");
  }

  const style = {
    position: "absolute",
    bottom: "0",
    width: "25rem",
    height: height,
    backgroundColor: "grey",
    transition: "height 0.8s ease",
  }

  return (
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
  );
}

export default App;
