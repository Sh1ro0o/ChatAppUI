import { MessageTypeEnum } from "../../enums/message-data-types.enum";

export interface MessageData {
  username?: string;
  message?: string;
  type?: MessageTypeEnum;
}