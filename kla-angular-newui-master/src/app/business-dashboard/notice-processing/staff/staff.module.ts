import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffRoutingModule } from './staff-routing.module';
import { PersonalRegisterComponent } from './personal-register/personal-register.component';
import { FileTrackingComponent } from './file-tracking/file-tracking.component';
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from "ng-zorro-antd/card";
import { NzModalModule } from 'ng-zorro-antd/modal';
// import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TranslateModule } from '@ngx-translate/core';
// import { NzDividerModule } from 'ng-zorro-antd/divider';
// import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
// import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { QuillModule } from 'ngx-quill';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AuthorisationsComponent } from './authorisations/authorisations.component';
import { BullettinFlowComponent } from './bullettin-flow/bullettin-flow.component';
import { DuplicateCheckQuestionsComponent } from './duplicate-check-questions/duplicate-check-questions.component';
import { QuestionansPreviewComponent } from '../shared/components/questionans-preview/questionans-preview.component';
import { BulletinListComponent } from './bulletin-list/bulletin-list.component';



@NgModule({
  declarations: [PersonalRegisterComponent, FileTrackingComponent, AuthorisationsComponent, BullettinFlowComponent, DuplicateCheckQuestionsComponent, QuestionansPreviewComponent, BulletinListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    StaffRoutingModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzStepsModule,
    NzLayoutModule,
    NzTabsModule,
    NzCardModule,
    NzModalModule,
    TranslateModule,
    NzDividerModule,
    NzTabsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzTableModule,
    NzInputModule,
    QuillModule.forRoot(),
    NzTagModule,
    FormsModule,
    ReactiveFormsModule,
    // FlexLayoutModule
  ],
  entryComponents: [
    QuestionansPreviewComponent
  ]
})
export class StaffModule {
  constructor() { }
}
