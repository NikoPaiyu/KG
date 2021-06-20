import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HandRaiseRoutingModule } from "./hand-raise-routing.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NzEmptyModule } from "ng-zorro-antd/empty";
import { HandRaiseComponent } from "./hand-raise.component";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [HandRaiseComponent],
  imports: [
    CommonModule,
    HandRaiseRoutingModule,
    NgZorroAntdModule,
    NzEmptyModule,
    TranslateModule
  ]
})
export class HandRaiseModule {}
