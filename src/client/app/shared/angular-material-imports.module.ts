import { NgModule } from '@angular/core';
import { MdButtonModule, MdCheckboxModule, MdSidenavModule, MdSlideToggleModule, MdButtonToggleModule } from '@angular/material';

@NgModule({
  imports: [MdButtonModule, MdCheckboxModule, MdSidenavModule, MdSlideToggleModule, MdButtonToggleModule],
  exports: [MdButtonModule, MdCheckboxModule, MdSidenavModule, MdSlideToggleModule, MdButtonToggleModule],
})

export class MaterialImportsModule {
}
