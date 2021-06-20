import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BulletinModule } from './bulletin/bulletin.module';
import { FilesModule } from './files/files.module';
import { MemberReadingModule } from './member-reading/member-reading.module';
import { PmbrBillModule } from './pmbr-bill/pmbr-bill.module';
import { PmbrResolutionModule } from './pmbr-resolution/pmbr-resolution.module';
import { PmbrScheduleModule } from './pmbr-schedule/pmbr-schedule.module';
import { PmbrComponent } from './pmbr.component';
import { SpeakerModule } from './speaker/speaker.module';




@NgModule({
  declarations: [PmbrComponent],
  imports: [
    PmbrBillModule,
    PmbrScheduleModule,
    PmbrResolutionModule,
    FormsModule,
    ReactiveFormsModule,
    FilesModule,
    SpeakerModule,
    MemberReadingModule,
    BulletinModule
  ],
  exports: [PmbrComponent]
})
export class PmbrModule { }
