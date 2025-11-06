import { JwtPayload } from "jsonwebtoken";
import { GENDER, REACTION, SYS_ROLE, USER_AGENT } from "../enum";
import { Request } from "express";
import { Document, ObjectId, Types } from "mongoose";

export interface IAttachment {
  url: string;
  id: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  tempEmail?: string | undefined;
  password: string;
  credentialsUpdatedAt: Date;
  phoneNumber?: string | undefined;
  role: SYS_ROLE;
  gender: GENDER;
  userAgent: USER_AGENT;
  otp?: string | undefined;
  otpExpiry?: Date | undefined;
  isVerified: boolean;
  _id: Types.ObjectId;
  friends: Types.ObjectId[];
  blockedUsers?: Types.ObjectId[];
  isBlocked?: boolean;
  friendRequests?: Types.ObjectId[];
  isOnline?: boolean;
}

export interface IComment{
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  parentId?: Types.ObjectId | null; // nullable for top-level comments
  content?: string;
  attachments?: IAttachment[];
  reactions: IReaction[];
  mentions?: Types.ObjectId[]; 
  isFrozen?: boolean;
  isDeleted?: boolean;
}

export interface IMessage {
  readonly _id:ObjectId,
  content:string;
  sender:ObjectId,
  attachments?:IAttachment[],
  reactions:IReaction[],
}

export interface IChat {
  readonly _id:ObjectId,
  users:ObjectId[],
  messages:ObjectId[],
}

export interface IPayload extends JwtPayload {
  id: string;
  email: string;
  role: SYS_ROLE;
}

export interface IAuthUser extends Request {
  user: IUser & Document;
}

export interface IReaction {
  reaction: REACTION;
  userId: Types.ObjectId;
}

export interface IPost {
  userId: Types.ObjectId;
  content: string;
  reactions: IReaction[];
  attachments?: IAttachment[];
  isFrozen?: boolean;
  isDeleted?: boolean;
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    _id: string;
    role: number;
  }
}


declare module "graphql" {
  interface GraphQLError{
    message:string;
    success:boolean;
    errorDetails:any 
    errorMessage:string;
  } 
}