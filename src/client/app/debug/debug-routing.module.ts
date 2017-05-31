import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DebugComponent } from './debug.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'debug', component: DebugComponent }
    ])
  ],
  exports: [RouterModule]
})
export class DebugRoutingModule { }
