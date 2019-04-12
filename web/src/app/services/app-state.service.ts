import { Injectable } from '@angular/core';

@Injectable()
export class AppStateService {
// tslint:disable-next-line: variable-name
  private _authState: boolean;

  constructor() {
    if (localStorage.getItem('authState') != null) {
      this._authState =  (localStorage.getItem('authState') as any) as boolean;
    }
  }

  get authState(): boolean {
    return this._authState || false;
  }

  set authState(authState: boolean) {
    this._authState = authState;
    localStorage.setItem('authState',  (authState as any) as string);
  }
}
