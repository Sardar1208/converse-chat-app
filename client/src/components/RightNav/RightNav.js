import React from "react";
import { AppContext } from "../../AppContext";
import { Profiles } from "../../Utils";

function RightNav() {
  const { currentContact } = React.useContext(AppContext);

  return (
    <div className="my-navbar bg-violet-50 shadow-lg">
      {/* <button className="back-button">
                <img src="/svg/back.svg" />
            </button> */}

      <img src={`${Profiles[currentContact.avatar]}`} className="profile-img ml-4" />
      <a href="/home">
        <h3 className="text-gray-700 text-2xl">{currentContact.name}</h3>
      </a>

      {/* <img src="/svg/status.svg" className="status" /> */}
    </div>
  );
}

export default RightNav;
