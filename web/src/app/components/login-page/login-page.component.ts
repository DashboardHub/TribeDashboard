import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { SocialStatsService } from 'src/app/services/social-stats.service';
import { filter } from 'rxjs/operators';

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
        this.saveUserSocialDetails();
        this.saveUserSocialStats(userData, provider);
      });
  }

  saveUserSocialDetails() {
    this.userService.getUser()
      .pipe(
        filter(user => user && Object.keys(user).length !== 0)
      )
      .subscribe((user) => {
        const provider = Object.keys(user);
        const userSocial = this.userService.addRefID(user, provider[0]);
        this.userService.saveUserSocialDetails(userSocial, provider[0]);
      });
  }

  saveUserSocialStats(userData, provider: string) {
    const socialStats = { ...userData, ...{ provider, createdAt: new Date().toISOString() } };
    this.socialStatsService.createSocialStats(socialStats)
      .subscribe((response) => {
        if (!response) {
          console.error('error in storing stats history');
        }
      });
  }
}
