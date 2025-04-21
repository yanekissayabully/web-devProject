import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="comments.length > 0">
      <h4>Комментарии:</h4>
      <div *ngFor="let comment of comments">
        <p><strong>{{ comment.author.username }}</strong>: {{ comment.text }}</p>
      </div>
    </div>

    <textarea [(ngModel)]="newComment" placeholder="Оставь комментарий..."></textarea>
    <button (click)="sendComment()">Отправить</button>
  `
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  comments: any[] = [];
  newComment: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.api.getComments(this.postId).subscribe(data => this.comments = data);
  }

  sendComment() {
    if (!this.newComment.trim()) return;
    this.api.createComment(this.postId, this.newComment).subscribe(() => {
      this.newComment = '';
      this.loadComments();
    });
  }
}
