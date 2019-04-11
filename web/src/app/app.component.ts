import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
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
  ) {
    this.version = environment.version;
    this.router = router;
  }

  ngOnInit() {
    console.log('router', this.router);
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.zone.runOutsideAngular(()=> {
          this.router.navigate(['/dashboard']);
        })
      } else {
        // No user is signed in.
        console.log('else part');
        // this.router.navigate(['/login'])
      }
    });
  }
}
