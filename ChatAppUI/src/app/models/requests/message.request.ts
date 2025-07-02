import { MessageTypeEnum } from "../../components/chat-room/enums/message-type.enum";

export class MessageRequest {
  constructor(
    public groupName: string,
    public type: MessageTypeEnum,
    public username?: string,
    public message?: string,
  ) {}
}