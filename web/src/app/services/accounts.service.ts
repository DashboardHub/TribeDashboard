import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './auth.service';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ErrorService } from './error.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private authService: AuthService,
    private errorService: ErrorService,
    private userService: UserService
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

  disconnectAccount(provider: string): Observable<boolean> {
    const providerData = this.firebaseAuth.auth.currentUser.providerData;
    const userId = this.firebaseAuth.auth.currentUser.uid;
    if (providerData[0].providerId === `${provider}.com`) {
      return this.userService.removeUser(userId)
        .pipe(
          map(() => {
            this.firebaseAuth.auth.currentUser.delete();
            return false;   // to find whether it is primary or linked account.
          }),
          catchError((err) => this.errorService.logError(err))
        );
    } else {
      return this.userService.removeLinkUser(userId, provider)
        .pipe(
          map(() => {
            this.firebaseAuth.auth.currentUser.unlink(`${provider}.com`);
            return true;
          }),
          catchError((err) => this.errorService.logError(err)),
        );
    }
  }
}
