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
import { AngularFireFunctionsModule} from '@angular/fire/functions';

// components
import { HomeComponent } from './components/home/home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';

// services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ErrorService } from './services/error.service';
import { DashboardGuardService } from './guards/dashboard.guard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SocialCardsComponent } from './components/social-cards/social-cards.component';
import { AlertComponent } from './components/alert/alert.component';
import { NonTribePageGuardService } from './guards/non-tribe-page.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    DashboardComponent,
    HomeComponent,
    NavbarComponent,
    SocialCardsComponent,
    AlertComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    AngularFireFunctionsModule
  ],
  providers: [
    AuthService,
    UserService,
    ErrorService,
    DashboardGuardService,
    NonTribePageGuardService,
  ],
  entryComponents: [
    AlertComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
