import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AngularFirestore,
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap, tap, mergeAll } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { User } from '../models/user.model';
import { PROVIDERS } from '../../constant';
import { Youtube } from '../models/youtube.model';

@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private errorService: ErrorService,
    private firestore: AngularFirestore,
    private http: HttpClient,
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

  signInWithGithub(): Observable<User> {
    return from(this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()))
      .pipe(
        map((user) => this.formatUserResponse(user, 'github')),
        catchError((error) => this.errorService.logError(error)),
      );
  }

  signInWithTwitter(): Observable<User> {
    return from(this.firebaseAuth.auth
      .signInWithPopup(new firebase.auth.TwitterAuthProvider()))
      .pipe(
        map((user) => this.formatUserResponse(user, 'twitter')),
        catchError((error) => this.errorService.logError(error)),
      );
  }
  getYoutubeUser(user): Observable<Youtube> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: `Bearer ${user.credential.accessToken}`
      })
    };
    return (from((this.http.get(PROVIDERS.YOUTUBE_CHANNELS_API,
      httpOptions))) as Observable<Youtube>);
  }

  signInWithGoogle(): Observable<User> {
    let userRecord;
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope(PROVIDERS.YOUTUBE_READ_ONLY_SCOPE);
    return from(this.firebaseAuth.auth
      .signInWithPopup(provider))
      .pipe(
        tap((sigInRecord) => userRecord = sigInRecord),
        map((user) => this.getYoutubeUser(user)),
        mergeAll(),
        map((response) => {
          return this.formatUserResponse({ ...response, ...userRecord }, 'youtube');
        })

      );
  }

  signOutUser(): Observable<null> {
    return from(this.firebaseAuth.auth.signOut())
      .pipe(
        catchError(error => this.errorService.logError(error)),
      );
  }

  formatUserResponse(response, provider): User | null {
    let normalisedUser = {};
    if (typeof (response) === 'undefined') {
      return null;
    }
    switch (provider) {
      case PROVIDERS.GITHUB:
        return normalisedUser = this.normaliseGithubUser(response);
      case PROVIDERS.TWITTER:
        return normalisedUser = this.normaliseTwitterUser(response);
      case PROVIDERS.YOUTUBE:
        return normalisedUser = this.normaliseYoutubeUser(response);
      default:
        return null;
    }
  }

  normaliseYoutubeUser(response): User {
    const user = response.user;
    const credentials = {
      accessToken: response.credential.accessToken,
      provider: response.credential.providerId,
      refreshToken: response.user.refreshToken
    };
    const profile = {
      createdAt: response.additionalUserInfo.profile.created_at ? response.additionalUserInfo.profile.created_at : '',
      updatedAt: response.additionalUserInfo.profile.updated_at ? response.additionalUserInfo.profile.updated_at : '',
      followers: response.additionalUserInfo.profile.followers ? response.additionalUserInfo.profile.followers :
        response.pageInfo.totalResults,
      following: response.additionalUserInfo.profile.following ? response.additionalUserInfo.profile.following : 0,
      avatarUrl: response.additionalUserInfo.profile.avatar_url ? response.additionalUserInfo.profile.avatar_url :
        response.additionalUserInfo.profile.picture
    };

    const additionalUserInfo = {
      username: response.additionalUserInfo.profile.name,
      profile
    };


    const normalisedUser = {
      youtube: {
        displayName: user.displayName,
        photoUrl: user.photoURL,
        creationAt: user.metadata.creationTime,
        lastSignInAt: user.metadata.lastSignInTime,
        additionalUserInfo,
        credentials,
      },
      uid: user.uid,
    };

    return normalisedUser;
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
      github: {
        displayName: user.displayName,
        photoUrl: user.photoURL,
        creationAt: user.metadata.creationTime,
        lastSignInAt: user.metadata.lastSignInTime,
        additionalUserInfo,
        credentials,
      },
      uid: user.uid,
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
      twitter: {
        displayName: user.displayName,
        photoUrl: user.photoURL,
        creationAt: user.metadata.creationTime,
        lastSignInAt: user.metadata.lastSignInTime,
        additionalUserInfo,
        credentials,
      },
      uid: user.uid,
    };
    return normalisedUser;
  }
}
