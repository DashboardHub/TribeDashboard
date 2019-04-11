import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable, from } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(private firebaseAuth: AngularFireAuth) {
  }

  signInWithGithub(): Observable<any> {
    return from(this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()
    ));
  }
  signInWithTwitter() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    ).then((result)=>{
      console.log('user logged in with twitter', result);
    })
  }
}
