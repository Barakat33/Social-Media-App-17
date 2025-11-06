import { NextFunction,Request,Response } from "express";
import { verifyToken } from "../utlis/token";
import { UserRepository } from "../DB/index";
import { NotFoundException } from "../utlis";

export const isAuthenticatedGraghql = async(context: any) => {
    const token = context.token;
    const payload = verifyToken(token);
    const userRepository = new UserRepository();
    const user = await userRepository.exist({ _id: (payload as any)._id },{},
    {populate:[{path:"friends",select:"fullName firstName lastName"}]});
    if (!user) {
      throw new NotFoundException("User not found");
    }
    context.user = user as any;
 };
