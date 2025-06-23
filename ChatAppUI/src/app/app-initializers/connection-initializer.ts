import { inject } from "@angular/core";
import { ChatService } from "../services/chat.service";

export const intializeConnectionFn = () => {
  const chatService = inject(ChatService);
  
  return chatService.connectionStart()
      .then((success) => {
        if(success) {
          console.log('connection established!!!!');
        }
        else {
          console.log('connection failed!!!!');
        }
    });
};