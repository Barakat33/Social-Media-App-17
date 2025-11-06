import { ZodType } from "zod";
import { BadRequestException } from "../utlis";

export const isvalidGraghql = (schema: ZodType,args:any) => {
        const result = schema.safeParse(args);
          
        if (!result.success) {
            let errMessages = result.error.issues.map((issue)=>({
                filed:issue.path[0],
                message:issue.message,
            }));
            throw new BadRequestException(JSON.stringify(errMessages),errMessages);
                }   
    }