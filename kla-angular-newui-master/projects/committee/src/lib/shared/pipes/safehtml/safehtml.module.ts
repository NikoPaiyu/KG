import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SafePipe } from '../safehtml/safehtml.pipe'

@NgModule({
  declarations: [SafePipe],
  imports: [
    CommonModule
  ],
  exports: [SafePipe]
})
export class SafehtmlModule { }
