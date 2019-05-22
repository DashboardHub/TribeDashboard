import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserSocial } from 'src/app/models/userSocial.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public users: UserSocial[];
  public isResponseLoading: boolean;
  public isLogin: boolean;
  ngOnInit() {
    this.isResponseLoading = true;
    this.isLogin = false;
  }

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userService.getUsersWithMaxFollowers()
      .subscribe((tribeUsers: UserSocial[]) => {
        this.isResponseLoading = false;
        return this.users = tribeUsers;
      });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
    this.userService.getUsersWithMaxFollowers();
  }

  getProvider(user): string {
    return Object.keys(user)[0] === 'id' ? Object.keys(user)[1] : Object.keys(user)[0];
  }
}
