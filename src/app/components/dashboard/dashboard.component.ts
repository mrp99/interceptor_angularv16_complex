import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {


  constructor(private authService: AuthService, private router: Router) { }

  public logout(): void {
    this.authService.logOut();  // Remove o token e redireciona para o login
    this.router.navigate(['/login']);  // Redireciona para a página de login
  }

}
