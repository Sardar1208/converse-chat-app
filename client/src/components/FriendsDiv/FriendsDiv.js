import React from "react";

function FriendsDiv(props) {
  return (
    <div className="friends-innerdiv px-4 flex justify-center align-center flex-col">
      <h3 className="friends-heading text-violet-800">
        You can add friends using their username or password. Note it's case
        sensitive.
      </h3>
      <input
        type="text"
        placeholder="Enter Username/Ph.no"
        className={"text-base w-full px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 border-2 rounded bg-white rounded text-sm outline-none focus:outline-none focus:ring " + (props.reqSentObj.color === "green" ? "border-blueGray-300" : "border-red-400")} 
        onChange={(e) => {
          props.setfriendsText(e.target.value);
        }}
        value={props.friendsText}
        // style={{borderColor: props.reqSentObj.color}}
      />
      <span className="text-xs ml-2" style={{color:props.reqSentObj.color}}>{props.reqSentObj.content}</span>

      <div className="m-auto">
        <button
          className="bg-violet-500 mt-4 px-4 py-2 text-md font-semibold rounded-xl text-white shadow-md"
          onClick={props.searchContact}
        >
          Send Request
        </button>
      </div>
    </div>
  );
}

export default FriendsDiv;
