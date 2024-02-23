import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private excludedUrls: string[] = [
    '/users/sign-in',
    '/users/sign-up',
    'https://geekfinderbucket.s3.amazonaws.com/',
  ];
  constructor() {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.isExcludedUrls(req.url)) {
      return next.handle(req);
    }
    const token = localStorage.getItem('token');
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next.handle(authReq);
  }

  isExcludedUrls(url: string) {
    return this.excludedUrls.some(
      (excludedUrl) => url.endsWith(excludedUrl) || url.startsWith(excludedUrl)
    );
  }
}
