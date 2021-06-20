import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BillFullViewRoutingModule } from './bill-full-view-routing.module';
import { BillFullViewComponent } from './bill-full-view.component';
import { BillContentComponent } from './bill-content/bill-content.component';
import { BillInfoComponent } from './bill-info/bill-info.component';
import { BillViewComponent } from './bill-view/bill-view.component';


@NgModule({
  declarations: [BillFullViewComponent, BillContentComponent, BillInfoComponent, BillViewComponent],
  imports: [
    CommonModule,
    BillFullViewRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[BillContentComponent,BillViewComponent]
})
export class BillFullViewModule { }
