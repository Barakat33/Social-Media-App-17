import { ChatRepository } from"../../DB/model/chat/chat.repository";
import { Request, Response } from "express";

class ChatService {
    
private readonly chatRepository = new ChatRepository();
getChat = async (req:Request, res:Response) => {
    //get data from req
    const { userId } = req.params as { userId: string };
    const userLoginId = req.user._id;
    const chat = await this.chatRepository.getOne(
        {
        users: {$all: [userId, userLoginId]},
        },
        {},
        {
        populate:[{path:"messages"}]}
    );
    return res.json({message:"done", success:true, data:{chat}});
};
}

export default new ChatService();
