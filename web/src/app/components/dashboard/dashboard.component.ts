import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { UserSocial } from 'src/app/models/userSocial.model';
import { ActivatedRoute } from '@angular/router';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';

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
      this.displayPublicDashboard() :
      this.displayOwnDashboard();
  }

  displayOwnDashboard(): void {
    this.userService.getUser()
      .pipe(
        tap(user => this.user = { ...user }),
        mergeMap((user: User) => this.getUserSocialRecord(user.uid))
      )
      .subscribe((userSocial) => {
        if (!userSocial) {
          console.error('Error in fetching user social'); // TODO: Handle null user scenario in dashboard UI
          return;
        }
        this.userSocial = { ...userSocial };
        this.isResponseLoading = false;
      });
  }

  displayPublicDashboard(): void {
    const provider = this.route.snapshot.paramMap.get('provider');
    const name = this.route.snapshot.paramMap.get('name');
    this.userService.getUserDashboardRecord(provider, name)
      .pipe(
        mergeMap(value => this.getUserSocialRecord(value.uid)),
        catchError(error => this.errorService.logError(error))
      ).subscribe(userSocial => {
        const { id, ...social } = userSocial;
        if (!userSocial) {
          console.error('Error in fetching user social'); // TODO: Handle null social doc scenario in cards.
          return;
        }
        this.userSocial = { ...social, public: true };
        this.isResponseLoading = false;
      },
        error => this.errorService.logError(error)
      );
  }

  getUserSocialRecord(userId: string): Observable<UserSocial> {
    return this.userService.getUserSocialRecord(userId);
  }

}
