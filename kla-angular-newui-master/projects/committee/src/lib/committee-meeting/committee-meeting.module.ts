import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule, NzUploadModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommitteeMeetingComponent } from './committee-meeting.component';
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';
import { SpecialInviteeComponent } from './special-invitee/special-invitee.component';
import { CommitteeMeetingRoutingModule } from './committee-meeting-routing.module';
import { MeetingChooseComponent } from './meeting-choose/meeting-choose.component';
import { QuillModule } from "ngx-quill";
import { MeetingNoticeComponent } from './meeting-notice/meeting-notice.component';
import { MeetingLetterComponent } from './meeting-letter/meeting-letter.component';
import { StaffAllocationComponent } from './staff-allocation/staff-allocation.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { CreateQuestionnaireComponent } from './create-questionnaire/create-questionnaire.component';
import { MinuteViewComponent } from './minute-view/minute-view.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { FilePopupModule } from '../shared/components/file-popup/file-popup.module';
import { MeetingViewComponent } from './meeting-view/meeting-view.component';
import { SearchPipeModule } from '../shared/pipes/search-pipe/search-pipe.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AddStaffComponent } from '../shared/components/add-staff/add-staff.component';
import { MinutesFileViewComponent } from './minutes-file-view/minutes-file-view.component';
import { QuestionnaireViewComponent } from './questionnaire-view/questionnaire-view.component';
import { QuestionnaireListingComponent } from './questionnaire-listing/questionnaire-listing.component';
import { LetterforSupportingDocComponent } from './letterfor-supporting-doc/letterfor-supporting-doc.component';
import { AddClausesComponent } from './add-clauses/add-clauses.component';
import { GenerateMeetingReportComponent } from './generate-meeting-report/generate-meeting-report.component';
import { MeetingReportPreviewComponent } from './meeting-report-preview/meeting-report-preview.component';
import { ObjectionNoteComponent } from './objection-note/objection-note.component';
import { BusinessListingComponent } from './business-listing/business-listing.component';
import { MeetingReportsComponent } from './meeting-reports/meeting-reports.component';
import { CreateCommitteeContentSelectComponent } from './create-bill-content-select/create-bill-content-select.component';
import { ViewMeetingComponent } from './view-meeting/view-meeting.component';
import { MinisterReadingComponent } from './minister-reading/minister-reading.component';
import { SafehtmlModule } from '../shared/pipes/safehtml/safehtml.module';
import { BillClaimingComponent } from './bill-claiming/bill-claiming.component';

const Components = [CommitteeMeetingComponent, MeetingDetailsComponent, SpecialInviteeComponent, MinuteViewComponent, MeetingChooseComponent, MeetingNoticeComponent, MeetingLetterComponent, StaffAllocationComponent, QuestionnaireComponent, CreateQuestionnaireComponent];

@NgModule({
  declarations: [...Components, MeetingsComponent, MeetingViewComponent,AddStaffComponent, CreateCommitteeContentSelectComponent,MeetingReportsComponent,
    MinutesFileViewComponent, QuestionnaireViewComponent, QuestionnaireListingComponent, LetterforSupportingDocComponent, AddClausesComponent, GenerateMeetingReportComponent, MeetingReportPreviewComponent, BusinessListingComponent,ObjectionNoteComponent, ViewMeetingComponent, MinisterReadingComponent, BillClaimingComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FilePopupModule,
    CommitteeMeetingRoutingModule,
    QuillModule.forRoot(),
    SearchPipeModule,
    CKEditorModule,
    NzUploadModule,
    SafehtmlModule
  ],
  exports: [MeetingViewComponent,StaffAllocationComponent,MinutesFileViewComponent,SpecialInviteeComponent,MeetingNoticeComponent, 
    QuestionnaireViewComponent,MeetingLetterComponent,LetterforSupportingDocComponent,MeetingReportPreviewComponent],
})
export class CommitteeMeetingModule { }
