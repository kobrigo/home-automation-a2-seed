import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from '@angular/material';

import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';

@NgModule({

  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    AboutModule,
    HomeModule,
    SharedModule.forRoot(),
    MaterialModule.forRoot(), //TODO: move this to a differnt module to support tree-shaking. https://github.com/angular/material2/releases
    BrowserAnimationsModule,
  ],

  declarations: [AppComponent],

  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],

  bootstrap: [AppComponent]

})
export class AppModule {
}
