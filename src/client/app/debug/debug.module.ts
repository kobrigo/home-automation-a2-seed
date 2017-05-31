import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import { DebugComponent } from './debug.component';
import { DebugRoutingModule } from './debug-routing.module';

@NgModule({
  imports: [DebugRoutingModule, SharedModule],
  declarations: [DebugComponent],
  exports: [DebugComponent],
  providers: [NameListService]
})
export class DebugModule { }
