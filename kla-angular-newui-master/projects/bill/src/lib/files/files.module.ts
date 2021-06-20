import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilesRoutingModule } from './files-routing.module';
import { NotesComponent } from './notes/notes.component';
import { FileViewComponent } from './file-view/file-view.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileListComponent } from './file-list/file-list.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { BillContentComponent } from '../bill-full-view/bill-content/bill-content.component';
import { BillFullViewModule } from '../bill-full-view/bill-full-view.module';
import { FilesComponent } from './files/files.component';
import { PriorityListViewModule } from '../shared/components/priority-list-view/priority-list-view.module';
import { ErratumFileViewComponent } from './erratum-file-view/erratum-file-view.component';
import { QuillModule } from 'ngx-quill';
import { BulletinPart2ViewModule } from './bulletin-part2-view/bulletin-part2-view.module';
import { PriorityListRequestViewComponent } from '../priority-list/priority-list-request-view/priority-list-request-view.component';
import { PriorityListModule } from '../priority-list/priority-list.module';
import { CreateBulletinFormModule } from '../shared/components/create-bulletin-form/create-bulletin-form.module';
import { BallotingFileComponent } from './balloting-file/balloting-file.component';
import { InitialDaysComponent } from '../priority-list/initial-days/initial-days.component';
import { CosViewComponent } from './cos-view/cos-view.component';
import { MinisterMotionViewComponent } from '../bill-full-view/minister-motion-view/minister-motion-view.component';
import { BallotListViewComponent } from '../balloting/ballot-list-view/ballot-list-view.component';
import { BallotingModule } from '../balloting/balloting.module';
import { BallotFileViewComponent } from './ballot-file-view/ballot-file-view.component';
import { BillAmendmentsModule } from '../bill-amendments/bill-amendments.module';
import { BillClauseListViewComponent } from '../bill-amendments/bill-clause-list-view/bill-clause-list-view.component';
import { CommitteeReportPreviewModule} from '../shared/components/committee-report-preview/committee-report-preview.module';
import { NgxDocViewerModule } from "ngx-doc-viewer";
// import { TableDiaryModule } from 'projects/tables/src/lib/table-diary/table-diary.module';
// import { TableDiaryModule } from 'projects/tables/src/lib/table-diary/table-diary.module';


@NgModule({
  declarations: [NotesComponent, FileViewComponent, FileListComponent, ButtonsComponent, FilesComponent, ErratumFileViewComponent,
    BallotingFileComponent,
    CosViewComponent,
    BallotFileViewComponent],
  imports: [
    CommonModule,
    FilesRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    BillFullViewModule,
    PriorityListViewModule,
    BulletinPart2ViewModule,
    PriorityListModule,
    CreateBulletinFormModule,
    BallotingModule,
    BillAmendmentsModule,
    QuillModule.forRoot(),
    CommitteeReportPreviewModule,
    NgxDocViewerModule,
    // TableDiaryModule
    // TableDiaryModule
  ],
  entryComponents: [BillContentComponent,
    PriorityListRequestViewComponent,
    InitialDaysComponent,
    CosViewComponent,
    MinisterMotionViewComponent,
    BallotListViewComponent,
    BillClauseListViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FilesModule { }
