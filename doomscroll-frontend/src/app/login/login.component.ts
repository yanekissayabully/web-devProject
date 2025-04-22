import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2 *ngIf="mode === 'login'">Вход</h2>
    <h2 *ngIf="mode === 'register'">Регистрация</h2>

    <input [(ngModel)]="username" placeholder="Имя пользователя" />
    <input [(ngModel)]="password" type="password" placeholder="Пароль" />

    <button *ngIf="mode === 'login'" (click)="login()">Войти</button>
    <button *ngIf="mode === 'register'" (click)="register()">Зарегистрироваться</button>

    <p>
      <a href="#" (click)="toggleMode($event)">
        {{ mode === 'login' ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти' }}
      </a>
    </p>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  mode: 'login' | 'register' = 'login';

  constructor(private api: ApiService, private router: Router) {}

  toggleMode(event: Event) {
    event.preventDefault();
    this.mode = this.mode === 'login' ? 'register' : 'login';
  }

  login() {
    this.api.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: () => alert('Ошибка входа')
    });
  }

  register() {
    this.api.register(this.username, this.password).subscribe({
      next: () => {
        alert('Успешно зарегистрирован!');
        this.mode = 'login';
      },
      error: () => alert('Ошибка регистрации')
    });
  }
}
