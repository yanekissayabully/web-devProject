import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <header class="header">
      <div class="nav">
        <a routerLink="/posts">💀 Лента</a>
        <a routerLink="/profile">👤 Профиль</a>
        <button (click)="toggleTheme()">
          {{ isDark ? '☀️ Светлая' : '🌙 Тёмная' }}
        </button>
      </div>
    </header>

    <main class="content">
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      © 2025 DOOMSCROLL. Конец близок.
    </footer>
  `,
  styles: [`
    .header {
      background: #111;
      color: #eee;
      padding: 1rem;
      display: flex;
      justify-content: center;
    }
    .nav {
      display: flex;
      gap: 1rem;
    }
    a {
      color: #0ff;
      text-decoration: none;
      font-weight: bold;
    }
    .content {
      padding: 2rem;
    }
    .footer {
      text-align: center;
      padding: 1rem;
      font-size: 0.8rem;
      color: #777;
    }
    body.dark-theme {
      background-color: #121212;
      color: #eee;
    }
  `]
})
export class LayoutComponent {
  isDark = false;

  constructor() {
    const saved = localStorage.getItem('doom-theme');
    this.isDark = saved === 'dark';
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
