import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
        console.log('inside loginwith github subscirbe', user);
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

  saveUser(user, provider) {
    this.userService.saveUser(user)
      .subscribe((userData) => {
        this.saveUserSocialDetails(userData, provider);
      });
  }

  saveUserSocialDetails(userData, provider) {
    const socialDetails = {};
    socialDetails[provider] = userData;
    this.userService.saveUserSocial(socialDetails)
      .subscribe((socialData) => {
        console.log('userSocialData', socialData); // TODO: store after dashboard count implementation.
      });
  }

}
