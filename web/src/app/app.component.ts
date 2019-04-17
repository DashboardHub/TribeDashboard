import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'TribeDashboard';
  public version: string;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private zone: NgZone,
  ) {
    this.version = environment.version;
  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.zone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    });
  }
}
