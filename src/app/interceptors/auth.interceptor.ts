import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, delay, delayWhen, Observable, of, retry, retryWhen, switchMap, take, throwError, timer } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const clonedRequest = this.addAuthToken(req, token);

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, req, next)),
      retry(3)
    );
  }

  private addAuthToken(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
    if (token) return req;
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handleError(
    error: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    if (error.status === 401) {
      console.log('Token expirado. Tentando renovação...');

      return this.refreshToken().pipe(
        switchMap((newToken) => this.retryRequestWithNewToken(req, next, newToken)),
        catchError((refreshError) => this.handleTokenRefreshFailure(refreshError))
      );
    } else {
      return throwError(error);
    }
  }

  private retryRequestWithNewToken(req: HttpRequest<any>, next: HttpHandler, newToken: string): Observable<HttpEvent<any>> {
    this.authService.setToken(newToken);
    const clonedRequestWithNewToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${newToken}`
      }
    });
    return next.handle(clonedRequestWithNewToken);
  }

  private handleTokenRefreshFailure(refreshError: any): Observable<never> {
    console.error('Falha ao renovar o token. Redirecionando para login...');
    this.authService.logOut();
    this.router.navigate(['/login']);
    return throwError(refreshError);
  }

  private refreshToken(): Observable<string> {
    return this.authService.refreshToken().pipe(
      switchMap((response: any) => of(response.newToken))
    );
  }



}
