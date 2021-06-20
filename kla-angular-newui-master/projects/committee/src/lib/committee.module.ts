import { NgModule } from "@angular/core";
import { CommitteeComponent } from "./committee.component";
import { FilesModule } from "./files/files.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { CommitteeConstitutionModule } from "./committee-constitution/committee-constitution.module";
import { CommitteesModule } from "./committees/committees.module";  
import {CommitteeBulletinsModule} from "./committee-bulletins/committee-bulletins.module";
import { CommitteeMeetingModule } from "./committee-meeting/committee-meeting.module";

import { NzCardModule } from 'ng-zorro-antd/card';
import { AgendaModule } from "./pmbr-committee/agenda/agenda.module";
import { PmbrCommitteeModule } from "./pmbr-committee/pmbr-committee.module";
import { AssuranceModule } from "./pmbr-committee/assurance/assurance.module";
@NgModule({
  declarations: [CommitteeComponent],
  imports: [
    FilesModule,
    AttendanceModule,
    CommitteeConstitutionModule,
    CommitteesModule,
    NzCardModule,
    CommitteeMeetingModule,
    CommitteeBulletinsModule,
    AgendaModule,
    PmbrCommitteeModule,
    AssuranceModule
  ],
  exports: [CommitteeComponent],
})
export class CommitteeModule {}
