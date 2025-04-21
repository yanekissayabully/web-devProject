import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Профиль</h2>

    <div *ngIf="profile">
      <p><strong>Имя:</strong> {{ profile.user.username }}</p>

      <div *ngIf="editable">
        <label>Bio:</label>
        <textarea [(ngModel)]="profile.bio"></textarea><br>
        <label>Doom Level:</label>
        <input type="number" [(ngModel)]="profile.doom_level"><br>
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

  constructor(private api: ApiService, private route: ActivatedRoute) {}

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

  save() {
    this.api.updateMyProfile(this.profile).subscribe();
  }
}
