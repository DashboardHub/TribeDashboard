import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppStateService } from './services/app-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'TribeDashboard';
  public version: string;

  constructor(
    public router: Router,
    public afAuth: AngularFireAuth,
    public zone: NgZone,
    public appState: AppStateService,
  ) {
    this.version = environment.version;
    this.router = router;
  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.zone.run(() => {
          this.router.navigate(['/dashboard']);
        });
        this.appState.authState = true;
      } else {
        this.appState.authState = false;
      }
    });
  }
}
