import { MessageTypeEnum } from "../enums/message-type.enum";

export interface MessageData {
  username?: string;
  message?: string;
  type?: MessageTypeEnum;
}