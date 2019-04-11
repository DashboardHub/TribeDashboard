import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  constructor(){}

  saveUser(user: Object) {
    console.log('user in service', user);
  }
}
