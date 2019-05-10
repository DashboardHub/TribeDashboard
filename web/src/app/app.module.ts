import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './app.material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';


// components
import { HomeComponent } from './components/home/home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ErrorService } from './services/error.service';
import { AuthGuardService } from './guards/auth.guard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SocialCardsComponent } from './components/social-cards/social-cards.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    DashboardComponent,
    HomeComponent,
    NavbarComponent,
    SocialCardsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    UserService,
    ErrorService,
    AuthGuardService,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
