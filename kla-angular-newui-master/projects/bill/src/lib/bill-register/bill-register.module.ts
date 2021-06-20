import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BillRegisterRoutingModule } from './bill-register-routing.module';
import { BillRegisterComponent } from './bill-register.component';
import { BillRegisterListComponent } from './bill-register-list/bill-register-list.component';
import { CreateBillRegisterComponent } from './create-bill-register/create-bill-register.component';


@NgModule({
  declarations: [BillRegisterComponent, BillRegisterListComponent, CreateBillRegisterComponent],
  imports: [
    CommonModule,
    BillRegisterRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BillRegisterModule { }
