import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { SocialStatsService } from 'src/app/services/social-stats.service';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private socialStatsService: SocialStatsService,
    private errorService: ErrorService
  ) { }

  public hasError = false;
  public errorMessage = '';

  ngOnInit() { }

  showErrorMessage() {
    this.hasError = true;
    this.errorMessage = 'Something went wrong. Please try again';
  }

  loginWithGithub() {
    this.authService.signInWithGithub()
      .subscribe((user) => {
        if (!user) {
          this.showErrorMessage();
          return;
        }
        this.saveUser(user, 'github');
      });
  }

  loginWithTwitter() {
    this.authService.signInWithTwitter()
      .subscribe((user) => {
        if (!user) {
          this.showErrorMessage();
          return;
        }
        this.saveUser(user, 'twitter');
      });
  }

  saveUser(user: User, provider: string) {
    this.userService.saveUser(user, provider)
      .subscribe((userData) => {
        this.saveUserSocialRecord();
        this.saveUserSocialStats(userData, provider);
      });
  }

  saveUserSocialRecord() {
    this.userService.getUser()
      .pipe(
        map(value => this.addProviderToUserSocial(value)),
        catchError(error => this.errorService.logError(error))
      )
      .subscribe();
  }
  addProviderToUserSocial(user) {
    const provider = Object.keys(user)[0];
    const userSocial = this.userService.addRefID(user, provider);
    this.userService.saveUserSocialRecord(userSocial, provider);
  }
  saveUserSocialStats(userData, provider: string) {
    const socialStats = { ...userData, ...{ provider, createdAt: new Date().toISOString() } };
    this.socialStatsService.createSocialStats(socialStats)
      .subscribe((response) => {
        if (!response) {
          console.error('Error in storing stats history');
        }
      });
  }
}
