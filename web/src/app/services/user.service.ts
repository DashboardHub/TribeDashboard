import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { ErrorService } from './error.service';

@Injectable()
export class UserService {
  public user: AngularFirestoreCollection;
  public userSocial: AngularFirestoreCollection;
  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private errorService: ErrorService,
    ) {
    this.userSocial = db.collection('userSocial');
    this.user = db.collection('user');
  }

  saveUser(user) {
    return from(this.user.add({ user }))
        .pipe(
          map((response) => this.addRefID(response, user)),
          catchError((err) => this.errorService.logError(err)),
          );
  }

  addRefID(response, user) {
    const normalisedResponse = {...user.additionalUserInfo.profile, reference: response.id};
    return normalisedResponse;
  }

  saveUserSocial(social) {
    return from(this.userSocial.add(social))
      .pipe(
        map(response => this.formatUserSocial(response)),
        catchError(err => this.errorService.logError(err))
      );
  }

  formatUserSocial(response) {
    return response;
  }
}
