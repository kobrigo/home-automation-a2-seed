import { Component } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Component({
  moduleId: module.id,
  selector: 'ha-debug',
  providers: [],
  viewProviders: [],
  templateUrl: 'debug.component.html'
})

export class DebugComponent {
  public logEntries: string[] = [];

  somebuttonIsPressed = false;

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

  onStepperMotorStartLeft() {
    this.socket.emit('yaw:startMoveLeft', {});
    this.somebuttonIsPressed = true;
  }

  onStepperMotorStop() {
    if(this.somebuttonIsPressed) {
      this.socket.emit('yaw:stopMove', {});
      this.somebuttonIsPressed = false;
    }
  }

  onStepperMotorStartRight() {
    this.somebuttonIsPressed = true;
    this.socket.emit('yaw:startMoveRight', {});
  }
}
