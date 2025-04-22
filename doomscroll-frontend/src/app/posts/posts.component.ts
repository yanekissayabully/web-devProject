import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommentsComponent } from '../comments/comments.component';


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentsComponent],
  template: `
  <h2>💀 DOOMSCROLL FEED</h2>

  <div class="new-post">
    <textarea [(ngModel)]="newPost" placeholder="Что происходит?.."></textarea>
    <button (click)="createPost()">Опубликовать</button>
  </div>

  <div *ngFor="let post of posts" class="post-card">
    <div class="post-header">
      <strong>{{ post.author.username }}</strong>
      <span class="timestamp">{{ post.created_at | date:'short' }}</span>
    </div>
    <div class="post-content">
      {{ post.content }}
    </div>

    <div class="post-actions">
      <span>❤️ {{ post.likes }}</span>
      <button (click)="like(post.id)">Like</button>
    </div>

    <div *ngIf="post.comments?.length">
      <p class="comment-header">💬 Комментарии:</p>
      <div *ngFor="let comment of post.comments" class="comment">
        <strong>{{ comment.author.username }}:</strong> {{ comment.text }}
      </div>
    </div>

    <div class="comment-form">
      <textarea [(ngModel)]="commentTexts[post.id]" placeholder="Оставь комментарий..."></textarea>
      <button (click)="comment(post.id)">Отправить</button>
    </div>
  </div>
`

})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  newPost: string = '';
  commentTexts: {[postId: number]: string} = {};
  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.api.getPosts().subscribe(data => this.posts = data);
  }

  createPost() {
    if (!this.newPost.trim()) return;

    this.api.createPost(this.newPost).subscribe({
      next: () => {
        this.newPost = '';
        this.loadPosts();

        document.body.style.backgroundColor = '#292929';
        setTimeout(() => {
          document.body.style.backgroundColor = '';
        }, 100);
      },
      error: () => alert('Ошибка при создании поста')
    });
  }

  like(postId: number) {
    this.api.likePost(postId).subscribe(() => this.loadPosts());
  }

  comment(postId: number){
    const text = this.commentTexts[postId];
    if (!text?.trim()) return;

    this.api.createComment(postId, text).subscribe(() => {
      this.commentTexts[postId] = '';
      this.loadPosts();
    });
  }
}
