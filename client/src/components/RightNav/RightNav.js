import React from "react";
import { AppContext } from "../../AppContext";
import { Profiles } from "../../Utils";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
  animation,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

function RightNav(props) {
  const { currentContact } = React.useContext(AppContext);
  const MENU_ID = "menu-id";
  const { show } = useContextMenu({
    id: MENU_ID,
  });
  function handleItemClick({ event, props, triggerEvent, data }) {
    console.log(event, props, triggerEvent, data);
  }
  function displayMenu(e) {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    show(e);
  }

  

  return (
    <div className="my-navbar bg-violet-50 shadow-lg flex">
      <img
        src={`${Profiles[currentContact.avatar]}`}
        className="profile-img ml-4"
      />
      <a href="/home">
        <h3 className="text-gray-700 text-2xl">{currentContact.name}</h3>
      </a>
      <div className="ml-auto mr-4" onClick={displayMenu}>
        <img src="/svg/options.svg" width="25px" />
      </div>
      <Menu id={MENU_ID} animation={animation.fade} className="mt-4 mr-4">
        <Item onClick={()=>{props.Unfriend(currentContact.conversation_ID, currentContact.name)}}>Unfriend</Item>
      </Menu>
    </div>
  );
}

export default RightNav;
