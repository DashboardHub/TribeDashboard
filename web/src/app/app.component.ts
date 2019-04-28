import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';

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
    private userService: UserService,
  ) {
    this.version = environment.version;
  }

  ngOnInit() {
    this.userService.getUser()
      .subscribe((user) => {
        if (user) {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
