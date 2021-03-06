import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, catchError, tap, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    private http: HttpClient,
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
      case PROVIDERS.GOOGLE:
        user = { youtube: null };
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

  getUserRecord(user: User): Observable<User> {
    return from(this.user.ref.where('uid', '==', user.uid).get())
      .pipe(
        map(response => this.getUserDataFromPayload(response, user)),
        catchError(error => this.errorService.logError(error))
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

  getUserDataFromPayload(response, userRecord): User {
    let user;
    if (!response) {
      return userRecord;
    }
    if (response.empty) {
      return userRecord;
    }
    user = { ...response.docs.pop().data(), id: response.docs.pop().id };
    return user;
  }

  addRefID(user: User, provider): UserSocial {
    let normalisedResponse;
    switch (provider) {
      case PROVIDERS.GITHUB:
        normalisedResponse = {
          ...{
            ...user.github.additionalUserInfo.profile,
            username: user.github.additionalUserInfo.username
          }, userId: user.uid
        };
        break;
      case PROVIDERS.TWITTER:
        normalisedResponse = {
          ...{
            ...user.twitter.additionalUserInfo.profile,
            username: user.twitter.additionalUserInfo.username
          }, userId: user.uid
        };
        break;
      case PROVIDERS.YOUTUBE:
        normalisedResponse = {
          ...{
            ...user.youtube.additionalUserInfo.profile,
            username: user.youtube.additionalUserInfo.username
          }, userId: user.uid
        };
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
        const { id, ...socialDoc } = response;
        this.updateUserSocialRecord(id, { ...socialRecord, ...socialDoc });
      });
  }

  checkNewOrExistingRecord(user: User): Observable<User> {
    return this.getUserRecord(user)
      .pipe(
        map((userRecord) => {
          if (!userRecord) {
            return user;
          }
          return userRecord;
        }));
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

  getUserSocialDocs(userRecord): UserSocial {
    let userSocialDoc;
    userSocialDoc = userRecord.docs.map((doc) => doc.data());
    return userSocialDoc;
  }

  calculateTotalFollowersCount(userSocial: UserSocial): UserSocial {
    let githubCount = 0;
    let twitterCount = 0;
    let youtubeCount = 0;

    if (userSocial.github) {
      githubCount = userSocial.github.followers;
    }
    if (userSocial.twitter) {
      twitterCount = userSocial.twitter.followers;
    }
    if (userSocial.youtube) {
      youtubeCount = userSocial.youtube.followers;
    }
    const totalFollowers = githubCount + twitterCount + youtubeCount;
    return { ...userSocial, totalFollowers };
  }

  updateFollowersCount(userSocialRecord): UserSocial[] {
    let userTribeCount;
    userTribeCount = userSocialRecord.map((userSocialDoc) => this.calculateTotalFollowersCount(userSocialDoc));
    return userTribeCount;
  }

  sortTribeUsers(userTribeCount): UserSocial[] {
    let sortedTribeUsers;
    sortedTribeUsers = userTribeCount.sort((a, b) => {
      if (a.totalFollowers < b.totalFollowers) {
        return 1;
      }
      if (a.totalFollowers > b.totalFollowers) {
        return -1;
      }
      return 0;
    });
    return sortedTribeUsers;
  }

  getUsersWithMaxFollowers(): Observable<UserSocial[]> {
    return this.userSocial.get()
      .pipe(
        map((records) => this.getUserSocialDocs(records)),
        map((userSocialRecords) => this.updateFollowersCount(userSocialRecords)),
        map((userTribeCount) => this.sortTribeUsers(userTribeCount))
      );
  }
}
