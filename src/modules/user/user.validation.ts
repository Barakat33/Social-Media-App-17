import Joi from "joi";
import {generalFiled} from "../../middleware/validation.middleware";

export const sendRequest = Joi.object({
    friendId: generalFiled.id.required(),
});
    