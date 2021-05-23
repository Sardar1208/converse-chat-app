import React, { useState } from "react";
import { AppContext } from "../../AppContext";

function Signup(props) {
  const { userSocket } = React.useContext(AppContext);

  const [fullName, setFullName] = useState("");
  const [fullNameValidation, setFullNameValidation] = useState("");
  const [userName, setUserName] = useState("");
  const [usernameValidation, setUsernameValidation] = useState("");
  const [email, setEmail] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileValidation, setMobileValidation] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");

  async function SignUp() {
    const res = await fetch(process.env.REACT_APP_API_URL + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullName,
        username: userName,
        email: email,
        mobile: mobile,
        password: password,
        socket_ID: userSocket.id,
      }),
    });

    const result = await res.json();
    if (result.result == "username already exists") {
      setUsernameValidation("username already exists");
    } else if (result.result == "An account with this email already exists") {
      setEmailValidation("An account with this email already exists");
    } else if (
      result.result == "An account with this mobile no already exists"
    ) {
      setMobileValidation("An account with this mobile no already exists");
    }
  }

  function validate() {
    let validated = 0;
    if (fullName.length == 0) {
      setFullNameValidation("full Name is required");
    } else {
      setFullNameValidation("");
      validated += 1;
    }

    if (userName.length == 0) {
      setUsernameValidation("username is required");
    } else {
      setUsernameValidation("");
      validated += 1;
    }

    if (email.length == 0) {
      setEmailValidation("email is required");
    } else {
      setEmailValidation("");
      validated += 1;
    }

    if (mobile.length == 0) {
      setMobileValidation("mobile no is required");
    } else if (mobile.length < 10) {
      setMobileValidation("invalid mobile no");
    } else {
      setMobileValidation("");
      validated += 1;
    }

    if (password.length == 0) {
      setPasswordValidation("password is required");
    } else if (password.length < 10) {
      setPasswordValidation("password should be atleast 10 charracters long");
    } else {
      setPasswordValidation("");
      validated += 1;
    }

    if (validated == 5) {
      console.log("signing up");
      SignUp();
    }
  }

  return (
    <div className="w-100 px-4">
      <span className="font-bold text-4xl pl-2 border-l-4 border-red-400 text-gray-600">
        Get Started
      </span>
      <div>
        <div>
          <div className="pt-1 flex relative mt-12 ">
            <input
              type="text"
              className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              value={fullName}
            />
            <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
              Full Name
            </span>
          </div>
          <div className="p-0 m-0 text-sm text-red-500">
            <span>{fullNameValidation}</span>
          </div>
        </div>

        <div>
          <div className="pt-1 flex relative mt-4">
            <input
              type="text"
              className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              value={userName}
            />
            <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
              Username
            </span>
          </div>
          <div className="p-0 m-0 text-sm text-red-500">
            <span>{usernameValidation}</span>
          </div>
        </div>

        <div>
          <div className="pt-1 flex relative mt-4">
            <input
              type="email"
              className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
            <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
              Email ID
            </span>
          </div>
          <div className="p-0 m-0 text-sm text-red-500">
            <span>{emailValidation}</span>
          </div>
        </div>

        <div>
          <div className="pt-1 flex relative mt-4">
            <input
              type="number"
              className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
              onChange={(e) => {
                setMobile(e.target.value);
              }}
              value={mobile}
            />
            <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
              Phone Number
            </span>
          </div>
          <div className="p-0 m-0 text-sm text-red-500">
            <span>{mobileValidation}</span>
          </div>
        </div>

        <div>
          <div className="pt-1 flex relative mt-4">
            <input
              type="password"
              className="form-input px-3 py-2.5 placeholder-blueGray-300 text-blueGray-600 relative border rounded border-blueGray-300 bg-transparent rounded text-sm outline-none focus:outline-none focus:ring w-full"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
            <span className="absolute -top-1.5 bg-white px-1 ml-2 text-gray-500 text-sm">
              Password
            </span>
          </div>
          <div className="p-0 m-0 text-sm text-red-500">
            <span>{passwordValidation}</span>
          </div>
        </div>

        <div className="flex justify-center my-6">
          <button
            onClick={validate}
            className="py-2 rounded-md px-8 bg-violet-500 text-white font-bold focus:bg-violet-700 hover:bg-violet-600"
          >
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
            onClick={() => props.setLoginSection(true)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
