import React from "react";

function OnBoarding(props) {
  return (
    <div className="flex bg-white items-center justify-center flex-col font-sans text-gray-500 text-lg ">
      <img src="/svg/logo.svg" />
      <h1 className="text-4xl font-bold text-gray-700 tracking-wider mb-10">
        Hey! {props.username}
      </h1>
      <p className="text-xl font-bold">
        Welcome to converse, Here are some tips to get you started
      </p>
      <ul className="list-disc">
        <li>
          <p className="mb-0.5">
            Head to the left section to select the person you want to chat with
          </p>
        </li>
        <li>
          <p>Click on the add friend icon on top-left to add friends</p>
        </li>
      </ul>
    </div>
  );
}

export default OnBoarding;
