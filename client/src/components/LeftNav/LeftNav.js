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
    <div className="left-navbar">
      <div>
        <span className="my-profile">{loggedInUsername}</span>
      </div>
      <div className="options px-6">
        <button
          className="pl-1.5 bg-white shadow relative inline-block add-friend-btn"
          onClick={() => {
            props.function("add_friend");
          }}
        >
          <img src="/svg/add.svg" width="25px" />
          <span className="tooltip-text absolute bg-gray-800 text-gray-100 shadow text-center rounded-lg z-10 top-full -right-7 mt-2 w-24">
            Add Friends
          </span>
        </button>

        <button
          className="pl-1.5 bg-white shadow relative inline-block requests-btn"
          onClick={() => {
            props.function("pending_requests");
          }}
          style={pendingButtonStyles}
        >
          <img src="/svg/friends.svg" width="25px" />
          <span className="tooltip-text absolute bg-gray-800 text-gray-100 shadow text-center rounded-lg z-10 top-full -right-5 mt-2 w-20">
            Requests
          </span>
        </button>
      </div>
    </div>
  );
}

export default LeftNav;
