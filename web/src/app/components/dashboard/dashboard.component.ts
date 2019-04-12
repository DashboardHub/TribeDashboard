import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {}

  logout() {
      this.authService.signOutUser()
        .subscribe(() => this.navigateTologin());
  }

  navigateTologin() {
    this.router.navigate(['/login']);
  }

}
