import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
@Injectable()
export class AuthService {
  constructor(private firebaseAuth: AngularFireAuth) {
  }
  signInWithGithub() {
    return this.firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GithubAuthProvider()
    ).then((result) => {
      console.log('result', result); // TODO: remove after firestore implementation
    });
  }
}
