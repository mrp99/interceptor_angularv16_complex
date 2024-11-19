import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey: string = 'auth_token';

  constructor(private router: Router) { }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public refreshToken(): Observable<{ newToken: string }> {
    console.log('Tentando renovar o token...');
    const newToken = 'new-fresh-jwt-token';
    return of({ newToken });
  }

  public logOut(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

}
