import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable()
export class AuthService {
  constructor(
    private firebaseAuth: AngularFireAuth,
    // private db:AngularFirestore
    private errorService: ErrorService,
  ) {
    // this.user = db.collection('github');

  }

  // signInWithGithub(): Observable<any> {
  //   return from(this.firebaseAuth.auth.signInWithPopup(
  //     new firebase.auth.GithubAuthProvider()
  //   ));
  // }

  signInWithGithub(): Observable<any> {
    return from(this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()))
      .pipe(
        map((user) => this.formatUserResponse(user)),
        catchError((error) => this.errorService.logError(error))
      )
    //  ).then((userData)=>{
    //    const { credential,  additionalUserInfo, user: { displayName, photoURL, uid } } = userData;
    //    console.log('userData', userData);
    //    const user = {
    //       displayName,
    //       photoURL,
    //       uid,
    //       credential: {...credential},
    //       additionalUserInfo: {...additionalUserInfo}
    //     }

    //    console.log('credential', user);
    //   this.user.add({user})
    //   .then((status)=>{
    //     console.log('status',status)
    //   })
    //   .catch((err)=>{
    //     console.error(err)
    //   })
    //  }
  }

  signInWithTwitter() {
    return from(this.firebaseAuth.auth
      .signInWithPopup(new firebase.auth.TwitterAuthProvider()));
  }

  formatUserResponse(user) {
    const {
      credential,
      additionalUserInfo,
      user: { displayName, uid, photoURL },
      metadata: { creationTime: { creationAt }, lastSignInTime: { lastSignInAt } },
    } = user;

    const { profile: {
      created_at: { createdAt },
      updated_at: { updatedAt },
      followers,
      following,
      avatar_url: { avatarURL }
    },
      username,
    } = additionalUserInfo;

    const {
      accessToken,
      providerId: { providerID }
    } = credential;

    const filteredUserInfo = {
      profile: {
        createdAt,
        updatedAt,
        followers,
        following,
        avatarURL
      },
      username,
    }

    const credentials = {
      accessToken,
      providerID
    }

    const normalisedUser = {
      displayName,
      uid,
      photoURL,
      creationAt,
      lastSignInAt,
      additionalUserInfo: filteredUserInfo,
      credentials
    }
    return normalisedUser;
  }



}
