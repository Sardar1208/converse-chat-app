import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import ChatHead from "./components/ChatHeads/ChatHead.js";
import TextPage from "./components/TextPage/TextPage.js";
import Login from "./components/Login/Login.js";
import Landing from "./Pages/Landing.js";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppContext } from "./AppContext";

// function Test() {
//   return (
//     <div className="bg-cyan-400 m-8 p-8 text-white font-bold text-center text-4xl">
//       {" "}
//       Testing Tailwind (Check App.js Test Component)
//     </div>
//   );
// }
function App() {
  const [contacts, setContacts] = React.useState([]);
  const [currentContact, setCurrentContact] = React.useState({});
  const [userSocket, setuserSocket] = React.useState(null);
  const [unreadCount, setUnreadCount] = React.useState({});
  const [loggedInUsername, setLoggedInUsername] = React.useState("");
  const [loggedInMobile, setLoggedInMobile] = React.useState("");
  const [conversationIds, setConversationIds] = React.useState([]);
  const [textQueue, setTextQueue] = React.useState([]);
  const lastElmRef = React.useRef(null);

  // const []
  const AppState = {
    contacts,
    setContacts,
    currentContact,
    setCurrentContact,
    userSocket,
    setuserSocket,
    unreadCount,
    setUnreadCount,
    conversationIds,
    setConversationIds,
    loggedInUsername,
    setLoggedInUsername,
    loggedInMobile,
    setLoggedInMobile,
    lastElmRef,
    textQueue,
    setTextQueue,
  };
  return (
    <AppContext.Provider value={AppState}>
      <Router>
        <div className="App"></div>

        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/textPage" component={TextPage} />
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
