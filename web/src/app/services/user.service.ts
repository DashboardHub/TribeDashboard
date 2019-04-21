import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from 'angularfire2/firestore';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { UserSocial } from '../models/userSocial.model';

@Injectable()
export class UserService {
  public user: AngularFirestoreCollection;
  public userSocial: AngularFirestoreCollection;

  constructor(
    private db: AngularFirestore,
    private errorService: ErrorService,
    private authService: AuthService,
  ) {
    this.userSocial = this.db.collection('userSocial');
    this.user = this.db.collection('user');
  }

  saveUser(user: User): Observable<User> {
    return from(this.user.doc(user.uid).set({ user }))
      .pipe(
        map(() => this.addRefID(user)),
        catchError((err) => this.errorService.logError(err)),
      );
  }

  getUser(): Observable<User> {
    return this.authService.user.pipe(
      map(response => this.formatResponse(response))
    );
  }

  getUserSocialDetails(providerId: string, uid: string): Observable<UserSocial> {
    return from(this.userSocial.ref.where(`${providerId}.userId`, '==', uid).get())
      .pipe(
        map(response => this.getSocialDataFromPayload(response)),
        catchError(error => this.errorService.logError(error))
      );
  }

  getSocialDataFromPayload(response): UserSocial | null {
    let social;
    if (!response) {
      return null;
    }
    social = response.docs.pop().data();
    return social;
  }

  addRefID(user): UserSocial {
    const normalisedResponse = { ...user.additionalUserInfo.profile, userId: user.uid };
    return normalisedResponse;
  }

  checkForSocialDoc(provider: string, userId: string): Observable<any> {
    return from(this.userSocial.ref.where(`${provider}.userId`, '==', userId).get())
      .pipe(
        map((response: QuerySnapshot<UserSocial>) => {
          if (response.empty) {
            return { empty: response.empty };
          }
          return { empty: response.empty, id: response.docs.pop().id };
        })
      );
  }

  updateSocialDoc(id: string, social: UserSocial): Observable<UserSocial> {
    return from(this.userSocial.doc(id).set(social))
      .pipe(
        map(response => this.formatUserSocial(response)),
        catchError(err => this.errorService.logError(err))
      );
  }

  addSocialDoc(social: UserSocial): Observable<UserSocial> {
    return from(this.userSocial.add(social))
      .pipe(
        map(response => this.formatUserSocial(response)),
        catchError(err => this.errorService.logError(err))
      );
  }

  formatResponse(response): User {
    if (!response) {
      return null;
    }
    return response.user;
  }

  formatUserSocial(response) {
    return response;
  }
}
