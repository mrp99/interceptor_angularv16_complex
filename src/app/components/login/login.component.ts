import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  public login(): void {
    if (this.username === 'user' && this.password === 'password') {
      const token = 'fake-jwt-token';
      this.authService.setToken(token);
      this.router.navigate(['/dashboard']);
    } else {
      alert('Credenciais inválidas!');
    }
  }
}
