import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardGuardService } from './guards/dashboard.guard';
import { NonTribePageGuardService } from './guards/non-tribe-page.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [NonTribePageGuardService] },
  { path: 'login', component: LoginPageComponent, canActivate: [NonTribePageGuardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuardService] },
  { path: 'dashboard/:provider/:name', component: DashboardComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      // {enableTracing: true}
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
