import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddClausesComponent } from './add-clauses/add-clauses.component';
import { BusinessListingComponent } from './business-listing/business-listing.component';

import { CommitteeMeetingComponent } from './committee-meeting.component';
import { CreateQuestionnaireComponent } from './create-questionnaire/create-questionnaire.component';
import { MeetingChooseComponent } from './meeting-choose/meeting-choose.component';
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';
import { MeetingLetterComponent } from './meeting-letter/meeting-letter.component';
import { MeetingNoticeComponent } from './meeting-notice/meeting-notice.component';
import { MeetingViewComponent } from './meeting-view/meeting-view.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { MinuteViewComponent } from './minute-view/minute-view.component';
import { QuestionnaireListingComponent } from './questionnaire-listing/questionnaire-listing.component';
import { QuestionnaireViewComponent } from './questionnaire-view/questionnaire-view.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';

import { SpecialInviteeComponent } from './special-invitee/special-invitee.component';
import { StaffAllocationComponent } from './staff-allocation/staff-allocation.component';
import { MeetingReportsComponent } from './meeting-reports/meeting-reports.component';
import { ViewMeetingComponent } from './view-meeting/view-meeting.component';
import { MinutesFileViewComponent } from './minutes-file-view/minutes-file-view.component';
import { BillClaimingComponent } from './bill-claiming/bill-claiming.component';
const routes: Routes = [

  {
    path: '', component: CommitteeMeetingComponent,
    children: [
      {
        path: "",
        redirectTo: "meeting-details",
      },
      {
        path: 'meeting-details',
        component: MeetingDetailsComponent,
      },
      {
        path: 'invitee/:purpose/:id',
        component: SpecialInviteeComponent,
      },
      {
        path: 'create-minute',
        component: MinuteViewComponent,
      },
      {
        path: 'meeting-choose',
        component: MeetingChooseComponent,
      },
      {
        path: 'meeting-notice',
        component: MeetingNoticeComponent,
      },
      {
        path: 'meeting-letter',
        component: MeetingLetterComponent,
      },
      {
        path: 'staff-allocation/:purpose/:id',
        component: StaffAllocationComponent,
      },
      {
        path: 'questionnaire',
        component: QuestionnaireComponent,
      },
      {
        path: 'create-questionnaire',
        component: CreateQuestionnaireComponent,
      },
      {
        path: 'meetings',
        component: MeetingsComponent,
      },
      {
        path: 'meeting-view/:id',
        component: MeetingViewComponent,
      },
      {
        path: 'view-meeting/:id',
        component: ViewMeetingComponent,
      },
      {
        path: 'minute-view/:meetingId',
        component: MinutesFileViewComponent,
      },
      {
        path: 'questionnaire-view/:id',
        component: QuestionnaireViewComponent,
      },
      {
        path: 'questionnaire-listing',
        component: QuestionnaireListingComponent,
      },
      {
        path: 'add-clauses/:id',
        component: AddClausesComponent,
      },
      {
        path: 'business-listing',
        component: BusinessListingComponent,
      },
      {
        path: 'meeting-reports',
        component: MeetingReportsComponent,
      },
      {
        path: 'bill-claiming',
        component: BillClaimingComponent,
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommitteeMeetingRoutingModule { }
