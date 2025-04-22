import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access');

    // НЕ вставляем токен в login и register
    if (/\/api\/(login|register)(\/|$)/.test(request.url)) {
      return next.handle(request);
    }

    if (accessToken) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(cloned);
    }

    return next.handle(request);
  }
}
