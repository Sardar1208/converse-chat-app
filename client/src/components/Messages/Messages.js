import React, { useEffect, useState, useRef, useContext } from "react";
import { AppContext } from "../../AppContext";

// TODD - improve the frontend of unread messages div.
export function scroll(lastElmRef, behavior = "smooth") {
  console.log("behaviour: ", behavior);
  if (lastElmRef.current) {
    lastElmRef.current.scrollIntoView({ behavior });
  }
}

function Messages(props) {
  const { lastElmRef, currentContact } = useContext(AppContext);
  const [totalMsg, setTotalMsg] = useState([]);
  const [finalMsg, setfinalMsg] = useState([]);
  const [showDown, setShowDown] = useState(false);
  //   const lastElmRef = useRef(null);

  useEffect(() => {
    scroll(lastElmRef, "auto");
  }, [finalMsg]);

  useEffect(async () => {
    // console.log("commonMsg are: ", props.commonMsg);
    // console.log("pendingMsg are: ", props.pendingMsg);
    let totalMsg = await props.commonMsg.map((i) => {
      const date = new Date(parseInt(i.time));
      const temp = date.toLocaleTimeString().split(" ");
      const temp2 = temp[0].slice(0, -3);
      const time = temp2 + " " + temp[1];
      return {
        data: i.data,
        sender: i.sender,
        time: time,
        date: date.toDateString().slice(4),
      };
    });
    let totalMsg2 = await props.pendingMsg.map((i) => {
      const date = new Date(parseInt(i.time));
      const temp = date.toLocaleTimeString().split(" ");
      const temp2 = temp[0].slice(0, -3);
      const time = temp2 + " " + temp[1];
      return {
        data: i.data,
        sender: i.sender,
        time: time,
        date: date.toDateString().slice(4),
      };
    });
    let temp = totalMsg.concat(totalMsg2);
    setTotalMsg(temp);
    const temp2 = totalMsg;
    setfinalMsg(temp2.splice(temp2.length - 25, 25));
    // setfinalMsg(temp);
  }, [props.pendingMsg, props.commonMsg]);

  return (
    <div
      className="messages bg-white overflow-auto relative"
      onScroll={(e) => {
        console.log("scrolling", e.target.clientHeight);
        if (
          e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) >
          500
        ) {
          setShowDown(true);
        }

        if (
          e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) <
          500
        ) {
          setShowDown(false);
        }

        // if (e.target.scrollTop == 0) {
        //   // TODO - make the splice dynamic.
        //   // TODO - Set the scrollTop to the where it was before expanding the list.
        //   const pastHeight = e;
        //   let temp = totalMsg;
        //   setfinalMsg(temp.splice(temp.length - 50, 50));
        //   e = pastHeight;
        // }
      }}
    >
      {finalMsg.map((value, key, prevArr) => {
        return (
          <>
            {prevArr[key - 1]?.date !== prevArr[key].date ? (
              <span className="justify-center flex">
                <span className="bg-cyan-100 px-3 py-1 rounded-xl text-xs text-cyan-500">
                  {prevArr[key].date}
                </span>
              </span>
            ) : null}
            <div className="">
              <div
                key={key + "-" + value.data}
                className={
                  (value.sender == "me"
                    ? "bg-violet-500 text-white ml-auto mr-8 rounded-l-2xl rounded-br-2xl relative"
                    : "bg-blueGray-200 max-w-2xl mr-auto ml-8 rounded-r-2xl rounded-bl-2xl relative") +
                  " my-3 px-4 py-3 break-words chat-bubble"
                }
              >
                {value.sender == "me" ? (
                  <div className="border-violet-500 triangle absolute top-0 -right-4"></div>
                ) : (
                  <div className="border-blueGray-200 triangle absolute top-0 -left-4"></div>
                )}
                <div className="break-words www">{value.data}</div>

                <div
                  className={
                    value.sender == "me"
                      ? "text-tiny text-violet-200 text-right"
                      : "text-tiny text-gray-500 text-right"
                  }
                >
                  {value.time}
                </div>

                {/* <span className="-mr-6 flex text-right text-tiny text-violet-200">
                    {value.time}
                  </span> */}
              </div>
            </div>
          </>
        );
      })}
      {/* {console.log("lastelemref: ", lastElmRef)} */}
      <div ref={lastElmRef} className="mt-12"></div>
      {showDown ? (
        <div
          onClick={() => {
            scroll(lastElmRef);
          }}
          className="fixed bottom-20 flex justify-center items-center w-9/12 cursor-pointer"
        >
          <img src="/svg/down.svg" width="24px" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Messages;
