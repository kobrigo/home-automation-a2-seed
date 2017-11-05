import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISchedule } from './schedule.model';
import { SchedulesStoreService } from './schedule.service';

@Component({
  moduleId: module.id,
  selector: 'schedule-item',
  templateUrl: './schedule-item.component.html',
})

export class ScheduleItemComponent implements OnInit {
  @Input() model: ISchedule;
  @Output() changed: EventEmitter<string> = new EventEmitter();

  onAtSunday: boolean = false;
  onAtMonday: boolean = false;
  onAtTuesday: boolean = false;
  onAtWednesday: boolean = false;
  onAtThursday: boolean = false;
  onAtFriday: boolean = false;
  onAtSaturday: boolean = false;

  constructor(public schedulesStoreService: SchedulesStoreService) {
  }

  ngOnInit(): void {
    if (this.model.onDays) {
      this.model.onDays.forEach((day) => {
        switch (day) {
          case 'Sunday':
            this.onAtSunday = true;
            break;
          case 'Monday':
            this.onAtMonday = true;
            break;
          case 'Tuesday':
            this.onAtTuesday = true;
            break;
          case 'Wednesday':
            this.onAtWednesday = true;
            break;
          case 'Thursday':
            this.onAtThursday = true;
            break;
          case 'Friday':
            this.onAtFriday = true;
            break;
          case 'Saturday':
            this.onAtSaturday = true;
            break;
        }
      });
    }
  }

  onDayChanged($event: any, dayChanged: string) {
    if (!$event.source.checked) {
      let indexOfRemovedDay = this.model.onDays.findIndex(day => day === dayChanged);
      if (indexOfRemovedDay !== -1) {
        this.model.onDays.splice(indexOfRemovedDay, 1);
      }
    } else {
      this.model.onDays.push(dayChanged);
    }
    this.schedulesStoreService.saveSchedule(this.model);
    // this.changed.next(dayChanged);
  }

  onEnableToggleChanged($event: any, schedule: ISchedule) {
    console.log($event, schedule);
    this.schedulesStoreService.saveSchedule(schedule);
  }
}

