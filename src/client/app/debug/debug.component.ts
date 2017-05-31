import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'ha-debug',
  providers: [],
  viewProviders: [],
  templateUrl: 'debug.component.html',
  // styleUrls: ['./debug.component.css'],
  // directives: [],
  // pipes: []
})

export class DebugComponent {
  constructor() {
    console.log('in the debug component');
  }
}
