import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppContext";
import { getContacts } from "../ChatHeads/ChatHead.js";

function PendingRequests(props) {
  const { contacts, setContacts, setConversationIds } = useContext(AppContext);
  const [noReqDisplay, setNoReqDisplay] = useState("none");
  const [pendingDisplay, setPendingDisplay] = useState("none");
  const [activeDisplay, setActiveDisplay] = useState("none");
  const [pendingTabStyleValues, setPendingTabStyleValues] = useState([
    "black",
    "bold",
    "blue",
  ]);
  const [activeTabStyleValues, setActiveTabStyleValues] = useState([
    "grey",
    "default",
    "lightGray",
  ]);
  const [activeRequestsList, setActiveRequestsList] = useState([]);

  let pendingTabStyle = {
    color: pendingTabStyleValues[0],
    fontWeight: pendingTabStyleValues[1],
    borderColor: pendingTabStyleValues[2],
  };
  let activeTabStyle = {
    color: activeTabStyleValues[0],
    fontWeight: activeTabStyleValues[1],
    borderColor: activeTabStyleValues[2],
  };

  useEffect(() => {
    getContacts(setContacts, setConversationIds, "PendingRequests");

    //TODO - run this when the app loads
    let listOfRequests = props.requests.map((request) => {
      if (request) {
        return (
          <div className="request-block bg-white mt-2 mx-3 rounded-xl border-l-8 border-violet-500">
            <span className="pl-2 text-2xl">{request.sender_name}</span>
            <div>
              <button
                className="p-1 rounded-full accept-btn"
                onClick={() => {
                  props.respond_request("accepted", request.sender_mobile);
                }}
              >
                <img src="/svg/sent.svg" width="25px" />
              </button>
              <button
                className="p-1 rounded-full decline-btn"
                on
                onClick={() => {
                  props.respond_request("declined", request.sender_mobile);
                }}
              >
                <img src="/svg/cross.svg" width="25px" />
              </button>
            </div>
          </div>
        );
      }
    });
    if (listOfRequests.length == 0) {
      setNoReqDisplay("flex");
    } else {
      setNoReqDisplay("none");
    }
    props.setRequestList(listOfRequests);
  }, [props.requests]);

  useEffect(() => {
    let allActiveRequests = props.activeRequests.map((i) => {
      if (i) {
        return (
          <div className="bg-red-200">
            <span>{i.reciever_name}</span>
            <button
              onClick={() => {
                props.deleteActiveRequest(i.reciever_mobile);
              }}
              className="bg-red-500 ml-6"
            >
              Cancel
            </button>
          </div>
        );
      }
    });
    if (allActiveRequests.length == 0) {
      setNoReqDisplay("flex");
    } else {
      setNoReqDisplay("none");
    }
    setActiveRequestsList(allActiveRequests);
  }, [props.activeRequests]);

  return (
    <div className="h-full bg-blueGray-50">
      <div className="flex justify-center bg-white pb-2">
        <span
          onClick={() => {
            setActiveTabStyleValues(["grey", "default", "lightGray"]);
            setPendingTabStyleValues(["black", "bold", "blue"]);
            setActiveDisplay("none");
            setPendingDisplay("block");
          }}
          className="mr-4 text-lg text-gray-500 border-blue-200 border-b-2 cursor-default hover:text-black hover:border-black hover:cursor-pointer pending-tab"
          style={pendingTabStyle}
        >
          PENDING
        </span>
        <span
          onClick={() => {
            setPendingTabStyleValues(["grey", "default", "lightGray"]);
            setActiveTabStyleValues(["black", "bold", "blue"]);
            setPendingDisplay("none");
            setActiveDisplay("block");
          }}
          className="ml-4 text-lg text-gray-500 border-blue-200 border-b-2  cursor-default hover:text-black hover:border-black hover:cursor-pointer active-tab"
          style={activeTabStyle}
        >
          ACTIVE
        </span>
      </div>

      <div className="h-full" style={{ display: activeDisplay }}>
        <div
          className="no-req h-full m-auto flex"
          style={{ display: noReqDisplay }}
        >
          <h4 className="text-center m-auto self-center text-gray-600">
            There are no active requests.
          </h4>
        </div>
        <div>{activeRequestsList}</div>
      </div>

      <div className="h-full" style={{ display: pendingDisplay }}>
        <div
          className="no-req h-full m-auto flex"
          style={{ display: noReqDisplay }}
        >
          <h4 className="text-center m-auto self-center text-gray-600">
            There are no pending friend requests.
          </h4>
        </div>
        <div>{props.requestList}</div>
      </div>
    </div>
  );
}

export default PendingRequests;
