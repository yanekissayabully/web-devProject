import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Профиль</h2>

    <div *ngIf="profile">
      <p><strong>Имя:</strong> {{ profile.user.username }}</p>

      <div *ngIf="profile.avatar">
        <img [src]="'http://127.0.0.1:8000' + profile.avatar" width="100" height="100" style="border-radius: 50%;" />
      </div>

      <div *ngIf="editable">
        <label>Bio:</label>
        <textarea [(ngModel)]="profile.bio"></textarea><br>
        <label>Doom Level:</label>
        <input type="number" [(ngModel)]="profile.doom_level"><br>
        <label>Аватар:</label>
        <input type="file" (change)="onFileSelected($event)" /><br>
        <button (click)="save()">Сохранить</button>
      </div>

      <div *ngIf="!editable">
        <p><strong>Bio:</strong> {{ profile.bio }}</p>
        <p><strong>Doom Level:</strong> {{ profile.doom_level }}</p>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile: any;
  editable = false;
  selectedFile: File | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.api.getProfileByUsername(username).subscribe(data => {
        this.profile = data;
        this.editable = false;
      });
    } else {
      this.api.getMyProfile().subscribe(data => {
        this.profile = data;
        this.editable = true;
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  save() {
    const formData = new FormData();
    formData.append('bio', this.profile.bio || '');
    formData.append('doom_level', this.profile.doom_level || 0);
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access') || ''}`
    });

    this.http.put('http://127.0.0.1:8000/api/profile/update/', formData, { headers }).subscribe(() => {
      alert('Профиль обновлен!');
      this.selectedFile = null;
    });
  }
}
