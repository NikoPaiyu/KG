import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionComponent } from './submission.component';
import { SubFolderComponent } from './sub-folder/sub-folder.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { NzDrawerModule, NzEmptyModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { SubmissionRoutingModule } from '../submission/submission-routing.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [SubmissionComponent, SubFolderComponent],
  imports: [
    CommonModule,
    PdfJsViewerModule,
    NzDrawerModule,
    FormsModule,
    NzEmptyModule,
    SubmissionRoutingModule,
    NzSelectModule,
    TranslateModule
  ]
})
export class SubmissionModule { }
