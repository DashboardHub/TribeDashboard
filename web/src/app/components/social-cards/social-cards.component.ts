import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UserSocial } from 'src/app/models/userSocial.model';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { AccountsService } from 'src/app/services/accounts.service';
import { PROVIDERS } from '../../../constant';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-social-cards',
  templateUrl: './social-cards.component.html',
  styleUrls: ['./social-cards.component.scss']
})
export class SocialCardsComponent {

  @Input() userSocial: UserSocial;
  @Output() linkAccountRemoved = new EventEmitter();

  constructor(
    private userService: UserService,
    private accountsService: AccountsService,
    private matDialog: MatDialog,
    private router: Router,
    private zone: NgZone,
  ) { }

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

  showErrorPopup(error) {
    let dialogRef;
    dialogRef = this.matDialog.open(AlertComponent, {
      data: { message: error }
    });
    dialogRef.afterClosed()
      .subscribe();
  }

  addYoutubeAccount(): void {
    this.accountsService.linkWithYoutube()
      .subscribe((response) => {
        return this.saveSecondaryUser(response, 'youtube');
      },
        (error) => {
          this.zone.run(() => this.showErrorPopup(error.message));
        });
  }

  showDisconnectPopup(provider: string): void {
    const userType = this.accountsService.checkPrimaryOrLinkAccount(provider);
    let dialogRef;
    if (userType) {
      dialogRef = this.matDialog.open(AlertComponent, {
        data: { message: 'Do you want to remove it ?' }
      });
    } else {
      dialogRef = this.matDialog.open(AlertComponent, {
        data: { message: 'This is your primary account. Do you want to remove it ?' }
      });
    }
    dialogRef.afterClosed()
      .subscribe((action: string) => {
        if (action === 'continue') {
          this.disconnectAccount(provider);
        }
      });
  }

  disconnectAccount(provider: string) {
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
            this.linkAccountRemoved.emit('reload');
            console.log('result', result); // TODO: Will remove in future
          });
      });
  }
}
