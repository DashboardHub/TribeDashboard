import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private appState: AppStateService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.appState.authState === true) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
