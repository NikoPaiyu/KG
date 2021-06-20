import { Component, OnInit, Input, Inject, Output, EventEmitter, OnChanges } from '@angular/core';
import { FileServiceService } from '../../shared/services/file-service.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { Location } from '@angular/common';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObituaryService } from '../../shared/services/obituary.service';

@Component({
  selector: 'lib-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit, OnChanges {
  skip = false;
  today: any = new Date();
  @Input() allWorkflowUsers;
  @Input() notesInfo;
  @Input() currentPoolUser;
  @Input() assignee;
  @Input() fileResponse;
  @Input() fileId;
  notes: any = [];
  showForward = true;
  latestNote: any;
  currentUserActionRow: any;
  forwardAssignee: any;
  forwardAssigneeGroup: any;
  selectedRole: any;
  showSkipModal = false;
  forwardReturnButton = 'Forward';
  reason = '';
  ratificationApprove = false;
  pullButton = false;
  fileClose = false;
  canApprove = false;
  user;
  ratification = false;
  fromGroup: any;
  showPullModal = false;
  canPull = false;
  currentPool: any = null;
  pullRemark = null;
  stepStatusDetail: any = [];
  workflowUsers: any = [];
  pullGroup: any;
  currentActionName = null;
  fromPool: any;
  logDetails: any = [];
  sectionRole: any;
  ratificationStatus: any;
  speakerNoteObj = {};
  addSpeakerNoteForm: FormGroup;
  @Output() fileApproved = new EventEmitter<string>();
  @Output() fileForwarded = new EventEmitter<string>();
  @Output() fileClosureInitiated = new EventEmitter<string>();
  @Output() GovLOBActivity = new EventEmitter<string>();
  subType: any;
  constructor(
    private file: FileServiceService,
    @Inject('authService') public auth,
    private router: Router,
    private notification: NzNotificationService,
    public commonService: TablescommonService,
    private obituaryService : ObituaryService,
    private fb: FormBuilder,
  ) {
    this.commonService.setTablePermissions(auth.getCurrentUser().rbsPermissions);
    this.user = auth.getCurrentUser();
    this.fromGroup = auth.getCurrentUser().authorities[0];
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.subType = this.notesInfo.subtype
    this.getRbsPermissionsinList();
    this.setShowForward();
    if(this.subType === "PRO_TEM_SPEAKER" || this.subType === 'SPEAKER_ELECTION' || this.subType === 'DEPUTY_SPEAKER_ELECTION' || this.subType === 'PANEL_OF_CHAIRMAN') {
      this.getFileByElectionFileId();
    } 
    else if(this.subType === "TABLE_RESUME" || this.subType === 'TABLE_BULLETIN_ONE') {
      this.getFileByResumeFileId();
      }
    else {
      this.getFileByFileId();
    }
    this.formvalidation();
  }
  setShowForward(){
      if ((this.fileResponse.fileResponse.subtype === 'TABLE_OBITUARY_LETTER_TO_FAMILY' &&
        this.checkFamilyLetter())
  ) {
    this.showForward = false;
  } 
    }
  checkFamilyLetter(){
    const status = this.fileResponse.obituary.obituary.gists.map(x => x.letterStatus);
    if (status.includes('PENDING')) {
      return true;
    } else {
      return false;
    }
  }
  checkMeetingNoticeandLetterCorrespondence() {
    let noCorrespondence = false;
    if (this.fileResponse.meetings) {
      this.fileResponse.meetings.forEach(meet => {
        if (meet.meetingNotice) {
          meet.meetingNotice.forEach(notice => {
            if (notice.correspondenceId == null) {
              noCorrespondence = true;
            }
          });
        }
        if (meet.meetingLetter && meet.meetingLetter.correspondenceId == null) {
          noCorrespondence = true;
        }
        if (meet.supportingDocumentLetter) {
          meet.supportingDocumentLetter.forEach(supportDoc => {
            if (supportDoc.correspondenceId == null) {
              noCorrespondence = true;
            }
          });
        }
      });
    }
    return noCorrespondence;
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('PULL_FILE', 'READ')) {
      this.pullButton = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE_RATIFICATION', 'APPROVE')) {
      this.ratificationApprove = true;
    }
  }
  getFileByElectionFileId() {
    this.file.getFileByElectionFileId(this.fileId, this.auth.getCurrentUser().userId).subscribe((Response) => {
      if (Response) {
        this.fileResponse = Response;
        this.notes = this.fileResponse.fileResponse;
        this.latestNote = this.notes[this.notes.length - 1];
        if (this.fileResponse.fileResponse.status !== 'APPROVED') {
          this.canApprove = true;
        }
        this.getWorkflowStatus();
        if (this.fileResponse.fileResponse.status !== 'APPROVED') {
          this.getWorkFLowUsers();
        }
        if (this.fileResponse.fileResponse.ratification) {
          if (this.fileResponse.fileResponse.ratification.length !== 0) {
            const temp = this.fileResponse.fileResponse.ratification.filter(
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
  getFileByFileId() {
    this.file.getFileById(this.fileId, this.auth.getCurrentUser().userId).subscribe((Response) => {
      if (Response) {
        this.fileResponse = Response;
        this.notes = this.fileResponse.fileResponse;
        this.latestNote = this.notes[this.notes.length - 1];
        if (this.fileResponse.fileResponse.status !== 'APPROVED') {
          this.canApprove = true;
        }
        this.getWorkflowStatus();
        if (this.fileResponse.fileResponse.status !== 'APPROVED') {
          this.getWorkFLowUsers();
        }
        if (this.fileResponse.fileResponse.ratification) {
          if (this.fileResponse.fileResponse.ratification.length !== 0) {
            const temp = this.fileResponse.fileResponse.ratification.filter(
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
    this.file.checkWorkFlowStatus(this.fileResponse.fileResponse.workflowId)
      .subscribe((Res) => {
        if (Res) {
          this.stepStatusDetail = Res;
          const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
          // this.currentPoolUser = current.owner;
          this.getCurrentPool();
          if (this.fileResponse.fileResponse.status !== 'APPROVED') {
            this.getWorkFLowUsers();
          }
        }
      });
  }
  getWorkFLowUsers() {
    // this.file.getWorkflowActionUsers(
    //     this.fileResponse.fileResponse.workflowId,
    //     this.fileResponse.fileResponse.fileId
    //   )
    //   .subscribe((Res) => {
    //     this.workflowUsers = Res;
    //     for (let user of this.workflowUsers) {
    //       if (this.currentPoolUser === user.code) {
    //         this.currentUserActionRow = user.actionRow;
    //         break;
    //       }
    //     }
    //     this.pullOrNot();
    //   });
    this.workflowUsers = this.allWorkflowUsers.filter(user => user.actionRow <=
      (this.allWorkflowUsers.find(u => u.userId === this.user.userId).actionRow + 2));
    for (let user of this.workflowUsers) {
      if (this.currentPoolUser === user.code) {
        this.currentUserActionRow = user.actionRow;
        break;
      }
    }
    this.pullOrNot();
  }
  pullOrNot() {
    this.getPullGroup();
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current) {
      const fromRow = this.workflowUsers.find(
        (user) => user.code === current.owner
      );
      const groupRow = this.workflowUsers.find(
        (user) => user.code === this.currentPool
      );
      if (fromRow && groupRow && groupRow.actionRow > fromRow.actionRow) {
        this.canPull = true;
      } else {
        this.canPull = false;
      }
    }
  }
  returnFile() { }
  submitFile() { }
  goBack() {
    window.history.back();
  }
  cancel() { }
  forwardOrReturn() {
    const arrForwardUerInfo = this.selectedRole.split('-');
    const forwardActionRow = arrForwardUerInfo[1];
    this.forwardAssignee = arrForwardUerInfo[0];
    this.forwardAssigneeGroup = arrForwardUerInfo[2];
    for (var user of this.workflowUsers) {
      if (this.currentPoolUser === user.actionId) {
        this.currentUserActionRow = user.actionRow;
        break;
      }
    }
    if (
      this.currentUserActionRow === null ||
      forwardActionRow >= this.currentUserActionRow
    ) {
      this.forwardReturnButton = 'Forward';
    } else {
      this.forwardReturnButton = 'Return';
    }
    if (forwardActionRow > this.currentUserActionRow + 1) {
      this.skip = true;
    } else {
      this.skip = false;
    }
  }

  forwardFile(fileId) {
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
    if (this.latestNote && this.latestNote.user.userId === this.auth.getCurrentUser().userId) {
      if (this.skip) {
        this.showSkipModal = true;
      } else {
        const body = {
          processInstanceId: this.notesInfo.workflowId,
          action: 'FORWARD',
          groupId: this.forwardAssigneeGroup,
          fromGroup: this.auth.getCurrentUser().authorities[0],
          assignee: this.forwardAssignee,
          remark: this.reason,
          skipped: this.showSkipModal,
        };
        this.file.forwardFile(body, fileId).subscribe((Res) => {
          if(this.fileResponse.fileResponse.activeSubTypes &&
            this.fileResponse.fileResponse.activeSubTypes.includes("TABLE_OBITUARY")){
            this.activateObituaryVersion();
          }
          this.notification.create(
            'success',
            'Success',
            'File ' + this.forwardReturnButton + 'ed Successfully!'
          );
          if (this.subType === "PRO_TEM_SPEAKER" || this.subType === 'SPEAKER_ELECTION' || this.subType === 'DEPUTY_SPEAKER_ELECTION' || this.subType === 'PANEL_OF_CHAIRMAN') {
            this.router.navigate(['business-dashboard/tables/election-files']);
          } else {
            this.router.navigate(['business-dashboard/tables/files']);
          }
        });
      }
    } else {
      this.notification.create('warning', 'Warning', 'Please Add Note!');
    }
  }
  handleCancel() {
    this.showSkipModal = false;
    this.reason = '';
  }
  approveFile() {
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
    if (this.subType === 'SPEAKER_ELECTION' && this.fileResponse.speakerElections 
    && this.fileResponse.speakerElections.length > 0 && this.fileResponse.speakerElections[0].status === 'SUBMITTED' &&
    this.fileResponse.speakerElections[0].cabinateNoteStatus === 'NOT_ADDED') {
      this.notification.create('warning', 'Warning', 'You Cannot Approve Without Cabinet Note!');
    } else if (this.subType === 'DEPUTY_SPEAKER_ELECTION' && this.fileResponse.deputySpeakerElections 
    && this.fileResponse.deputySpeakerElections.length > 0 && this.fileResponse.deputySpeakerElections[0].status === 'SUBMITTED' &&
    this.fileResponse.deputySpeakerElections[0].speakerOrderStatus === 'NOT_ADDED') {
      this.notification.create('warning', 'Warning', 'You Cannot Approve Without Speaker Order!');
    } else if (this.subType === 'PRO_TEM_SPEAKER' && this.fileResponse.proTemSpeaker 
    && this.fileResponse.proTemSpeaker.length > 0 && this.fileResponse.proTemSpeaker[0].status === 'SUBMITTED' &&
    this.fileResponse.proTemSpeaker[0].cabinateNoteStatus === 'NOT_ADDED') {
      this.notification.create('warning', 'Warning', 'You Cannot Approve Without Cabinet Note!');
    } else {
      if (this.latestNote && this.latestNote.user.userId === this.auth.getCurrentUser().userId) {
        this.markAsApproved();
      } else {
        this.addNote();
      }
    }
  }
  ratificationApproveFile(fileId) {
    this.ratification = true;
    if (this.subType === 'SPEAKER_ELECTION' && this.fileResponse.speakerElections 
    && this.fileResponse.speakerElections.length > 0 && this.fileResponse.speakerElections[0].status === 'SUBMITTED' &&
    this.fileResponse.speakerElections[0].cabinateNoteStatus === 'NOT_ADDED') {
      this.notification.create('warning', 'Warning', 'You Cannot Approve Without Cabinet Note!');
    } else if (this.subType === 'DEPUTY_SPEAKER_ELECTION' && this.fileResponse.deputySpeakerElections 
    && this.fileResponse.deputySpeakerElections.length > 0 && this.fileResponse.deputySpeakerElections[0].status === 'SUBMITTED' &&
    this.fileResponse.deputySpeakerElections[0].speakerOrderStatus === 'NOT_ADDED') {
      this.notification.create('warning', 'Warning', 'You Cannot Approve Without Speaker Order!');
    } else if (this.subType === 'PRO_TEM_SPEAKER' && this.fileResponse.proTemSpeaker 
    && this.fileResponse.proTemSpeaker.length > 0 && this.fileResponse.proTemSpeaker[0].status === 'SUBMITTED' &&
    this.fileResponse.proTemSpeaker[0].cabinateNoteStatus === 'NOT_ADDED') {
      this.notification.create('warning', 'Warning', 'You Cannot Approve Without Cabinet Note!');
    } else {
    this.approveFile();
    }
  }
  markAsApproved() {
    if (!this.ratification) {
      const body = {
        fileId: this.notesInfo.fileId,
        userId: this.auth.getCurrentUser().userId,
        approvedById: this.auth.getCurrentUser().userId,
        fromGroup: this.auth.getCurrentUser().authorities[0],
      };
      if(this.subType === "PRO_TEM_SPEAKER" || this.subType === 'SPEAKER_ELECTION' || this.subType === 'DEPUTY_SPEAKER_ELECTION' || this.subType === 'PANEL_OF_CHAIRMAN') {
          this.file.approveElectionFile(body).subscribe((Res) => {
            this.notification.create('success', 'Success', 'File Approved Successfully!');
            this.router.navigate(['business-dashboard/tables/election-files']);
          });
      } else if(this.subType === "TABLE_RESUME" || this.subType === 'TABLE_BULLETIN_ONE') {
        this.file.approveResumeAndBulletinPart1(body).subscribe((Res) => {
          this.notification.create('success', 'Success', 'File Approved Successfully!');
          if(this.subType === "TABLE_RESUME") {
          this.router.navigate(['business-dashboard/tables/resume-files']);
          }else{
            this.router.navigate(['business-dashboard/tables/bulletinpart1-files']);
          }
        });
        
        }
      else {
        this.file.approveFile(body).subscribe((Res) => {
          if(this.fileResponse.fileResponse.activeSubTypes &&
            this.fileResponse.fileResponse.activeSubTypes.includes("TABLE_OBITUARY")){
            this.activateObituaryVersion();
          }
          this.notification.create('success', 'Success', 'File Approved Successfully!');
          this.router.navigate(['business-dashboard/tables/files']);
        });
      }
    } else {
      const body = {
        fileId: this.fileId,
        userId: this.user.userId,
        ratification: this.ratification,
        fromGroup: this.fromGroup,
      };
      if(this.subType === "PRO_TEM_SPEAKER" || this.subType === 'SPEAKER_ELECTION' || this.subType === 'DEPUTY_SPEAKER_ELECTION' || this.subType === 'PANEL_OF_CHAIRMAN') {
        this.file.approveElectionFile(body).subscribe((Res) => {
          this.selectedRole = null;
          this.notification.create('success', 'Success', 'File approved Successfully!'
          );
          setTimeout(() => { this.router.navigate(['business-dashboard/tables/election-files']); }, 1500);
        });
      } else {
        this.file.approveFile(body).subscribe((Res) => {
          this.selectedRole = null;
          this.notification.create('success', 'Success', 'File approved Successfully!'
          );
          setTimeout(() => { this.router.navigate(['business-dashboard/tables/files']); }, 1500);
        });
      }
    }
  }

  addNote() {
    const reqBody = {
      noteId: null,
      fileId: this.notesInfo.fileId,
      note: 'File Approved.',
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: false,
      userId: this.auth.getCurrentUser().userId,
    };
    this.file.createNote(reqBody).subscribe((data: any) => {
      this.notesInfo.notes = data;
      this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
      this.markAsApproved();
    });
  }
  showPullpopup() {
    this.showPullModal = true;
  }
  pullFile() {
    this.getPullGroup();
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current) {
      const fromRow = this.workflowUsers.find((user) => user.code === current.owner);
      const groupRow = this.workflowUsers.find((user) => user.code === this.currentPool);
      const body = {
        processInstanceId: this.fileResponse.fileResponse.workflowId,
        action: 'FORWARD',
        groupId: this.currentPool,
        fromGroup: this.pullGroup,
        assignee: this.user.userId,
        remark: this.pullRemark
      };
      if (fromRow && groupRow && (groupRow.actionRow > fromRow.actionRow)) {
        this.file.pullFile(body, this.fileId).subscribe((Res) => {
          this.fileForwarded.emit(this.fileId);
          this.showPullModal = false;
          this.notification.create('success', 'Success', 'File pulled Successfully!'
          );
          this.getWorkflowStatus();
          this.getAllLogs(this.fileId);
          if(this.subType === "PRO_TEM_SPEAKER" || this.subType === 'SPEAKER_ELECTION' || this.subType === 'DEPUTY_SPEAKER_ELECTION' || this.subType === 'PANEL_OF_CHAIRMAN') {
            this.getFileByElectionFileId();
          } 
          else if(this.subType === "TABLE_RESUME" || this.subType === 'TABLE_BULLETIN_ONE') {
            this.getFileByResumeFileId();
            }
          else {
            this.getFileByFileId();
          }
        });
      } else {
        this.notification.create('warning', 'Warning', 'You cannot pull from higher authority!');
      }
    }
  }
  cancelPull() {
    this.showPullModal = false;
  }
  getAllLogs(id) {
    this.file.getAllFileLogs(id).subscribe(Response => {
      if (Response) {
        this.logDetails = Response;
      }
    });
  }
  getCurrentPool() {
    this.workflowUsers.forEach(element => {
      if (element.userId === this.user.userId) {
        this.currentPool = element.actionId;
        this.pullGroup = element.name;
        this.currentActionName = element.actionName;
      }
    });
  }
  getPullGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current) {
      this.workflowUsers.forEach(element => {
        if (element.actionId === current.owner) {
          this.fromPool = element.name;
        }
      });
    }
  }
  getFromGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    this.workflowUsers.forEach(element => {
      if (element.userId === this.user.userId) {
        this.fromGroup = element.name;
        this.sectionRole = element.actionId;
      }
    });
  }
  fileClosure() {
    this.file.fileClosure(this.fileId, this.user.userId).subscribe(Res => {
      this.notification.create('success', 'Success', 'File closure initiated successfully!');
      this.fileClosureInitiated.emit(this.fileId);
      this.getAllLogs(this.fileId);
    });
  }
  approveClosure() {
    if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
      this.closeFile();
    } else {
      const body = {
        fileId: this.fileId,
        note: 'File closed',
        referenceBusiness: [0],
        referenceRules: [0],
        temporary: false,
        userId: this.user.userId,
      };
      this.file.createNote(body).subscribe((Res) => {
        this.notes = Res;
        this.latestNote = this.notes[this.notes.length - 1];
        this.getAllLogs(this.fileId);
        this.closeFile();
      });
    }
  }
  closeFile() {
    const body = {
      fromGroup: this.fromGroup,
      approvedById: this.user.userId
    };
    this.file.approveClosure(body, this.fileId).subscribe((Res) => {
      if(this.subType === "PRO_TEM_SPEAKER" || this.subType === 'SPEAKER_ELECTION' || this.subType === 'DEPUTY_SPEAKER_ELECTION' || this.subType === 'PANEL_OF_CHAIRMAN') {
        this.getFileByElectionFileId();
      } 
      else if(this.subType === "TABLE_RESUME" || this.subType === 'TABLE_BULLETIN_ONE') {
        this.getFileByResumeFileId();
        }
      else {
        this.getFileByFileId();
      }
      this.notification.create(
        'success',
        'Success',
        'File Closed Successfully!'
      );
    });
  }
  canApproveFile() {
    if (this.commonService.doIHaveAnAccess('FILE', 'APPROVE')) {
      return true;
    }
    else if (this.fileResponse.fileResponse.activeSubTypes) {
      if (this.commonService.doIHaveAnAccess('COVERING_LETTER', 'APPROVE')) {
        if (this.fileResponse.fileResponse.activeSubTypes.includes("TABLE_CORRESPONDANCE_COVERING_LETTER")) {
          return true;
        }
      }
      if (this.commonService.doIHaveAnAccess('LETTER_WITH_COVERING_LETTER', 'APPROVE')) {
        if (this.fileResponse.fileResponse.activeSubTypes.includes("TABLE_LETTER_WITH_COVERING_LETTER")) {
          return true;
        }
      }
      if (this.commonService.doIHaveAnAccess('LETTER_LAW_DEPT', 'APPROVE')) {
        if (this.fileResponse.fileResponse.activeSubTypes.includes("TABLE_CORRESPONDANCE_LAW_DEPT")) {
          return true;
        }
      }
    }
    return false;
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }

  formvalidation() {
    this.addSpeakerNoteForm = this.fb.group({
      motAmendmentDate: [null, [Validators.required]],
      motAmendmentLastDate: [null, [Validators.required]]
    });
  }
  addtospeakernote() {
    this.addSpeakerNoteForm.value.type = "ADD_SPEAKERNOTE"
    this.GovLOBActivity.emit(this.addSpeakerNoteForm.value);
  }
  setSpeakerNoteToLOB() {
    this.addSpeakerNoteForm.value.type = "SET_TO_LOB"
    this.GovLOBActivity.emit(this.addSpeakerNoteForm.value);
  }
  setTAToLOB() {
    this.addSpeakerNoteForm.value.type = "SET_TA_TO_LOB"
    this.GovLOBActivity.emit(this.addSpeakerNoteForm.value);
  }
  canShowFileClosure() {
    if(this.fileResponse && this.fileResponse.status === 'APPROVED') {
        return true;
    }
    return false;
  }
  activateObituaryVersion(){
   this.obituaryService.finalizeVersion(this.fileId).subscribe((Res) => {
   });
  }

  getFileByResumeFileId() {
    this.file.getFileByResumeFileId(this.fileId, this.auth.getCurrentUser().userId).subscribe((Response) => {
      if (Response) {
        this.fileResponse = Response;
        this.notes = this.fileResponse.fileResponse;
        this.latestNote = this.notes[this.notes.length - 1];
        if (this.fileResponse.fileResponse.status !== 'APPROVED') {
          this.canApprove = true;
        }
        this.getWorkflowStatus();
        if (this.fileResponse.fileResponse.status !== 'APPROVED') {
          this.getWorkFLowUsers();
        }
        if (this.fileResponse.fileResponse.ratification) {
          if (this.fileResponse.fileResponse.ratification.length !== 0) {
            const temp = this.fileResponse.fileResponse.ratification.filter(
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
  
}
