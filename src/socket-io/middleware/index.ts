import { Socket } from "socket.io";
import { verifyToken } from "../../utlis/token";
import { UserRepository } from "../../DB";

export const socketAuth =async(socket:Socket, next:Function) => {
        try {
            const authrization = socket.handshake.auth.token;
            const payload = verifyToken(authrization);
            const userReposity =new UserRepository();
            const user = await userReposity.getOne({_id:payload._id});
            if(!user){
                throw new Error("User not found");
            }
            socket.data.user = user;
            next();
        } catch (error) {
            next(error)//emit error 
        }
        
    }