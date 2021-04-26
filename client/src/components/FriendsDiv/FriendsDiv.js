import React from 'react';

function FriendsDiv(props) {
    return (
        <div className="friends-innerdiv">
            <h3 className="friends-heading">Add your friends to the chat. Search using their unique mobile numbers.</h3>
            <input
                className="friends-input"
                type="text"
                placeholder="Search..."
                width="100%"
                onChange={(e) => {
                    props.setfriendsText(e.target.value);
                }}
                value={props.friendsText}
            />
            <button className="friends-button" onClick={props.searchContact}>Search</button>
        </div>
    )
}

export default FriendsDiv;