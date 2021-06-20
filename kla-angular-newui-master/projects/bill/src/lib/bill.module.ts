import { NgModule } from "@angular/core";
import { BillComponent } from "./bill.component";
import { BillManagementModule } from "./bill-management/bill-management.module";
import { PriorityListModule } from "./priority-list/priority-list.module";
import { BillBulletinsModule } from "./bill-bulletins/bill-bulletins.module";
import { BillRegisterModule } from "./bill-register/bill-register.module";
import { ResponsesModule } from "./responses/responses.module";
import { BillAmendmentsModule } from "./bill-amendments/bill-amendments.module";
import { BallotingModule } from "./balloting/balloting.module";
import { BillFullViewModule } from "./bill-full-view/bill-full-view.module";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FilesModule } from "./files/files.module";
import { BacModule } from "./bac/bac.module";
@NgModule({
  declarations: [BillComponent],
  imports: [
    BillManagementModule,
    PriorityListModule,
    BillBulletinsModule,
    BillRegisterModule,
    ResponsesModule,
    BillAmendmentsModule,
    BillFullViewModule,
    FilesModule,
    BallotingModule,
    NzPopoverModule,
    BacModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [BillComponent],
})
export class BillModule {}
