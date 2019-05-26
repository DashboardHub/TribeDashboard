import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NonTribePageGuardService implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map(authUser => (!!authUser === false)),
      tap(loggedOut => {
        if (loggedOut === false) {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
}
