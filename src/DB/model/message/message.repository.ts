import { AbstractRepostory } from "../../abstract.repository";
import { IMessage } from "../../../utlis/common/interface";
import { Message } from "./message.model";

export class MessageRepository extends AbstractRepostory<IMessage>{
    constructor(){
        super( Message);
    }
}