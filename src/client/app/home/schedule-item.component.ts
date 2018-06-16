import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISchedule } from './schedule.model';
import { SchedulesStoreService } from './schedule.service';

declare var moment: any;

class DaysViewModel {
  Sunday: boolean = false;
  Monday: boolean = false;
  Tuesday: boolean = false;
  Wednesday: boolean = false;
  Thursday: boolean = false;
  Friday: boolean = false;
  Saturday: boolean = false;
}

@Component({
  moduleId: module.id,
  selector: 'schedule-item',
  styleUrls: ['./schedule-item.component.css'],
  templateUrl: './schedule-item.component.html',
})
export class ScheduleItemComponent implements OnInit {
  @Input() model: ISchedule;
  @Output() changed: EventEmitter<string> = new EventEmitter();

  //the view-model for the days
  daysViewModel = new DaysViewModel();
  editingDaysViewModel: DaysViewModel;

  durationAsDate: Date;

  //the view-model for the start and end time
  startAtTimeAsDate: Date;

  editing = false;
  saving = false;

  constructor(public schedulesStoreService: SchedulesStoreService) {
  }

  ngOnInit(): void {
    if (this.model.onDays) {
      this.model.onDays.forEach((day: string) => {
        (this.daysViewModel as any)[day] = true;
      });


    }
  }

  onEditClicked() {
    this.editingDaysViewModel = new DaysViewModel();
    Object.assign(this.editingDaysViewModel, this.daysViewModel);

    var startAtTimeMoment = moment(this.model.startAtTime, 'HH:mm:ss');
    this.startAtTimeAsDate = startAtTimeMoment.toDate();


    var durationAsMoment = moment(this.model.duration, 'HH:mm:ss');
    this.durationAsDate = durationAsMoment.toDate();

    this.editing = true;
  }

  onCancelClicked() {
    this.editing = false;
    Object.assign(this.editingDaysViewModel, this.daysViewModel);
  }

  onSaveClicked() {
    let newModelToSave = this.convertViewModelToModel();

    this.saving = true;
    this.schedulesStoreService.saveSchedule(newModelToSave).finally(() => {
      this.editing = false;
      this.saving = false;
    });
  }

  convertViewModelToModel(): ISchedule {
    let resultDaysArray: string[] = [];
    let clonedModel = Object.assign({}, this.model);
    Object.keys(this.editingDaysViewModel).forEach((dayName) => {
      if ((this.editingDaysViewModel as any)[dayName]) {
        resultDaysArray.push(dayName);
      }
    });

    clonedModel.onDays = resultDaysArray;
    clonedModel.startAtTime = moment(this.startAtTimeAsDate).format('HH:mm:ss');
    clonedModel.duration = moment(this.durationAsDate).format('HH:mm:ss');
    return clonedModel;
  }

  onEnableToggleChanged($event: any, schedule: ISchedule) {
    console.log($event, schedule);
    this.schedulesStoreService.saveSchedule(schedule);
  }
}

