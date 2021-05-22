import React from "react";
import { AppContext } from "../../AppContext";

function LeftNav(props) {
  const { loggedInUsername } = React.useContext(AppContext);

  let pendingButtonStyles = {
    border: "2px solid",
    borderColor: props.pendingRequestcolor,
    transition: "borderColor 0.3s ease",
  };

  return (
    <div className="left-navbar bg-violet-500 shadow">
      <div>
        <span className="font-semibold text-2xl pl-4 text-white">{loggedInUsername}</span>
      </div>
      <div className="h-full flex w-1/2 justify-between">
        <button
          className="relative inline-block requests-btn flex-1 justify-center flex items-center hover:bg-violet-600"
          onClick={() => {
            props.function("chats");
          }}
        >
          <img src="/svg/people.svg" width="25px" />
          <span className="tooltip-text absolute bg-gray-800 text-gray-100 shadow text-center rounded-lg top-full z-10 -right-3 mt-2 w-20">
            Chat
          </span>
        </button>

        <button
          className="relative inline-block add-friend-btn flex-1 justify-center flex items-center hover:bg-violet-600"
          onClick={() => {
            props.function("add_friend");
          }}
        >
          <img src="/svg/add.svg" width="25px" />
          <span className="tooltip-text absolute bg-gray-800 text-gray-100 shadow text-center rounded-lg z-10 top-full -right-4 mt-2 w-24">
            Add Friends
          </span>
        </button>

        <button
          className="relative inline-block requests-btn flex-1 justify-center flex items-center hover:bg-violet-600"
          onClick={() => {
            props.function("pending_requests");
          }}
          // style={pendingButtonStyles}
        >
          <img src="/svg/friends.svg" width="25px" />
          <span className="tooltip-text absolute bg-gray-800 text-gray-100 shadow text-center rounded-lg z-100 top-full -right-1 mt-2 w-20">
            Requests
          </span>
        </button>

      </div>
    </div>
  );
}

export default LeftNav;
