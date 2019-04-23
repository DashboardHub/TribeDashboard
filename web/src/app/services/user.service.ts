import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
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

  getUserSocialDetails(uid: string): Observable<DocumentData> {
    return from(this.userSocial.ref.where('uid', '==', uid).get())
      .pipe(
        map(response => this.getSocialDataFromPayload(response)),
        catchError(error => this.errorService.logError(error))
      );
  }

  getSocialDataFromPayload(response): DocumentData | null {
    let social;
    if (!response) {
      return null;
    }
    if (response.empty) {
      return response;
    }
    social = {
      social: response.docs.pop().data(),
      id: response.docs.pop().id,
    };

    return social;
  }

  addRefID(user: User): UserSocial {
    const normalisedResponse = { ...user.additionalUserInfo.profile, uid: user.uid };
    return normalisedResponse;
  }



  updateSocialDoc(id: string, social: UserSocial): Observable<UserSocial> {
    return from(this.userSocial.doc(id).set(social))
      .pipe(
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
