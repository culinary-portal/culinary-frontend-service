import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthLoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'y2h3428sfjaqwrpfs3tx44gfskqpjmnvr8';
    const authReq = req.clone({ headers: req.headers.append('Auth', token) });

    const started = Date.now();

    const fullUrl = req.url.startsWith('http')
      ? req.url
      : `${req.urlWithParams}`;

    return next.handle(authReq).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            const elapsed = Date.now() - started;
            console.log(`Request to ${fullUrl} took ${elapsed} ms.`);
            console.log('Request details:', authReq);
            console.log('Response details:', event);
          }
        },
        error => {
          const elapsed = Date.now() - started;
          console.error(`Request to ${fullUrl} failed after ${elapsed} ms.`);
          console.error('Request details:', authReq);
          console.error('Error details:', error);
        }
      )
    );
  }
}
