import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="messages">
      <h3>Чат с {{ username }}</h3>

      <div *ngFor="let msg of messages" class="message">
        <b>{{ msg.sender.username }}:</b> {{ msg.text }}
      </div>

      <textarea [(ngModel)]="newMessage" placeholder="Напиши сообщение..."></textarea>
      <button (click)="send()">Отправить</button>
    </div>
  `
})
export class ChatComponent implements OnInit {
  username = '';
  threadId!: number;
  messages: any[] = [];
  newMessage: string = '';

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.api.getOrCreateThread(this.username).subscribe(thread => {
      this.threadId = thread.id;
      this.loadMessages();
    });
  }

  loadMessages() {
    this.api.getMessages(this.threadId).subscribe(res => {
      this.messages = res;
    });
  }

  send() {
    if (!this.newMessage.trim()) return;
    this.api.sendMessage(this.threadId, this.newMessage).subscribe(() => {
      this.newMessage = '';
      this.loadMessages();
    });
  }
}
