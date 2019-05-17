import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'TribeDashboard';
  public version: string;
  public params = {};

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
    this.version = environment.version;
  }

  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (e instanceof ActivationEnd) {
        this.params = e.snapshot.params;
      }
    });
  }
}
