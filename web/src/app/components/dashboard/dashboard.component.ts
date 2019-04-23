import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { UserSocial } from 'src/app/models/userSocial.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public user: User;
  public userSocial: UserSocial;
  public isResponseLoading: boolean;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.isResponseLoading = true;
    this.userService.getUser()
      .subscribe((user) => {
        if (!user) {
          console.error('error in fetching user'); // TODO: Handle null user scenario in dashboard UI
          return;
        }
        this.user = { ...user };
        this.getUserSocialDetails(this.user.uid);
      });
  }

  getUserSocialDetails(uid: string) {
    this.userService.getUserSocialDetails(uid)
      .subscribe((userSocial) => {
        if (!userSocial) {
          console.error('error in fetching user social'); // TODO: Handle null social doc scenario in cards.
          return;
        }
        this.userSocial = { ...userSocial.social };
        this.isResponseLoading = false;
      });
  }
}
