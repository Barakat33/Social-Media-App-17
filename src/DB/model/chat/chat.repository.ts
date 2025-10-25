import { AbstractRepostory } from "../../abstract.repository";
import { IChat } from "../../../utlis/common/interface";
import { Chat } from "./chat.model";

export class ChatRepository extends AbstractRepostory<IChat>{
    constructor(){
        super( Chat);
    }
}