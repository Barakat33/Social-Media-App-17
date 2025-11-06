import { Server, Socket } from "socket.io";
import { MessageRepository } from "../../DB/model/message/message.repository";
import { ChatRepository } from "../../DB/model/chat/chat.repository";
import { ObjectId } from "mongoose";
import { z } from "zod"; // ✅ Zod validation

// ✅ 1. Define schema
const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  destId: z.string().min(1, "Destination user ID is required"),
});

interface ISendMessage {
  message: string;
  destId: string;
}

export const sendMessage =
  (socket: Socket, io: Server, connectedUsers: Map<string, string>) => {
    return async (data: ISendMessage) => {
      try {
        // ✅ 2. Validate input using Zod
        const { message, destId } = messageSchema.parse(data);

        // ✅ 3. Emit to sender and receiver
        const destSocket = connectedUsers.get(destId);
        socket.emit("successMessage", { message, destId });

        if (destSocket) {
          io.to(destSocket).emit("receiveMessage", { message, senderId: socket.data.user.id });
        }

        // ✅ 4. Save message in DB
        const messageRepo = new MessageRepository();
        const sender = socket.data.user.id;

        const createdMessage = await messageRepo.create({
          content: message,
          sender,
        });

        const chatRepo = new ChatRepository();
        const chat = await chatRepo.getOne({
          users: { $all: [destId, sender] },
        });

        if (!chat) {
          await chatRepo.create({
            users: [destId, sender],
            messages: [createdMessage._id as unknown as ObjectId],
          });
        } else {
          await chatRepo.update(
            { _id: chat._id },
            { $push: { messages: createdMessage._id } }
          );
        }
      } catch (error: any) {
        // 5. Handle validation or other errors
        if (error instanceof z.ZodError) {
          socket.emit("errorMessage", {
            success: false,
            message: "Invalid data format",
            issues: error.issues,
          });
        } else {
          socket.emit("errorMessage", {
            success: false,
            message: error.message || "Something went wrong",
          });
        }
      }
    };
  };
