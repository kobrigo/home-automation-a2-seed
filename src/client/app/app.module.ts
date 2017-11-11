import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { DebugModule } from './debug/debug.module';
import { MaterialImportsModule } from './shared/angular-material-imports.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SocketIoModule, SocketIoConfig } from 'ng2-socket-io';

const socketIoConfig: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({

  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    AboutModule,
    HomeModule,
    DebugModule,
    SharedModule.forRoot(),
    BrowserAnimationsModule,
    MaterialImportsModule,
    FlexLayoutModule,
    SocketIoModule.forRoot(socketIoConfig)
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
