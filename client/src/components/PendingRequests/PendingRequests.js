import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppContext";
import { Profiles } from "../../Utils";
import { getContacts } from "../ChatHeads/ChatHead.js";

function PendingRequests(props) {
  const { contacts, setContacts, setConversationIds } = useContext(AppContext);
  const [noReqDisplay, setNoReqDisplay] = useState("none");
  const [pendingDisplay, setPendingDisplay] = useState("none");
  const [activeDisplay, setActiveDisplay] = useState("none");
  const [pendingTabStyleValues, setPendingTabStyleValues] = useState([
    "black",
    "600",
    "blue",
  ]);
  const [activeTabStyleValues, setActiveTabStyleValues] = useState([
    "gray",
    "600",
    "transparent",
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
          <div className="request-block bg-white mt-2 mx-3 rounded-xl overflow-hidden shadow-md">
            <div className="flex items-center p-3">
              <img src={Profiles[request.sender_avatar]} width="70px" />
              <span className="pl-2 text-xl">{request.sender_name}</span>
            </div>

            <div className="flex bg-violet-500 flex-col">
              <button
                className="p-1 accept-btn flex-1 px-3 hover:bg-violet-600"
                onClick={() => {
                  props.respond_request("accepted", request.sender_mobile);
                }}
              >
                <img src="/svg/sent.svg" width="30px" />
              </button>
              {/* <hr className="m-auto w-3/4 p-0 bg-violet-200"></hr> */}
              <button
                className="p-1 decline-btn flex-1 px-3"
                on
                onClick={() => {
                  props.respond_request("declined", request.sender_mobile);
                }}
              >
                <img src="/svg/cross.svg" width="30px" />
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
          <div className="request-block bg-white mt-2 mx-3 rounded-xl overflow-hidden shadow-md">
            <div className="flex items-center p-3">
              <img src={Profiles[i.reciever_avatar]} width="70px" />
              <span className="pl-2 text-xl">{i.reciever_name}</span>
            </div>

            <div className="flex bg-violet-500 flex-col">
              <button
                className="p-1 decline-btn flex-1 px-3"
                on
                onClick={() => {
                  props.deleteActiveRequest(i.reciever_mobile);
                }}
              >
                <img src="/svg/cross.svg" width="30px" />
              </button>
            </div>
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
    <div className="h-full bg-violet-50">
      <div className="flex justify-center bg-white mb-4">
        <span
          onClick={() => {
            setActiveTabStyleValues(["grey", "default", "transparent"]);
            setPendingTabStyleValues(["black", "600", "blue"]);
            setActiveDisplay("none");
            setPendingDisplay("block");
          }}
          className="text-lg flex-1 mx-2 py-2 text-center text-gray-500 border-blue-200 border-b-2 cursor-default hover:text-black hover:border-black hover:cursor-pointer pending-tab"
          style={pendingTabStyle}
        >
          RECEIVED
        </span>
        <span
          onClick={() => {
            setPendingTabStyleValues(["grey", "default", "transparent"]);
            setActiveTabStyleValues(["black", "600", "blue"]);
            setPendingDisplay("none");
            setActiveDisplay("block");
          }}
          className="flex-1 text-lg mx-2 py-2 text-center text-gray-500 border-blue-200 border-b-2 cursor-default hover:text-black hover:border-black hover:cursor-pointer active-tab"
          style={activeTabStyle}
        >
          SENT
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
