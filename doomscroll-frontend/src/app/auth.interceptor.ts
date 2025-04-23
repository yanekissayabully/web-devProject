import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem('access');

  if (/\/api\/(login|register)(\/|$)/.test(req.url)) {
    console.warn('⚠️ NO TOKEN ADDED FOR:', req.url);
    return next(req); // НЕ добавляем токен
  }

  if (accessToken) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    return next(cloned);
  }

  return next(req);
};
