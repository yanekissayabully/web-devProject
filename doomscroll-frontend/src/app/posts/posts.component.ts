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
    <h2>DOOMSCROLL FEED</h2>

    <textarea [(ngModel)]="newPost" placeholder="Что происходит?.."></textarea>
    <br>
    <button (click)="createPost()">Опубликовать</button>

    <hr>

    <div *ngFor="let post of posts" class="fade-in">
      <p><strong>{{ post.author.username }}</strong>: {{ post.content }}</p>
      <p>❤️ {{ post.likes }}</p>
      <button (click)="like(post.id)">Like</button>
      <app-comments [postId]="post.id"></app-comments>
      <hr>
    </div>
  `
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  newPost: string = '';

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
}
