import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserSocial } from 'src/app/models/userSocial.model';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { AccountsService } from 'src/app/services/accounts.service';
import { Router } from '@angular/router';
import { PROVIDERS } from '../../../constant';

@Component({
  selector: 'app-social-cards',
  templateUrl: './social-cards.component.html',
  styleUrls: ['./social-cards.component.scss']
})
export class SocialCardsComponent implements OnInit {

  @Input() userSocial: UserSocial;
  @Output() linkAccountRemoved = new EventEmitter();

  constructor(
    private userService: UserService,
    private accountsService: AccountsService,
    private router: Router,
  ) { }

  ngOnInit() { }

  connectAccount(provider: string): void {
    switch (provider) {
      case PROVIDERS.GITHUB:
        this.addGithubAccount();
        break;
      case PROVIDERS.TWITTER:
        this.addTwitterAccount();
        break;
      case PROVIDERS.YOUTUBE:
        this.addYoutubeAccount();
        break;
      default:
        break;
    }
  }

  addGithubAccount(): void {
    this.accountsService.linkWithGithub()
      .subscribe((response) => this.saveSecondaryUser(response, 'github'));
  }

  addTwitterAccount(): void {
    this.accountsService.linkWithTwitter()
      .subscribe((response) => this.saveSecondaryUser(response, 'twitter'));
  }

  addYoutubeAccount(): void {
    this.accountsService.linkWithYoutube()
      .subscribe((response) => this.saveSecondaryUser(response, 'youtube'));
  }


  disconnectAccount(provider: string): void {
    this.accountsService.disconnectAccount(provider)
      .subscribe((isConnected) => {
        if (isConnected) {
          this.linkAccountRemoved.emit('reload');
          return;
        }
        this.router.navigate(['/login']);
      });
  }

  saveSecondaryUser(user: User, provider): void {
    this.userService.saveLinkUser(user, provider)
      .subscribe((response) => {
        this.saveLinkUserSocialRecord(response, provider);
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
        const userSocial = { ...response, ...socialRecord };
        this.userService.addSocialProvider(userSocial)
          .subscribe((result) => {
            console.log('result', result); // TODO: Will remove in future
          });
      });
  }
}
