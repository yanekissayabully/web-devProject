import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <button routerLink="/profile">👤 Профиль</button>
    <button (click)="toggleTheme()">
      {{ isDark ? '☀️ Светлая' : '🌙 Тёмная' }} тема
    </button>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  isDark = false;

  constructor() {
    const savedTheme = localStorage.getItem('doom-theme');
    this.isDark = savedTheme === 'dark';
    this.updateTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('doom-theme', this.isDark ? 'dark' : 'light');
    this.updateTheme();
  }

  updateTheme() {
    document.body.classList.toggle('dark-theme', this.isDark);
  }
}
