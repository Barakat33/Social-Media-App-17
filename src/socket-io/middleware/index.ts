import { Socket } from "socket.io";
import { verifyToken } from "../../utlis/token";
import { UserRepository } from "../../DB";

export const socketAuth = async (socket: Socket, next: Function) => {
  try {
    const auth = socket.handshake.auth.token;
    const payload = verifyToken(auth);
    const userRepo = new UserRepository();
    const user = await userRepo.getOne({ _id: payload._id });

    if (!user) throw new Error("User not found");

    socket.data.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
