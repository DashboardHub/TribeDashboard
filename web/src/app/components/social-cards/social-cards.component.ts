import { Component, OnInit, Input } from '@angular/core';
import { UserSocial } from 'src/app/models/userSocial.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-social-cards',
  templateUrl: './social-cards.component.html',
  styleUrls: ['./social-cards.component.scss']
})
export class SocialCardsComponent implements OnInit {

  @Input() userSocial: UserSocial;

  constructor(
    private userService: UserService,
    private accountsService: AccountsService,
  ) { }

  ngOnInit() { }

  connectAccount(provider: string): void {
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

  addGithubAccount(): void {
    this.accountsService.linkWithGithub()
      .subscribe((response) => {
        this.saveSecondaryUser(response, 'github');
      });
  }

  addTwitterAccount(): void {
    this.accountsService.linkWithTwitter()
      .subscribe((response) => {
        this.saveSecondaryUser(response, 'twitter');
      });
  }

  saveSecondaryUser(user: User, provider): void {
    this.userService.saveLinkUser(user, provider)
      .subscribe((response) => {
        this.saveLinkUserSocialRecord(response, 'twitter');
      });
  }

  saveLinkUserSocialRecord(userData: UserSocial, provider: string): void {
    const { userId, ...social } = userData;
    const socialRecord = {
      userId
    };
    socialRecord[provider] = social;
    this.userService.getUserSocialRecord(userData.userId)
      .subscribe((response) => {
        if (!response) {
          console.error('Error in verifying if the user is an existing one');
          return;
        }
        const userSocial = { ...socialRecord, ...response };
        this.userService.addSocialProvider(userSocial)
          .subscribe((result) => {
            console.log('result', result); // TODO: Will remove in future
          });
      });
  }
}
