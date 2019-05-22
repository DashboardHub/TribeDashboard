import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() isLogin: boolean;
  @Input() dashboardName: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  logout(): void {
    this.authService.signOutUser()
      .subscribe(() => this.navigateTologin());
  }

  navigateTologin(): void {
    this.router.navigate(['/login']);
  }
}
