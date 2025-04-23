import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { authInterceptor } from './app/auth.interceptor'; // 💡 путь может быть другой — смотри, где лежит файл

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    ...appConfig.providers, // если у тебя есть appConfig.providers
  ]
}).catch((err) => console.error(err));
