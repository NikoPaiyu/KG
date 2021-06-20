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
import { FilesComponent } from './files/files.component';
import { CreateFileComponent } from './create-file/create-file.component';
import { AttachToFileComponent } from './attach-to-file/attach-to-file.component';
import { TimeAllocationModule } from '../time-allocation/time-allocation.module';
import { QuillModule } from 'ngx-quill';
import { ApBillModule } from '../ap-bill/ap-bill.module';
import { ApBillOnBudgetModule } from '../ap-bill/ap-bill-on-budget/ap-bill-on-budget.module';
import { BillFullViewModule } from '../ap-bill/bill-full-view/bill-full-view.module';
import { StmtDemandsGrantsModule } from '../budget-document/stmt-demands-grants/stmt-demands-grants.module';
import { DemandDraftScheduleModule } from '../budget-document/demand-draft-schedule/demand-draft-schedule.module';
import { BudgetLetterViewComponent } from '../shared/component/budget-letter-view/budget-letter-view.component';
import { CutMotionModule } from '../budget-document/cut-motion/cut-motion.module';
import { BudgetDocumentModule } from '../budget-document/budget-document.module';
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { SdgAndEgModule } from '../sdg-and-eg/sdg-and-eg.module';
import { ValidatePasswordModule } from '../shared/component/validate-password/validate-password.module'

@NgModule({
  declarations: [NotesComponent, FileViewComponent, FileListComponent, ButtonsComponent, FilesComponent, CreateFileComponent, AttachToFileComponent, BudgetLetterViewComponent],
  imports: [
    CommonModule,
    FilesRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    // BudgetSpeechModule,
    BillFullViewModule,
    ApBillModule,
    ApBillOnBudgetModule,
    StmtDemandsGrantsModule,
    TimeAllocationModule,
    DemandDraftScheduleModule,
    CutMotionModule,
    BudgetDocumentModule,
    NgxDocViewerModule,
    SdgAndEgModule,
    ValidatePasswordModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }],
          [{ direction: "rtl" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      },
    })
  ],
  exports: [],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FilesModule { }
