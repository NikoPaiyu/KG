import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilesRoutingModule } from './files-routing.module';
import { FileListComponent } from './file-list/file-list.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilesComponent } from './files.component';
import { FileViewComponent } from './file-view/file-view.component';
import { FileWorkflowActionsComponent } from './shared/components/file-workflow-actions/file-workflow-actions.component';
import { AddNotesComponent } from './shared/components/add-notes/add-notes.component';
import { ScheduleFileViewComponent } from './shared/components/schedule-file-view/schedule-file-view.component';
import { PmbrBillModule } from '../pmbr-bill/pmbr-bill.module';
import { BulletinPart2ViewComponent } from './shared/components/bulletin-part2-view/bulletin-part2-view.component';
import { QuillModule } from 'ngx-quill';
import { RejectionLetterFormComponent } from './shared/components/rejection-letter-form/rejection-letter-form.component';
import { LetterFormComponent } from './shared/components/letter-form/letter-form.component';
import { BallotFileComponent } from './ballot-file/ballot-file.component';
import { ResolutionBallotViewComponent } from '../pmbr-resolution/resolution-ballot-view/resolution-ballot-view.component';
import { PmbrResolutionModule, ResolutionCreateNoticeComponent } from '../pmbr-resolution/pmbr-resolution.module';
import { BillClauseListViewComponent } from '../pmbr-resolution/bill-clause-list-view/bill-clause-list-view.component';
@NgModule({
  declarations: [FilesComponent, FileListComponent, FileViewComponent, FileWorkflowActionsComponent, AddNotesComponent, ScheduleFileViewComponent, BulletinPart2ViewComponent, RejectionLetterFormComponent, LetterFormComponent, BallotFileComponent],
  imports: [
    CommonModule,
    FilesRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PmbrBillModule,
    PmbrResolutionModule,
    QuillModule.forRoot()
  ],
  entryComponents: [
    ResolutionBallotViewComponent,
    BillClauseListViewComponent,
    ResolutionCreateNoticeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FilesModule { }
