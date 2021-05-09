import React, { useRef, useEffect } from "react";

const Tag = (props) => {
    const ref = useRef(null);
    useEffect(() => {
        console.log('width', ref.current ? ref.current.offsetWidth : 0);
    }, [ref.current]);
    return (
        <>
            <span className="text-gray-400 font-mono" ref={ref}>
                {"<"}<span className="text-green-400">{props.tagName}</span>{">"}
                {props.isLink ? <a href={props.content} className="text-violet-400 hover:text-violet-300" target="_blank">
                    {props.content}</a> : <span className="text-white">{props.content}</span>}
                {"</"}<span className="text-green-400">{props.tagName}</span>{">"}
            </span>
            <br />
        </>
    )
}

function Landing() {
    return (
        <div className="grid grid-cols-10 h-screen">
            <div className="col-span-7 bg-violet-600 text-white">
                <div className="px-16 py-12 pb-8">
                    <h1 className="text-6xl font-bold items-end flex">
                        Hi there
                        <img src="/svg/wave.svg" className="w-14 ml-2" />,
                    </h1>
                    <h1 className="text-6xl font-bold items-end">Welcome to Converse</h1>
                    <h4 className="text-4xl font-thin font-mono mt-8 flex items-end">{"</> Made with"}
                        <img src="/svg/love.svg" className="w-10 ml-2 mx-3" /> {"in React"}
                    </h4>
                    <div className="mt-8 bg-blueGray-700 rounded-xl overflow-hidden shadow-2xl">
                        <div className="bg-coolGray-600 p-3 items-center flex">
                            <div className="rounded-full p-2.5 bg-red-400"></div>
                            <div className="rounded-full p-2.5 bg-yellow-400 mx-2"></div>
                            <div className="rounded-full p-2.5 bg-green-400"></div>
                        </div>
                        <div className="px-4 pb-2 pt-2">
                            <p className="">
                                <Tag tagName="Version" content=" v.1.0.0 " />
                                <Tag tagName="GithubLink" content="https://github.com/Sardar1208/chat" isLink={true} />
                                <Tag tagName="Description" content={<div className="ml-4">
                                    Currently, Converse is a Socket based chat application that connects
                                    users to other users and allows them to exchange text messages in real-time.
                                </div>} />
                                <Tag tagName="Features" content={
                                    <div className="ml-4 list-decimal block">
                                        <li>Invite/Request based follower system</li>
                                        <li>Handles offline user's messages</li>
                                    </div>}
                                />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-12 px-4 col-span-3 bg-white">
                <h1 className="font-bold text-4xl">Interested ?<br />Get started now!</h1>
                <div>

                    <div className="mb-3 pt-0">
                        <label>Full Name</label>
                        <input type="text" placeholder="Placeholder" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing;