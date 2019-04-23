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
          return this.firestore.doc<User>(`user/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  signInWithGithub(isPrimary: boolean): Observable<User> {
    return from(this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()))
      .pipe(
        map((user) => this.formatUserResponse({...user, isPrimary}, 'github')),
        catchError((error) => this.errorService.logError(error))
      );
  }

  signInWithTwitter(isPrimary: boolean): Observable<User> {
    return from(this.firebaseAuth.auth
      .signInWithPopup(new firebase.auth.TwitterAuthProvider()))
      .pipe(
        map((user) => this.formatUserResponse({...user, isPrimary}, 'twitter')),
        catchError((error) => this.errorService.logError(error))
      );
  }

  signOutUser(): Observable<null> {
    return from(this.firebaseAuth.auth.signOut())
      .pipe(
        catchError(err => this.errorService.logError(err))
      );
  }

  formatUserResponse(response, provider): User | null {
    let normalisedUser = {};
    if (typeof (response) === 'undefined') {
      return null;
    }
    switch (provider) {
      case 'github':
        return normalisedUser = this.normaliseGithubUser(response);
      case 'twitter':
        return normalisedUser = this.normaliseTwitterUser(response);
      default:
        return null;
    }
  }

  normaliseGithubUser(response): User {
    const user = response.user;

    const credentials = {
      accessToken: response.credential.accessToken,
      provider: response.credential.providerId,
      refreshToken: response.user.refreshToken
    };

    const profile = {
      createdAt: response.additionalUserInfo.profile.created_at,
      updatedAt: response.additionalUserInfo.profile.updated_at,
      followers: response.additionalUserInfo.profile.followers,
      following: response.additionalUserInfo.profile.following,
      avatarUrl: response.additionalUserInfo.profile.avatar_url
    };

    const additionalUserInfo = {
      username: response.additionalUserInfo.username,
      profile
    };

    const normalisedUser = {
      displayName: user.displayName,
      uid: user.uid,
      photoUrl: user.photoURL,
      creationAt: user.metadata.creationTime,
      lastSignInAt: user.metadata.lastSignInTime,
      additionalUserInfo,
      credentials,
      isPrimary: response.isPrimary
    };
    return normalisedUser;
  }

  normaliseTwitterUser(response): User {
    const user = response.user;
    const credentials = {
      accessToken: response.credential.accessToken,
      provider: response.credential.providerId,
      secret: response.credential.secret,
    };

    const profile = {
      createdAt: response.additionalUserInfo.profile.created_at,
      followers: response.additionalUserInfo.profile.followers_count,
      following: response.additionalUserInfo.profile.friends_count,
      avatarUrl: response.additionalUserInfo.profile.profile_image_url
    };

    const additionalUserInfo = {
      username: response.additionalUserInfo.username,
      profile
    };

    const normalisedUser = {
      displayName: user.displayName,
      uid: user.uid,
      photoUrl: user.photoURL,
      creationAt: user.metadata.creationTime,
      lastSignInAt: user.metadata.lastSignInTime,
      additionalUserInfo,
      credentials,
      isPrimary: response.isPrimary
    };
    return normalisedUser;
  }
}
