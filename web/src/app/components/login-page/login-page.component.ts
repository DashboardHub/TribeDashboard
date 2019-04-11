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
    ) {}

  public hasError: boolean = false;
  public errorMessage: string = '';

  ngOnInit() {}

  loginWithGithub() {
    this.authService.signInWithGithub()
      .subscribe((user) => {
        if(!user) {
          console.error('some')
          this.hasError = true;
          this.errorMessage = 'Something went wrong. Please try again';
          return;
        }
        if(user) {
          this.userService.saveUser(user);
        }
      })
  }

  loginWithTwitter(){
    this.authService.signInWithTwitter();
  }

}
