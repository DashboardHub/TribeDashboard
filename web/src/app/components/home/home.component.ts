import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserSocial } from 'src/app/models/userSocial.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public users;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userService.getUsersWithMaxFollowers()
      .subscribe((tribeUsers: UserSocial[]) => this.users = tribeUsers);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.userService.getUsersWithMaxFollowers();
  }

  getProvider(user): string {
    return Object.keys(user)[0] === 'id' ? Object.keys(user)[1] : Object.keys(user)[0]; // Will remove the dummy field
  }
}
