import { NextFunction,Request,Response } from "express"
import { BadRequestException } from "../utlis"
import { ZodType } from "zod"
import Joi from "joi";

export const generalFiled={
    id: Joi.string().length(24).hex().required(),
    attachment: Joi.object().required(),
    //file information
    filedName: Joi.string().required(),
    originalName: Joi.string().required(),
    encoding: Joi.string().required(),
    mimeType: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    size: Joi.number().required(),
    path: Joi.string().required(),
}

export const isvalid = (schema:ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
              //schema valiidate body
            let data ={...req.body,...req.params,...req.query}
            const result= schema.safeParse(data);
            if(result.success==false){
                let errMessages = result.error.issues.map((issue)=>({
                    path:issue.path[0] as string,
                    message:issue.message,
                }));
                throw new BadRequestException("validation failed",errMessages);
            }
            // Overwrite request data with parsed, safe data
            req.body = result.data as any;
            next();
    }   
}
