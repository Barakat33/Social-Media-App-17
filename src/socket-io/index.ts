import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "./middleware";
import { chatEvents } from "./chatEvents";
import { sendMessage } from "./chat";

const connectedUsers = new Map<string, string>();

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.use(socketAuth);

  chatEvents(io, connectedUsers);

  io.on("connection", (socket: Socket) => {
    connectedUsers.set(socket.data.user._id, socket.id);
    console.log("✅ User connected:", socket.data.user._id);

    socket.on("sendMessage", sendMessage(socket, io, connectedUsers));

    socket.on("disconnect", () => {
      connectedUsers.delete(socket.data.user._id);
      console.log("❌ User disconnected:", socket.data.user._id);
    });
  });
};
