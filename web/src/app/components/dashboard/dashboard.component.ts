import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { UserSocial } from 'src/app/models/userSocial.model';
import { ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';

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
    private route: ActivatedRoute,
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.isResponseLoading = true;
    this.route.snapshot.paramMap.keys.length ?
      this.renderUserDashboardDetails() :
      this.renderUserDetails();
  }

  renderUserDetails() {
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

  renderUserDashboardDetails() {
    const provider = this.route.snapshot.paramMap.get('provider');
    const displayName = this.route.snapshot.paramMap.get('displayName');
    this.userService.getUserDashboardDetails(provider, displayName)
      .subscribe((value) => {
        this.getUserSocialDetails(value.uid);
      },
        error => {
          this.errorService.logError(error);
        }
      );
  }

  getUserSocialDetails(userId: string) {
    this.userService.getUserSocialDetails(userId)
      .subscribe((userSocial) => {
        const { id, ...social } = userSocial;
        if (!userSocial) {
          console.error('error in fetching user social'); // TODO: Handle null social doc scenario in cards.
          return;
        }
        this.userSocial = { ...social };
        this.isResponseLoading = false;
      },
        error => {
          this.errorService.logError(error);
        }
      );
  }

}
