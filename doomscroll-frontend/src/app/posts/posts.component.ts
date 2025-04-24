import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommentsComponent } from '../comments/comments.component';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentsComponent, RouterModule, RouterLink],
  template: `
    <h2>💀 DOOMSCROLL FEED</h2>

    <div class="new-post">
      <textarea [(ngModel)]="newPost" placeholder="Что происходит?.."></textarea>
      <input type="file" (change)="onFileSelected($event)" /><br>
      <button (click)="createPost()">Опубликовать</button>
    </div>

    <div *ngFor="let post of posts" class="post-card">
      <div class="post-header">
        <img *ngIf="post.author.avatar" [src]="'http://127.0.0.1:8000' + post.author.avatar" width="32" height="32" style="border-radius: 50%; margin-right: 10px;" />
        <a [routerLink]="['/profile', post.author.username]">
          <strong>{{ post.author.username }}</strong>
        </a>
        <span class="timestamp">{{ post.created_at | date:'short' }}</span>
      </div>

      <div class="post-content">
        <p>{{ post.content }}</p>
        <img *ngIf="post.image" [src]="'http://127.0.0.1:8000' + post.image" width="100%" style="margin-top: 10px;" />
      </div>

      <div class="post-actions">
        <span>❤️ {{ post.likes }}</span>
        <button (click)="like(post.id)">Like</button>
      </div>

      <div *ngIf="post.comments?.length">
        <p class="comment-header">💬 Комментарии:</p>
        <div *ngFor="let comment of post.comments" class="comment" style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
          <img *ngIf="comment.author.avatar" [src]="'http://127.0.0.1:8000' + comment.author.avatar" width="30" height="30" style="border-radius: 50%;" />
          <div>
            <a [routerLink]="['/profile', comment.author.username]">
              <strong>{{ comment.author.username }}</strong>
            </a>
            {{ comment.text }}
          </div>
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
  selectedFile: File | null = null;
  commentTexts: { [postId: number]: string } = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.api.getPosts().subscribe(data => this.posts = data);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  createPost() {
    if (!this.newPost.trim()) return;

    const formData = new FormData();
    formData.append('content', this.newPost);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.api.createPostWithImage(formData).subscribe({
      next: () => {
        this.newPost = '';
        this.selectedFile = null;
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

  comment(postId: number) {
    const text = this.commentTexts[postId];
    if (!text?.trim()) return;

    this.api.createComment(postId, text).subscribe(() => {
      this.commentTexts[postId] = '';
      this.loadPosts();
    });
  }
}
