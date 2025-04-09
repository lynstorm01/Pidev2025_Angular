import { Component } from '@angular/core';
import { ChatService } from '../services/ChatService';


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {

  userMessage: string = '';
  botMessages: string[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (this.userMessage.trim()) {
      this.chatService.sendMessage(this.userMessage).subscribe((response) => {
        this.botMessages.push(response);
      });
      this.userMessage = ''; // Clear input after sending message
    }
  }
}
