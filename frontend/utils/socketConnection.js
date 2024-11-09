import io from "socket.io-client";
const BASE_URL=process.env.BASE_URL||"localhost:8080"
const socket = io(BASE_URL);

export default socket;
