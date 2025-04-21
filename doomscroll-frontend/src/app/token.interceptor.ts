import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const access = localStorage.getItem('access');
  if (access) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${access}` }
    });
  }
  return next(req);
};
