import { Component, OnInit, Input } from '@angular/core';
import { UserSocial } from 'src/app/models/userSocial.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-social-cards',
  templateUrl: './social-cards.component.html',
  styleUrls: ['./social-cards.component.scss']
})
export class SocialCardsComponent implements OnInit {

  @Input() userSocial: UserSocial;
  private isPrimary: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.isPrimary = false;
  }

  connectAccount(provider: string) {
    switch (provider) {
      case 'github':
        this.addGithubAccount();
        break;
      case 'twitter':
        this.addTwitterAccount();
        break;
      default:
        break;
    }
  }

  addGithubAccount() {
    this.authService.signInWithGithub(this.isPrimary)
      .subscribe((response) => {
        this.saveSecondaryUser(response);
      });
  }

  addTwitterAccount() {
    this.authService.signInWithTwitter(this.isPrimary)
      .subscribe((response) => {
        this.saveSecondaryUser(response);
      });
  }

  saveSecondaryUser(user: User) {
    this.userService.saveUser(user)
      .subscribe((response) => {
        // TODO: store secondary user social and stats after successful storage of user details.
        console.log('response after saving in firebase', response);
      });
  }

}
