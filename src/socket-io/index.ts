import type { Server as HttpServer } from "http"
import { Server, Socket } from "socket.io"
import { socketAuth } from "./middleware";
import { sendMessage } from "./chat";

const connectedUsers = new Map<string,string>();

export const initSocket = (server: HttpServer) => {
    const io = new Server(server,{cors: {origin: "*"}});
    io.use(socketAuth);
    
    io.on("connection", (socket:Socket) => {
        connectedUsers.set(socket.data.user._id,socket.id);
        console.log(connectedUsers);
        console.log("User connected");
        socket.on("sendMessage",sendMessage(socket,io,connectedUsers));
    });
};