import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { UserSocial } from './models/userSocial.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'TribeDashboard';
  public version: string;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
    this.version = environment.version;
  }

  ngOnInit() {
    this.userService.getUser()
      .subscribe((user) => {
        if (user) {
          const userSocial = this.userService.addRefID(user);
          this.saveUserSocialDetails(userSocial, user.credentials.providerId.split('.')[0]);
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
          return;
        }
        this.router.navigate(['/dashboard']);
      });
  }

  updateUserSocialDetails(id: string, socialDetails: UserSocial) {
    this.userService.updateSocialDoc(id, socialDetails)
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }
}
