import io from "socket.io-client";

export default async function connectSocket(setUserSocket) {
    const username = localStorage.getItem("username");
    console.log("app.jsakdjakldfmsalknasklfslkf");
    const socket = io("http://localhost:8080/");

    socket.on("connect", () => {
        setUserSocket(socket);
        console.log(`connected with id: ${socket.id}`);
        // console.log(socketID);
    });

    console.log("from signin", socket.id);
    const res = await fetch("http://localhost:8080/login_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: `${username}`,
        socketID: `${socket.id}`,
      }),
    });

    return await res.json();
}