import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [],
})
export class AppMaterialModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/github.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'instagram',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/instagram.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'youtube',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/youtube.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'youtube-fill',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/youtube_fill.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'twitter',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/twitter.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'github1x',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/github1x.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'twitter1x',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/twitter1x.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'youtube1x',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/youtube1x.svg')
    );
  }
}
