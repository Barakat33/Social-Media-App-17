import { Server, Socket } from "socket.io";
import { UserRepository } from "../DB/model/user/UserRepository";

export const chatEvents = (io: Server, connectedUsers: Map<string, string>) => {
  const userRepo = new UserRepository();

  io.on("connection", async (socket: Socket) => {
    const userId = socket.data.user.id;
    connectedUsers.set(userId, socket.id);

    // 🟢 user goes online
    await userRepo.update({ _id: userId }, { isOnline: true });
    io.emit("userStatusChanged", { userId, isOnline: true });
    console.log(`${userId} connected`);

    // ✏️ typing event
    socket.on("typing", (data: { chatId: string; isTyping: boolean }) => {
      io.to(data.chatId).emit("userTyping", {
        userId,
        chatId: data.chatId,
        isTyping: data.isTyping,
      });
    });

    // 🔴 user goes offline
    socket.on("disconnect", async () => {
      connectedUsers.delete(userId);
      await userRepo.update({ _id: userId }, { isOnline: false });
      io.emit("userStatusChanged", { userId, isOnline: false });
      console.log(`${userId} disconnected`);
    });
  });
};
