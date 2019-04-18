import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserSocial } from '../../models/userSocial.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
      });
  }

  saveUserSocialDetails(userData: object, provider: string) {
    const socialDetails = {};
    socialDetails[provider] = userData;
    this.userService.saveUserSocial(socialDetails)
      .subscribe();
  }
}
