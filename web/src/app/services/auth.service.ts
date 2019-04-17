import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private errorService: ErrorService,
    private firestore: AngularFirestore
  ) {
    this.user = this.firebaseAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`user/${user.uid}`).snapshotChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  signInWithGithub(): Observable<User> {
    return from(this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()))
      .pipe(
        map((user) => this.formatUserResponse(user, 'github')),
        catchError((error) => this.errorService.logError(error))
      );
  }

  signInWithTwitter() {
    return from(this.firebaseAuth.auth
      .signInWithPopup(new firebase.auth.TwitterAuthProvider()))
      .pipe(
        map((user) => this.formatUserResponse(user, 'twitter')),
        catchError((error) => this.errorService.logError(error))
      );
  }

  signOutUser() {
    return from(this.firebaseAuth.auth.signOut())
      .pipe(
        catchError(err => this.errorService.logError(err))
      );
  }

  formatUserResponse(user, provider): User {
    let normalisedUser = {};
    switch (provider) {
      case 'github':
        return normalisedUser = this.normaliseGithubUser(user);
      default:
        return null;
    }
  }

  normaliseGithubUser(user): User {
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
