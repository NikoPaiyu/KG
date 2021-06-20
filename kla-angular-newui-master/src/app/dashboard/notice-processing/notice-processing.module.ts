import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticeProcessingRoutingModule } from './notice-processing-routing.module';
import { NoticeProcessingComponent } from './notice-processing.component';



@NgModule({
  declarations: [NoticeProcessingComponent],
  imports: [
    CommonModule,
    NoticeProcessingRoutingModule,

  ]
})
export class NoticeProcessingModule { }
