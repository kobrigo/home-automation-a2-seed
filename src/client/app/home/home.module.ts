import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ShaderApiService } from './shader-api.service';
import { SchedulesStoreService } from './schedule.service';
import { ScheduleItemComponent } from './schedule-item.component';

//primeng modules
import { CalendarModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';

@NgModule({
  imports: [HomeRoutingModule, SharedModule, CalendarModule, ButtonModule, ToggleButtonModule],
  declarations: [HomeComponent, ScheduleItemComponent],
  exports: [HomeComponent],
  providers: [ShaderApiService, SchedulesStoreService]
})
export class HomeModule {
}
