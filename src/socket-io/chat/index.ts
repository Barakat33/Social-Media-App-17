import { Server, Socket } from "socket.io";
import { MessageRepository } from "../../DB/model/message/message.repository";
import { ChatRepository } from "../../DB/model/chat/chat.repository";
import { ObjectId } from "mongoose";

interface ISendMessage {
    message: string;
    destId: string;
}

export const sendMessage = 
 (socket:Socket,io:Server,
    connectedUsers:Map<string, string>
) => {
    return async (data:ISendMessage) => {
        //emit two
        const destSocket = connectedUsers.get(data.destId);
        socket.emit("successMessage",{data});
        if (destSocket) {
            io.to(destSocket).emit("receiveMessage",data);
        }
            //save into db
            //create message
            const messageRepo = new MessageRepository();
            const sender = socket.data.user.id;
            const createdMessage = await messageRepo.create({
                content:data.message,
                sender,
            })
            const chatRepo = new ChatRepository();
            const chat = await chatRepo.getOne({
                users:{$all: [data.destId, sender]}
            });
            //create chat if not exist
            if(!chat){
                await chatRepo.create({
                    users:[data.destId, sender],
                    messages:[createdMessage._id as unknown as ObjectId],
                });
            } else {
                await chatRepo.update(
                    { _id: chat._id },
                    { $push: { messages: createdMessage._id } }
                );
            }
        }
    }

