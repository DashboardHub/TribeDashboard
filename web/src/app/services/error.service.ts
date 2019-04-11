import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService{
  constructer() {}

  logError(error: any): Promise<any> {
    console.error(error);
    return Promise.reject(error);
  }
}
