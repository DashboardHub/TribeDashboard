import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
    declarations: [],
    exports: [
          BrowserAnimationsModule,
          MatCardModule,
          MatButtonModule
    ],
    providers: [],
    bootstrap: []
  })
  export class AppMaterialModule { }
