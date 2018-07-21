import { Component, ViewChild } from '@angular/core';
import { Config } from './shared/config/env.config';
import './operators';
import { MdSidenav } from '@angular/material';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav: MdSidenav;

  constructor() {
    console.log('Environment config', Config);
  }

  onMenuClickedOnToolbar() {
    this.sidenav.toggle();
  }
}
