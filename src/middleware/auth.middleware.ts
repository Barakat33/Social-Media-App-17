import { NextFunction,Request,Response } from "express";
import { verifyToken } from "../utlis/token";
import { UserRepository } from "../DB/index";
import { IAuthUser, NotFoundException } from "../utlis";
import type { RequestHandler } from "express";

export const isAuthenticated = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    const payload = verifyToken(token);
    const userRepository = new UserRepository();
    const user = await userRepository.exist({ _id: (payload as any)._id },{},
    {populate:[{path:"friends",select:"fullName firstName lastName"}]});
    if (!user) {
      throw new NotFoundException("User not found");
    }
    (req as IAuthUser).user = user as any;
    next();
  };
};
