import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileServiceService } from '../../shared/services/file-service.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { CommitteeService } from '../../shared/services/committee.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { MeetingViewComponent } from '../../committee-meeting/meeting-view/meeting-view.component';
import { differenceInCalendarDays, parseISO } from 'date-fns';

@Component({
  selector: 'committee-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss'],
})
export class FileViewComponent implements OnInit {
  assignee: any;
  currentPoolUser: any;
  workflowUsers: any = [];
  allWorkflowUsers: any = [];
  logDetails: any = [];
  stepStatusDetail: any = [];
  notesInfo: any = [];
  fileId: any;
  fileDetails: any = null;
  latestNote: any = null;
  createNomineeModel;
  nomineeTitle = null;
  tabParams = {};
  user;
  fullScreenMode = false;
  selectedMeetingId = null;
  selectedMeetingDetails: any;
  isEditPrio: boolean;
  priority;
  ratificationStatus: any;
  sectionRole: any;
  responseAvailable = false;
  showWarning = false;
  @ViewChild(MeetingViewComponent, { static: false }) meetView: MeetingViewComponent;
  minutePop = false;

  constructor(
    private route: ActivatedRoute,
    @Inject('authService') private auth,
    private router: Router,
    private file: FileServiceService,
    public common: CommitteecommonService,
    public committee: CommitteeService,
    private notification: NzNotificationService
  ) {
    this.common.setCommitteePermissions(auth.getCurrentUser().rbsPermissions);
    this.user = auth.getCurrentUser();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      this.getFileByFileId(this.fileId);
    });
  }
  getFileByFileId(fileId) {
    this.file
      .getFileById(fileId, this.auth.getCurrentUser().userId)
      .subscribe((Response) => {
        if (Response) {
        this.fileDetails = Response;
        this.priority = this.fileDetails.fileResponse.priority;
        this.responseAvailable = true;
        this.notesInfo = this.fileDetails.fileResponse;
        if (this.fileDetails && this.fileDetails.letter && this.fileDetails.letter.correspondenceId) {
          this.getCorrespondenceById(this.fileDetails.letter.correspondenceId, 'lettertoppo', null);
        }
        if (this.fileDetails.fileResponse.subtype === 'COMMITTEE_MEETING') {
          this.selectedMeetingDetails = null;
          this.selectedMeetingId = this.fileDetails.meetings[this.fileDetails.meetings.length - 1].meetingDetails.meetingId;
          this.selectedMeetingDetails = this.fileDetails.meetings[this.fileDetails.meetings.length - 1];
        }
        if (this.fileDetails.fileResponse.activeSubTypes.includes('MEETING_DETAIL')) {
          this.checkForwardedDate();
        }
        this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
        this.getWorkflowUsers(this.notesInfo);
        this.getAllNotes(this.notesInfo.fileId);
        this.logDetails = this.fileDetails.fileResponse.logs;
        this.getWorkflowStatus();
        this.setTabfilters();
        // this.ratificationStatus = 'PENDING';
        if (this.fileDetails.fileResponse.ratification) {
        if (this.fileDetails.fileResponse.ratification.length !== 0) {
          const temp = this.fileDetails.fileResponse.ratification.filter(
            (x) => x.sectionRole === this.sectionRole
          );
          if (temp.length !== 0) {
            this.ratificationStatus = temp[0].status;
          }
        }
      }
      }
    });
  }

  getWorkflowStatus() {
    this.file
      .checkWorkFlowStatus(this.fileDetails.fileResponse.workflowId)
      .subscribe((Res) => {
        if (Res) {
        this.stepStatusDetail = Res;
        const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
        this.currentPoolUser = current.owner;
        this.assignee = current.assignee;
      }
      });
  }
  getStatusByReason(reason) {
    if (reason) {
      if (reason === 'completed') {
        return 'finish';
      }
      if (reason === 'in progress') {
        return 'wait';
      }
    }
  }
  showContent() {}
  getWorkflowUsers(notesinfo) {
    // tslint:disable-next-line: triple-equals
    if (notesinfo.status !== 'APPROVED') {
      this.file
        .getWorkflowActionUsers(notesinfo.workflowId, notesinfo.fileId)
        .subscribe((Res:any) => {
          Res.forEach((r, index) => {
            if (r.code == 'SELECT_COMMITTEE_CHAIRMAN' && this.fileDetails.chairman) {
               if(r.userId == this.fileDetails.chairman.memberId ){
                this.allWorkflowUsers.push(r);
                }
            }else{
              this.allWorkflowUsers.push(r);
            }
          });
    });
    }
  }
  getAllNotes(id) {
    this.file.getAllNotes(id).subscribe((Response) => {
      if (Response) {
      this.notesInfo.notes = Response;
      }
    });
  }
  getCorrespondenceById(correspondeceId, type, index){
    this.common
    .getCorrespondenceById(correspondeceId, this.user.correspondenceCode.code)
    .subscribe((Res:any) => {

      if (type === 'lettertoppo') {
        this.fileDetails.letter.letterContent = Res.data;
        console.log(this.fileDetails.letter);
      } 
    });
  }
  showCreateNominee(status) {
    this.createNomineeModel = status;
    this.nomineeTitle = null;
  }
  createNominee() {
    let body = {
      comitteId: this.fileDetails.committeeId,
      correspondenceId: null,
      title: this.nomineeTitle,
    };
    this.committee.CreateNomineeRequest(body).subscribe((Response) => {
      console.log(Response);
      this.fileDetails = null;
      this.notification.success('Success', 'Success');
      this.getFileByFileId(this.fileId);
      this.showCreateNominee(false);
    });
  }
  setTabfilters() {
    this.tabParams = {
      CurrentTab: false,
      showIndex: 0,
    };
  }
  showCurrentTab(key, canEdit) {
    this.tabParams['showIndex'] = 1;
    this.tabParams['showVersionEdit'] = canEdit;
    this.tabParams['CurrentTab'] = key;
  }
  selectCreateNominee(){
    this.router.navigate(['business-dashboard/committee/subject-nominee/','create',this.fileDetails.committeeId]);

  }
  getSupportDocStatus(supportDoc) {
    const status = supportDoc.map(x => x.status);
    if (status.includes('SUBMITTED')) {
      return 'SUBMITTED';
    } else {
      return 'RESPONDED';
    }
  }
  getmeetingNoticeStatus(meetingNotice){
    const status = meetingNotice.map(x => x.status);
    if (status.includes('SUBMITTED')) {
      return 'SUBMITTED';
    } else {
      return 'APPROVED';
    }
  }

  selectedMeeting(meeting) {
    this.setTabfilters();
    this.selectedMeetingId = meeting.meetingDetails.meetingId;
    this.selectedMeetingDetails = meeting;
  }
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
  getFile(e) {
    this.getFileByFileId(e);
  }
  editFile() {
    this.isEditPrio = true;
  }
  updateFile() {
    const fileResponse = this.fileDetails.fileResponse;
    const body = {
      assemblyId: fileResponse.assemblyId,
      assigedTo: fileResponse.assigedTo,
      createdDate: fileResponse.createdDate,
      currentNumber: fileResponse.currentNumber,
      description: fileResponse.description,
      fileId: fileResponse.fileId,
      fileNumber: fileResponse.fileNumber,
      priority: this.priority,
      sectionId: fileResponse.sectionId,
      sessionId: fileResponse.sessionId,
      status: fileResponse.status,
      subject: fileResponse.subject,
      subType: fileResponse.subtype,
      type: fileResponse.type,
      userId: fileResponse.userId,
      // workflowEngineCode: string: '',
      workflowId: fileResponse.workflowId,
    };
    this.isEditPrio = false;
    this.file.updateFile(this.fileId, body)
      .subscribe((Res) => {
        this.getFileByFileId(this.fileId);
      });
  }
  onCancel() {}
  _canshowCommiteeButtons() {
    if (this.fileDetails && this.currentPoolUser && this.allWorkflowUsers.length > 0) {
      return true;
    }
    return false;
  }

  checkForwardedDate() {
    const forwardedDateArray = [];
    for (const meet of this.fileDetails.meetings) {
      if (meet.meetingDetails.status === 'DETAIL_SUBMITTED') {
        meet.meetingDetails.subAgenda.forEach(subagenda => {
          for (const subagendabusiness of subagenda.subAgendaBusiness) {
            if (differenceInCalendarDays(parseISO(meet.meetingDetails.date),
            parseISO(subagendabusiness.forwardedBusiness.forwardedDate)) <= 1) {
              this.showWarning = true;
            }
          }
        });
      }
    }
  }
  updateConsent(meeting) {
    this.setTabfilters();
    this.selectedMeetingDetails.meetingDetails=meeting;
  }

  showMinutePopup() {
    this.minutePop = true;
  }

  closeMinutePopup() {
    this.minutePop = false;
  }
  createPmbrCommittee(){
    this.router.navigate(['business-dashboard/committee/pmbr-committee-members/','create',this.fileId]);
  }

  viewSubFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }
}
