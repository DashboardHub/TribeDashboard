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
          this.saveUserSocialDetails(userSocial, user.credentials.provider.split('.')[0]);
        }
      });
  }

  saveUserSocialDetails(userData: UserSocial, provider: string) {
    const { userId, ...social } = userData;
    const socialDetails = {
      userId
    };
    socialDetails[provider] = social;
    this.userService.getUserSocialDetails(userData.userId)
      .subscribe((response) => {
        if (!response) {
          console.error('Error in verifying if the user is an existing one');
          return;
        }
        if (response.empty) {
          this.createUserSocialDetails(socialDetails);
          return;
        }
        this.updateUserSocialDetails(response.id, { ...socialDetails, ...response });
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
