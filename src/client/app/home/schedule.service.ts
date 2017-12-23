import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ISchedule } from './schedule.model';
import { ShaderApiService } from './shader-api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SchedulesStoreService {
  public shaderSchedules: Observable<ISchedule[]>;
  private _shaderSchedules: BehaviorSubject<ISchedule[]> = new BehaviorSubject(null);

  constructor(private shaderApiService: ShaderApiService) {
    this.shaderSchedules = this._shaderSchedules.asObservable();
    //load the initial data
    this.shaderApiService.getAllSchedules().subscribe((schedules: ISchedule[]) => {
      this._shaderSchedules.next(schedules);
    });
  }

  getShaderSchedules() {
    return this._shaderSchedules.getValue();
  }

  saveSchedule(schedule: ISchedule) {
    let observable = this.shaderApiService.saveSchedule(schedule);

    observable.subscribe((updatedSchedules: ISchedule[]) => {
      // let schedules = this._shaderSchedules.getValue();
      // let scheduleIndex = schedules.findIndex(schedule => schedule.id === updatedSchedule.id);
      // schedules[scheduleIndex] = updatedSchedule;
      this._shaderSchedules.next(updatedSchedules);
    });

    return observable;
  }
}
