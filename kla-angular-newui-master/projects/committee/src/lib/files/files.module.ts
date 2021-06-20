import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesRoutingModule } from "./files-routing.module";

import { FilesComponent } from './files.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { NotesComponent } from './notes/notes.component';
import { FileViewComponent } from './file-view/file-view.component';
import { FileListComponent } from './file-list/file-list.component';
import { CreateFileComponent } from './create-file/create-file.component';

import { CommitteeConstitutionModule } from '../committee-constitution/committee-constitution.module';
import { SubjectCommitteeFileviewComponent } from './subject-committee-fileview/subject-committee-fileview.component';
import { CommitteeMeetingModule } from '../committee-meeting/committee-meeting.module';
import { BulletinPart2ViewModule } from './bulletin-part2-view/bulletin-part2-view.module';
import { AttendenceFileViewComponent } from './attendence-file-view/attendence-file-view.component';
import { SafehtmlModule } from '../shared/pipes/safehtml/safehtml.module';
import { SelectCommitteeFileviewComponent } from './select-committee-fileview/select-committee-fileview.component';

// tslint:disable-next-line: max-line-length
const Components = [NotesComponent, ButtonsComponent, FileViewComponent, FileListComponent, FilesComponent, CreateFileComponent];

@NgModule({
  declarations: [...Components, SubjectCommitteeFileviewComponent, AttendenceFileViewComponent, SelectCommitteeFileviewComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FilesRoutingModule,
    CommitteeConstitutionModule,
    CommitteeMeetingModule,
    BulletinPart2ViewModule,
    SafehtmlModule
  ],
  exports: [ButtonsComponent, CreateFileComponent, NotesComponent,
    SubjectCommitteeFileviewComponent,SelectCommitteeFileviewComponent]
})
export class FilesModule { }
