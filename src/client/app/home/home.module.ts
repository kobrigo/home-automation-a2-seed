import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ShaderApiService } from './shader-api.service';
import { SchedulesStoreService } from './schedule.service';
import { ScheduleItemComponent } from './schedule-item.component';

@NgModule({
  imports: [HomeRoutingModule, SharedModule],
  declarations: [HomeComponent, ScheduleItemComponent],
  exports: [HomeComponent],
  providers: [ShaderApiService, SchedulesStoreService]
})
export class HomeModule { }
