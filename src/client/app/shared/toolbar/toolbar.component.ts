import { Component, EventEmitter, Output } from '@angular/core';

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarComponent {
  @Output() menuClicked: EventEmitter<any> = new EventEmitter<any>();

  onMenuClicked() {
    this.menuClicked.emit();
  }
}

