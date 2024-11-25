import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

export type MessageResponseT = {
  _id?: string;
  userMessage: string;
  botResponse: string;
  createdAt: Date;
};

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  // {"userMessage":"hi","botResponse":"Hi there! How can I help you today?\n"}
  isTyping = false;
  userMessage!: string;
  messages: MessageResponseT[] = [];
  private bus = new Subscription();
  private readonly _chatService = inject(ChatService);

  ngOnInit(): void {
    this.getMessages();
  }
  ngOnDestroy(): void {
    this.bus.unsubscribe();
  }

  sendMessage() {
    this.bus.add(
      this._chatService.sendMessage(this.userMessage).subscribe({
        next: (res) => {
          console.log(res);
          this.getMessages();
          this.userMessage = '';
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }
  private getMessages() {
    this.bus.add(
      this._chatService.getMessages().subscribe({
        next: (res) => {
          console.log(res);

          this.messages = res as MessageResponseT[];
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }
}
