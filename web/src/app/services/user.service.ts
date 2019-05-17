import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, catchError, tap, filter } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { UserSocial } from '../models/userSocial.model';
import { Router } from '@angular/router';
import { PROVIDERS } from '../../constant';
@Injectable()
export class UserService {
  public user: AngularFirestoreCollection;
  public userSocial: AngularFirestoreCollection;
  public userStats: AngularFirestoreCollection;

  constructor(
    private db: AngularFirestore,
    private errorService: ErrorService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.userSocial = this.db.collection('userSocial');
    this.user = this.db.collection('user');
    this.userStats = db.collection('socialStatsHistory');
  }

  removeUser(id: string): Observable<null> {
    return from(this.userSocial.doc(id).delete())
      .pipe(
        map(() => {
          this.user.doc(id).delete();
          this.userStats.doc(id).delete();
        }),
        catchError((err) => this.errorService.logError(err))
      );
  }

  removeLinkUser(id: string, provider: string): Observable<null> {
    let user;
    switch (provider) {
      case PROVIDERS.GITHUB:
        user = { github: null };
        break;
      case PROVIDERS.TWITTER:
        user = { twitter: null };
        break;
      default:
        break;
    }
    return from(this.userSocial.doc(id).update(user))
      .pipe(
        map(() => this.user.doc(id).update(user)),
        catchError((err) => this.errorService.logError(err))
      );
  }

  saveUser(user: User, provider): Observable<UserSocial> {
    return from(this.user.doc(user.uid).set(user))
      .pipe(
        map(() => this.addRefID(user, provider)),
        catchError((err) => this.errorService.logError(err)),
      );
  }
  saveLinkUser(user: User, provider): Observable<UserSocial> {
    return from(this.user.doc(user.uid).update(user))
      .pipe(
        map(() => this.addRefID(user, provider)),
        catchError((err) => this.errorService.logError(err)),
      );
  }

  getUser(): Observable<User> {
    return this.authService.user.pipe(
      map(response => this.formatResponse(response)),
      filter(user => user !== null),
    );
  }

  getUserSocialRecord(userId: string): Observable<UserSocial> {
    return from(this.userSocial.ref.where('userId', '==', userId).get())
      .pipe(
        map(response => this.getSocialDataFromPayload(response)),
        catchError(error => this.errorService.logError(error)),
      );
  }

  getUserDashboardRecord(provider: string, userName: string): Observable<User> {
    return from(this.user.ref.where(`${provider}.credentials.provider`, '==', `${provider}.com`)
      .where(`${provider}.additionalUserInfo.username`, '==', userName).get())
      .pipe(
        map(response => this.getSocialDataFromPayload(response)),
        catchError(error => this.errorService.logError(error)),
      );
  }

  getSocialDataFromPayload(response): UserSocial | null {
    let social;
    if (!response) {
      return null;
    }
    if (response.empty) {
      return response;
    }
    social = { ...response.docs.pop().data(), id: response.docs.pop().id, };
    return social;
  }

  addRefID(user: User, provider): UserSocial {
    let normalisedResponse;
    switch (provider) {
      case PROVIDERS.GITHUB:
        normalisedResponse = { ...user.github.additionalUserInfo.profile, userId: user.uid };
        break;
      case PROVIDERS.TWITTER:
        normalisedResponse = { ...user.twitter.additionalUserInfo.profile, userId: user.uid };
        break;
      case PROVIDERS.YOUTUBE:
        normalisedResponse = { ...user.youtube.additionalUserInfo.profile, userId: user.uid };
        break;
      default:
        break;
    }
    return normalisedResponse;
  }

  updateSocialDoc(id: string, social: UserSocial): Observable<UserSocial> {
    return from(this.userSocial.doc(id).set(social))
      .pipe(
        catchError(err => this.errorService.logError(err)),
      );
  }

  addSocialProvider(userSocial: UserSocial): Observable<UserSocial> {
    const { id, ...social } = userSocial;
    return from(this.userSocial.doc(id).update(social))
      .pipe(
        catchError(err => this.errorService.logError(err)),
      );
  }

  addSocialDoc(social: UserSocial): Observable<UserSocial> {
    return from(this.userSocial.doc(social.userId).set(social))
      .pipe(
        map(response => this.formatUserSocial(response)),
        catchError(err => this.errorService.logError(err)),
      );
  }

  formatResponse(response): User {
    if (!response) {
      return null;
    }
    return response;
  }

  formatUserSocial(response): UserSocial {
    return response;
  }

  saveUserSocialRecord(userData: UserSocial, provider: string): void {
    const { userId, ...social } = userData;
    const socialRecord = {
      userId
    };
    socialRecord[provider] = social;
    this.getUserSocialRecord(userData.userId)
      .subscribe((response) => {
        if (!response) {
          console.error('Error in verifying existing user');
          return;
        }
        if (response.empty) {
          this.createUserSocialRecord(socialRecord);
          return;
        }
        this.updateUserSocialRecord(response.id, { ...socialRecord, ...response });
      });
  }

  createUserSocialRecord(socialRecord: UserSocial): void {
    this.addSocialDoc(socialRecord)
      .subscribe((response) => {
        if (response) {
          console.error('error in creating social doc');
          return;
        }
        this.router.navigate(['/dashboard']);
      });
  }

  updateUserSocialRecord(id: string, socialRecord: UserSocial): void {
    this.updateSocialDoc(id, socialRecord)
      .subscribe(() => this.router.navigate(['/dashboard'])
      );
  }
}
