import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { SocialStatsService } from 'src/app/services/social-stats.service';
import { mergeMap } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { Observable } from 'rxjs';
import { SocialStatsHistory } from 'src/app/models/socialStatsHistory';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private socialStatsService: SocialStatsService,
    private errorService: ErrorService
  ) { }

  public hasError = false;
  public errorMessage = '';

  showErrorMessage(): void {
    this.hasError = true;
    this.errorMessage = 'Something went wrong. Please try again';
  }

  loginWithGithub(): void {
    this.authService.signInWithGithub()
      .subscribe((user) => {
        if (!user) {
          this.showErrorMessage();
          return;
        }
        this.saveUser(user, 'github');
      });
  }

  loginWithTwitter(): void {
    this.authService.signInWithTwitter()
      .subscribe((user) => {
        if (!user) {
          this.showErrorMessage();
          return;
        }
        this.saveUser(user, 'twitter');
      });
  }

  loginWithYoutube(): void {
    this.authService.signInWithGoogle()
      .subscribe((user) => {
        this.saveUser(user, 'youtube');
      });
  }

  saveUser(user: User, provider: string): void {
    this.userService.checkNewOrExistingRecord(user)
      .pipe(
        mergeMap((userRecord) => this.userService.saveUser({ ...user, ...userRecord }, provider)),
        mergeMap(userStats => this.saveUserSocialStats(userStats, provider)),
        mergeMap(() => this.getUser()),
      )
      .subscribe(
        userSocial => this.addProviderToUserSocial(userSocial),
        error => this.errorService.logError(error));
  }


  getUser(): Observable<User> {
    return this.userService.getUser();
  }

  addProviderToUserSocial(user): void {
    const provider = Object.keys(user)[0] === 'uid' ? Object.keys(user)[1] : Object.keys(user)[0];
    const userSocial = this.userService.addRefID(user, provider);
    this.userService.saveUserSocialRecord(userSocial, provider);
  }

  saveUserSocialStats(userStats, provider: string): Observable<SocialStatsHistory> {
    const socialStats = { ...userStats, provider, createdAt: new Date().toISOString() };
    return this.socialStatsService.createSocialStats(socialStats);
  }
}
