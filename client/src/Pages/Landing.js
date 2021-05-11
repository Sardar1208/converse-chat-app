import React, { useRef, useEffect, useState } from "react";
import Login from "../components/Login/Login";

const Tag = (props) => {
  const ref = useRef(null);
  useEffect(() => {
    console.log("width", ref.current ? ref.current.offsetWidth : 0);
  }, [ref.current]);
  return (
    <>
      <span className="text-gray-400 font-mono" ref={ref}>
        {"<"}
        <span className="text-green-400">{props.tagName}</span>
        {">"}
        {props.isLink ? (
          <a
            href={props.content}
            className="text-violet-400 hover:text-violet-300"
            target="_blank"
          >
            {props.content}
          </a>
        ) : (
          <span className="text-white">{props.content}</span>
        )}
        {"</"}
        <span className="text-green-400">{props.tagName}</span>
        {">"}
      </span>
      <br />
    </>
  );
};

function Landing() {
  const [loginSection, setLoginSection] = React.useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmailName] = useState("");
  const [mobile, setMobileName] = useState("");
  const [password, setPasswordName] = useState("");
  return (
    <div className="grid grid-cols-10 h-screen">
      <div className="col-span-7 bg-violet-600 text-white flex justify-center items-center">
        <div className="px-20 py-12 pb-8 ">
          <h1 className="text-6xl font-bold items-end flex tracking-wider">
            Hi there
            <img src="/svg/wave.svg" className="w-14 ml-2" />,
          </h1>
          <h1 className="text-6xl font-bold items-end tracking-wider">
            Welcome to Converse
          </h1>
          <h4 className="text-4xl font-thin font-mono mt-8 flex items-end">
            {"</> Made with"}
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
                <Tag
                  tagName="GithubRepo"
                  content="https://github.com/Sardar1208/chat"
                  isLink={true}
                />
                <Tag
                  tagName="Description"
                  content={
                    <div className="ml-4">
                      Currently, Converse is a Socket based chat application
                      that connects users to other users and allows them to
                      exchange text messages in real-time.
                    </div>
                  }
                />
                <Tag
                  tagName="Features"
                  content={
                    <div className="ml-4 list-decimal block">
                      <li>Invite/Request based follower system</li>
                      <li>Handles offline user's messages</li>
                    </div>
                  }
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-12 px-4 col-span-3 bg-white flex justify-center items-center ">
        {loginSection ? (
          // Login Component
          <div className="w-100 px-4">
            <span className="font-bold text-4xl pl-2 border-l-4 border-red-400 text-gray-600">
              {/* Interested ?<br /> */}
              Login
            </span>
            <div>
              <div className="mb-3 pt-1 flex relative mt-12">
                <input
                  type="text"
                  className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                />
                <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                  Phone Numbe / Username
                </span>
              </div>
              <div className="mb-3 pt-1 flex relative mt-4">
                <input
                  type="password"
                  className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                />
                <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                  Password
                </span>
              </div>
              <div className="flex justify-center my-8">
                <button className="py-2 rounded-md px-8 bg-violet-500 text-white font-bold focus:bg-violet-700 hover:bg-violet-600">
                  Login
                </button>
              </div>
              <div className="flex items-center">
                <hr />
                <span className="px-2">OR</span>
                <hr />
              </div>
              <div className="flex justify-center items-center mt-6">
                <span>New to Converse?</span>
                <button
                  className="ml-4 hover:bg-violet-500 px-8 py-2 text-violet-700 hover:text-white border-2 border-violet-500 rounded-lg"
                  onClick={() => setLoginSection(false)}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Signup Component
          <div className="w-100 px-4">
            <span className="font-bold text-4xl pl-2 border-l-4 border-red-400 text-gray-600">
              Get Started
            </span>
            <div>
              <div className="mb-3 pt-1 flex relative mt-12 ">
                <input
                  type="text"
                  className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                />
                <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                  Full Name
                </span>
              </div>
              <div className="mb-3 pt-1 flex relative mt-4">
                <input
                  type="text"
                  className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                />
                <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                  Username
                </span>
              </div>
              <div className="mb-3 pt-1 flex relative mt-4">
                <input
                  type="email"
                  className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                />
                <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                  Email ID
                </span>
              </div>
              <div className="mb-3 pt-1 flex relative mt-4">
                <input
                  type="number"
                  className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                />
                <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                  Phone Number
                </span>
              </div>
              <div className="mb-3 pt-1 flex relative mt-4">
                <input
                  type="password"
                  className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
                />
                <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
                  Password
                </span>
              </div>
              <div className="flex justify-center my-6">
                <button className="py-2 rounded-md px-8 bg-violet-500 text-white font-bold focus:bg-violet-700 hover:bg-violet-600">
                  Register
                </button>
              </div>
              <div className="flex items-center">
                <hr />
                <span className="px-2">OR</span>
                <hr />
              </div>
              <div className="flex justify-center items-center mt-6">
                <span>Already a user?</span>
                <button
                  className="ml-4 hover:bg-violet-500 px-8 py-2 text-violet-700 hover:text-white border-2 border-violet-500 rounded-lg"
                  onClick={() => setLoginSection(true)}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Landing;
