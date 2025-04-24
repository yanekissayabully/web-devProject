import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { LayoutComponent } from './layout/layout.component'; // импортируем layout!
import { ChatComponent } from './chat/chat.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: PostsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/:username', component: ProfileComponent },
      { path: 'chat/:username', component: ChatComponent }


    ]
  },
  { path: 'login', component: LoginComponent }
];
