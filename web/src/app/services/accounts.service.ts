import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './auth.service';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private authService: AuthService,
    private errorService: ErrorService,
  ) { }

  linkWithTwitter(): Observable<User> {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.linkAccount(provider, 'twitter');
  }

  linkWithGithub(): Observable<User> {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.linkAccount(provider, 'github');
  }

  linkAccount(provider, providerLabel): Observable<User> {
    return from(this.firebaseAuth.auth.currentUser.linkWithPopup(provider))
      .pipe(
        map((user) => this.authService.formatUserResponse(user, providerLabel)),
        catchError((error) => this.errorService.logError(error)),
      );
  }
}
