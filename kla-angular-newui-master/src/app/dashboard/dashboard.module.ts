import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { CastVoteComponent } from "./voting/cast-vote/cast-vote.component";
import { VotingService } from "./voting/shared/services/voting.service";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { VotingResultComponent } from "./voting/voting-result/voting-result.component";
import { DashboardComponent } from "./dashboard.component";
import { SpeakerChatComponent } from "./speaker-chat/speaker-chat.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChatSocketService } from "./shared/services/chat-socket.service";
import { CommonService } from "../shared/services/common.service";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { EBookComponent } from "./e-book/e-book.component";
import { VoteSocketService } from "./voting/shared/services/vote-socket.service";
import { DashBoardPdfViewerComponent } from "./shared/components/pdf-viewer/pdf-viewer.component";
import { SpeakerNoteService } from "./shared/services/speaker-note.service";
import { SortByPipe } from "../shared/pipes/sortBy.pipe";
import { SearchMemberPipe } from "./speaker-chat/searchMember.pipe";
import { NzBadgeModule } from "ng-zorro-antd/badge";
import { TranslateModule } from "@ngx-translate/core";
import { AttendanceComponent } from './attendance/attendance.component';
import { AttendanceService } from './attendance/shared/services/attendance.service';
import {SpeakerRBSService} from './shared/services/speaker-rbs.service';
import { HandwritingComponent } from './handwriting/handwriting.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { UserManagementService } from "../business-dashboard/user-management/shared/services/user-management.service";

//import {ListvoteResultsComponent} from './listvote-results/listvote-results.component';

@NgModule({
  declarations: [
    CastVoteComponent,
    VotingResultComponent,
    DashboardComponent,
    SpeakerChatComponent,
    EBookComponent,
    DashBoardPdfViewerComponent,
    SortByPipe,
    SearchMemberPipe,
    AttendanceComponent,
    HandwritingComponent,
   
    //ListvoteResultsComponent
  ],
  entryComponents: [
    VotingResultComponent,
   
    CastVoteComponent,
    SpeakerChatComponent,
    EBookComponent,
    DashBoardPdfViewerComponent,
    AttendanceComponent,
   // ListvoteResultsComponent,
    DashBoardPdfViewerComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    PdfJsViewerModule,
    NzBadgeModule,
    TranslateModule,
    NzMenuModule
  ],
  providers: [
    VotingService,
    VoteSocketService,
    ChatSocketService,
    SpeakerNoteService,
    CommonService,
    AttendanceService,
    SpeakerRBSService,
    CommonService,
    UserManagementService
  ]
})
export class DashboardModule {}
