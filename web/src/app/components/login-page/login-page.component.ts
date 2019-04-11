import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  loginWithGithub() {
    this.authService.signInWithGithub()
    .subscribe((result) => {
      console.log('result', result); // TODO: remove after firestore implementation
    });
  }
  loginWithTwitter(){
    this.authService.signInWithTwitter();
  }

}
