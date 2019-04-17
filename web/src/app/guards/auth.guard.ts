import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private  auth: AuthService,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean> {

    return this.auth.user.pipe(
      take(1),
      map(authUser => {
        console.log('user in map', authUser);
        return !!authUser;
      }),
      tap(loggedIn => {
        console.log('loggedIn', loggedIn);
        if (!loggedIn) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
