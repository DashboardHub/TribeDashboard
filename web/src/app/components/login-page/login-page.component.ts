import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserSocial } from '../../models/userSocial.model';
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
    this.userService.saveUser(user)
      .subscribe((userData) => {
        this.saveUserSocialDetails(userData, provider);
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

  saveUserSocialDetails(userData, provider: string) {
    const socialDetails = {};
    socialDetails[provider] = userData;
    this.userService.checkForSocialDoc(provider, userData.userId)
      .subscribe((response) => {
        if (!response) {
          console.error('error in checking of existing social doc');
          return;
        }
        if (response.empty) {
          this.createUserSocialDetails(socialDetails);
          return;
        }
        this.updateUserSocialDetails(response.id, socialDetails);
      });
  }

  createUserSocialDetails(socialDetails: UserSocial) {
    this.userService.addSocialDoc(socialDetails)
      .subscribe((response) => {
        if (!response) {
          console.error('error in creating social doc');
        }
      });
  }

  updateUserSocialDetails(id: string, socialDetails: UserSocial) {
    this.userService.updateSocialDoc(id, socialDetails)
      .subscribe((response) => {
        if (!response) {
          console.error('error in updating user social doc');
        }
      });
  }
}
