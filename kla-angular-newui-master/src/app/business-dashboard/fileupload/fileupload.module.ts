import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FileuploadRoutingModule } from "./fileupload-routing.module";
import { FileuploadComponent } from "./fileupload.component";
import { RulesAndProcedureComponent } from "../fileupload/rules-and-procedure/rules-and-procedure.component";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzInputModule } from "ng-zorro-antd/input";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    FileuploadComponent,
    RulesAndProcedureComponent,

  ],
  imports: [
    CommonModule,TranslateModule,
    FileuploadRoutingModule,
    NzDatePickerModule,
    NzUploadModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    })
  ]
})
export class FileuploadModule { }
