import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { SocialStatsHistory } from '../models/socialStatsHistory';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class SocialStatsService {

  public socialStatsHistory: AngularFirestoreCollection;

  constructor(
    private db: AngularFirestore,
    private errorService: ErrorService,
  ) {
    this.socialStatsHistory = this.db.collection('socialStatsHistory');
  }

  createSocialStats(socialStat: SocialStatsHistory): Observable<SocialStatsHistory> {
    return from(this.socialStatsHistory.add(socialStat))
      .pipe(
        map(res => res),
        catchError(error => this.errorService.logError(error)),
      );
  }
}
