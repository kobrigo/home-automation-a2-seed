import { Component } from '@angular/core';
import { Socket } from 'ng-socket-io';

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
  public logEntries: string[] = [];


  constructor(public socket: Socket) {
    console.log('in the debug component');

    console.log('listening to events on the socket');
    this.socket.on('pins:status', (message: any) => {
      this.logEntries.push(JSON.stringify(message.gpioPins));
    });
  }

  onGetPinsStatus() {
    this.socket.emit('pins:getStatus', {});
  }
}
