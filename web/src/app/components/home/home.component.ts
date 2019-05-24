import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserSocial } from 'src/app/models/userSocial.model';
import { AngularFireFunctions } from '@angular/fire/functions';

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
    this.userService.getUsersWithMaxFollowers()
      .subscribe((tribeUsers: UserSocial[]) => {
        if (tribeUsers.length > 0) {
          this.isResponseLoading = false;
          return this.users = tribeUsers;
        }
        return;
      });
  }

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  getProvider(user): string {
    return Object.keys(user)[0] === 'uid' ? Object.keys(user)[1] : Object.keys(user)[0];
  }
}
