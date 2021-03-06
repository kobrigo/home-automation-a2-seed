import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NameListService } from './name-list/name-list.service';
import { MaterialImportsModule } from './angular-material-imports.module';
import { HttpService } from './http.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialImportsModule
  ],
  declarations: [ToolbarComponent, NavbarComponent],
  exports: [ToolbarComponent, NavbarComponent,
    CommonModule, FormsModule, RouterModule, MaterialImportsModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService, HttpService]
    };
  }
}
