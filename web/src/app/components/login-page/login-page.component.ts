import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { SocialStatsService } from 'src/app/services/social-stats.service';

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
  private isPrimary: boolean;
  public errorMessage = '';

  ngOnInit() {
    this.isPrimary = true;
  }

  showErrorMessage() {
    this.hasError = true;
    this.errorMessage = 'Something went wrong. Please try again';
  }

  loginWithGithub() {
    this.authService.signInWithGithub(this.isPrimary)
      .subscribe((user) => {
        if (!user) {
          this.showErrorMessage();
          return;
        }
        this.saveUser(user, 'github');
      });
  }

  loginWithTwitter() {
    this.authService.signInWithTwitter(this.isPrimary)
      .subscribe((user) => {
        if (!user) {
          this.showErrorMessage();
          return;
        }
        this.saveUser(user, 'twitter');
      });
  }

  saveUser(user: User, provider: string) {
    this.userService.saveUser(user)
      .subscribe((userData) => {
        this.saveUserSocialStats(userData, provider);
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
