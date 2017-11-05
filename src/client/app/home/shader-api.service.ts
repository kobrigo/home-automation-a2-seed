import { Injectable } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { Observable } from 'rxjs/Observable';
import { ISchedule } from './schedule.model';

@Injectable()
export class ShaderApiService {
  constructor(private httpService: HttpService) {
  }

  getAllSchedules(): Observable<ISchedule[]> {
    return this.httpService.get('/api/shader/schedules').share();
  }

  saveSchedule(schedule: ISchedule) {
    return this.httpService.put(`/api/shader/schedules/${schedule.id}`, schedule).share();
  }
}
