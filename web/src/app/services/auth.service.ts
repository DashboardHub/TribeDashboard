import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private firebaseAuth: AngularFireAuth,
    private errorService: ErrorService,
  ) {


  }

  signInWithGithub(): Observable<User> {
    return from(this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()))
      .pipe(
        map((user) => this.formatUserResponse(user)),
        catchError((error) => this.errorService.logError(error))
      );
  }

  signInWithTwitter() {
    return from(this.firebaseAuth.auth
      .signInWithPopup(new firebase.auth.TwitterAuthProvider()));
  }

  signOutUser() {
    return from(this.firebaseAuth.auth.signOut())
      .pipe(
        catchError(err => this.errorService.logError(err))
      );
  }

  formatUserResponse(user): User {
    const {
      credential,
      additionalUserInfo,
      user: { displayName, uid, photoURL: photoUrl,
        metadata: { creationTime: creationAt, lastSignInTime: lastSignInAt }, refreshToken },
    } = user;

    const { profile: {
      created_at: createdAt,
      updated_at: updatedAt,
      followers,
      following,
      avatar_url: avatarUrl
    },
      username,
    } = additionalUserInfo;

    const {
      accessToken,
      providerId,
    } = credential;

    const filteredUserInfo = {
      profile: {
        createdAt,
        updatedAt,
        followers,
        following,
        avatarUrl
      },
      username,
    };

    const credentials = {
      accessToken,
      providerId,
      refreshToken
    };

    const normalisedUser = {
      displayName,
      uid,
      photoUrl,
      creationAt,
      lastSignInAt,
      additionalUserInfo: filteredUserInfo,
      credentials
    };
    return normalisedUser;
  }
}
