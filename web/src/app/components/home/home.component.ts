import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserSocial } from 'src/app/models/userSocial.model';
import { filter } from 'rxjs/operators';

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
      .pipe((
        filter(users => users.length > 0)
      ))
      .subscribe((tribeUsers: UserSocial[]) => {
        this.isResponseLoading = false;
        return this.users = tribeUsers;
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
