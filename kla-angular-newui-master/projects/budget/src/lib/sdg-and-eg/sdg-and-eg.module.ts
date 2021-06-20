import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SdgAndEgRoutingModule } from './sdg-and-eg-routing.module';
import { SdgAndEgComponent } from './sdg-and-eg.component';
import { SdgRequestListComponent } from './sdg-request-list/sdg-request-list.component';
import { CreateSdgegRequestComponent } from './create-sdgeg-request/create-sdgeg-request.component';
import { SdgEgListComponent } from './sdg-eg-list/sdg-eg-list.component';
import { SdgegGrlReplyComponent } from './sdgeg-grl-reply/sdgeg-grl-reply.component';


@NgModule({
  declarations: [SdgAndEgComponent, SdgRequestListComponent, CreateSdgegRequestComponent, SdgEgListComponent, SdgegGrlReplyComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SdgAndEgRoutingModule
  ],
  exports:[
    SdgegGrlReplyComponent
  ]
})
export class SdgAndEgModule { }
