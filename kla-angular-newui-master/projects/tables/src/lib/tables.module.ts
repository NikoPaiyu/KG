import { NgModule } from '@angular/core';
import { TablesComponent } from './tables.component';
import { GovernersAddressModule } from "./governers-address/governers-address.module";
import { FilesModule } from "./files/files.module";
import { SeatPlanListModule } from './seat-plan-list/seat-plan-list.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SeatManagementModule } from './seat-management/seat-management.module';
import { ObiturayManagementModule } from './obituray-management/obituray-management.module';
import { M2mProcessionComponent } from './shared/component/m2m-procession/m2m-procession.component';
import { ElectionManagementModule } from './election-management/election-management.module';
import { TableDiaryModule } from './table-diary/table-diary.module';
import { AssemblyElectionModule } from './assembly-election/assembly-election.module';
import { FormModule } from './forms/forms.module';
import { SwearingInModule } from './swearing-in/swearing-in.module';
import { ProceedingReporterModule } from './proceeding-reporter/proceeding-reporter.module';
import { TimeAllocationModule } from './time-allocation/time-allocation.module';
import { DocumentsModule } from './documents/documents.module';

@NgModule({
  declarations: [TablesComponent],
  imports: [
    GovernersAddressModule,
    FilesModule,
    SeatPlanListModule,
    SeatManagementModule,
    NzTableModule,
    ObiturayManagementModule,
    ElectionManagementModule,
    TableDiaryModule,
    AssemblyElectionModule,
    FormModule,
    SwearingInModule,
    ProceedingReporterModule,
    TimeAllocationModule,
    DocumentsModule
  ],
  exports: [TablesComponent]
})
export class TablesModule { }
