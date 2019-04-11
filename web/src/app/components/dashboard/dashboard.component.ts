import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private errorService: ErrorService
  ) { }

  ngOnInit() {}

  logout() {
    from(this.afAuth.auth.signOut())
      .pipe(
        map(()=> (this.navigateTologin())),
        catchError(err => this.errorService.logError(err))
      );
  }

  navigateTologin() {
    this.router.navigate(['/login'])
  }
  
}
