import { Component, OnInit, Input, Inject, Output, EventEmitter, OnChanges } from '@angular/core';
import { FileServiceService } from '../../shared/services/file-service.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';
import { Location } from '@angular/common';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetSpeechService } from '../../shared/services/budget-speech.service';

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
  @Input() isFileForAction;
  @Input() stepStatusDetail;
  notes: any = [];
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
  workflowUsers: any = [];
  pullGroup: any;
  currentActionName = null;
  fromPool: any;
  logDetails: any = [];
  sectionRole: any;
  ratificationStatus: any;
  approveMsg = null;
  showApprove = true;
  @Output() fileApproved = new EventEmitter<string>();
  @Output() fileForwarded = new EventEmitter<string>();
  @Output() fileClosureInitiated = new EventEmitter<string>();
  constructor(
    private file: FileServiceService,
    @Inject('authService') public auth,
    private router: Router,
    private notify: NzNotificationService,
    public commonService: BudgetCommonService,
    private fb: FormBuilder,
    private budgetSpeech: BudgetSpeechService
  ) {
    this.commonService.setBudgetPermissions(auth.getCurrentUser().rbsPermissions);
    this.user = auth.getCurrentUser();
    this.fromGroup = auth.getCurrentUser().authorities[0];
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.getRbsPermissionsinList();
    this.getFileByFileId();
    this.setApproveBtnForDDSVersion()

  }
  isPendingFiles() {
    // if (this.router.url.includes('budgets/pending/file-view')) {
    //   return true
    // }
    return true;
  }
  setApproveBtnForDDSVersion() {
    if (this.commonService.doIHaveAnAccess('ACCEPT_DDS_VERSION', 'APPROVE') &&
      this.assignee == this.auth.getCurrentUser().userId) {
      if (this.fileResponse.demandVersionDTO !== null) {
        if (this.fileResponse.fileResponse.activeSubTypes &&
          this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_DEMAND_VERSION") &&
          this.fileResponse.demandVersionDTO !== null &&
          this.fileResponse.demandVersionDTO[0].selectedNature == null
        ) {
          this.showApprove = false;
          this.approveMsg = "Please Select Demand Draft Version to approve file";
        }
      }
      if (this.fileResponse.demandVersionForSdgEgDTO !== null) {
        if (this.fileResponse.fileResponse.activeSubTypes &&
          this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_DEMAND_VERSION_FOR_SDG_EG") &&
          this.fileResponse.demandVersionForSdgEgDTO !== null &&
          this.fileResponse.demandVersionForSdgEgDTO[0].selectedNature == null

        ) {
          this.showApprove = false;
          this.approveMsg = "Please Select Demand Draft Version to approve file";
        }
      }
    }
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('PULL_FILE', 'READ')) {
      this.pullButton = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE_RATIFICATION', 'APPROVE')) {
      this.ratificationApprove = true;
    }
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
    // this.file.checkWorkFlowStatus(this.fileResponse.fileResponse.workflowId)
    //   .subscribe((Res) => {
    //     if (Res) {
    //       this.stepStatusDetail = Res;
    //       const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    // this.currentPoolUser = current.owner;
    this.getCurrentPool();
    if (this.fileResponse.fileResponse.status !== 'APPROVED') {
      this.getWorkFLowUsers();
    }
    //   }
    // });
  }
  getWorkFLowUsers() {
    this.workflowUsers = this.allWorkflowUsers
    .filter(user => user.actionRow <=
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
          this.notify.create(
            'success',
            'Success',
            'File ' + this.forwardReturnButton + 'ed Successfully!'
          );
          this.router.navigate(['business-dashboard/budgets/files/bd-files']);
        });
      }
    } else {
      this.notify.create('warning', 'Warning', 'Please Add Note!');
    }
  }
  handleCancel() {
    this.showSkipModal = false;
    this.reason = '';
  }
  approveFile() {
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
    if (this.latestNote && this.latestNote.user.userId === this.auth.getCurrentUser().userId) {
      this.markAsApproved();
    } else {
      this.addNote();
    }
  }
  ratificationApproveFile(fileId) {
    this.ratification = true;
    this.approveFile();
  }
  markAsApproved() {
    if (!this.ratification) {
      const body = {
        fileId: this.notesInfo.fileId,
        userId: this.auth.getCurrentUser().userId,
        approvedById: this.auth.getCurrentUser().userId,
        fromGroup: this.auth.getCurrentUser().authorities[0],
      };
      this.file.approveFile(body).subscribe((Res) => {
        this.notify.create('success', 'Success', 'File Approved Successfully!');
        this.goBack();
      });
    } else {
      const body = {
        fileId: this.fileId,
        userId: this.user.userId,
        ratification: this.ratification,
        fromGroup: this.fromGroup,
      };
      this.file.approveFile(body).subscribe((Res) => {
        this.selectedRole = null;
        this.notify.create('success', 'Success', 'File approved Successfully!'
        );
        setTimeout(() => { this.goBack(); }, 1500);
      });
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
          this.notify.create('success', 'Success', 'File pulled Successfully!'
          );
          this.getWorkflowStatus();
          this.getAllLogs(this.fileId);
          this.getFileByFileId();
        });
      } else {
        this.notify.create('warning', 'Warning', 'You cannot pull from higher authority!');
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
      this.notify.create('success', 'Success', 'File closure initiated successfully!');
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
      this.getFileByFileId();
      this.notify.create(
        'success',
        'Success',
        'File Closed Successfully!'
      );
    });
  }
  canApproveFile() {
    let canIApprove = false;
    if (this.commonService.doIHaveAnAccess('FILE', 'APPROVE')) {
      canIApprove = true;

    }
    if (this.commonService.doIHaveAnAccess('APPROVE_BUDGET_LETTER', 'APPROVE')) {  //budget letter approval can be done from us and above
      if (this.fileResponse.fileResponse.activeSubTypes &&
        this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_SDG_EG_REQUEST_LETTER") &&
        (this.user.userId).toString() === this.assignee) {
        this.ratificationApprove = false;
        canIApprove = true;
      }
    }
    return canIApprove;
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }
  canShowFileClosure() {
    if (this.fileResponse && this.fileResponse.status === 'APPROVED') {
      return true;
    }
    return false;
  }
  setTAToLOB() {
    if (this.fileResponse['budgetTimeAllocation'] && this.fileResponse['budgetTimeAllocation'].length > 0) {
      let ids = this.fileResponse['budgetTimeAllocation'].map(value => value.id);
      this.budgetSpeech.setTAToLOB({ fileId: this.fileId, masterIds: ids }).subscribe((Res) => {
        this.notify.success('Success', 'Added To LOB');
        this.router.navigate(['business-dashboard/budgets/files/bd-files']);
      });
    }
  }
  claimFile() {
    this.commonService.claimFile(this.fileResponse.fileResponse.workflowId, this.auth.getCurrentUser().userId).subscribe((Res) => {
      this.notify.create('success', 'Success', 'File Claimed Successfully!');
      this.fileForwarded.emit(this.fileId);
    });
  }
  canCreateGreenbook() {
    if (this.assignee) {
      if (this.fileResponse.fileResponse.activeSubTypes &&
        (this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_SDFG_LETTER_RESPONSE") || 
        this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_VOA_LETTER_RESPONSE")) &&
        !this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_GREEN_BOOK")) {
        return true;
      }
    }
    return false;
  }
  validateGreenBook() {
    if (this.fileResponse.fileResponse.activeSubTypes) {
      if (this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_SDFG_LETTER_RESPONSE") ||  
      this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_VOA_LETTER_RESPONSE")) {
        if (this.fileResponse.fileResponse.activeSubTypes.includes("BUDGET_GREEN_BOOK")) {
          return true
        }
        return false;
      } else {
        return true;
      }
    }
  }
  navigatetogreenbook() {
    let sdfgId = '';
    if (this.fileResponse.sdfgLetterResponse === null && this.fileResponse.voaLetterResponse === null) {
      this.notify.create('warning', 'Warning', 'No SDFG Found');
      return;
    }
    if(this.fileResponse.sdfgLetterResponse) {
      sdfgId = this.fileResponse.sdfgLetterResponse[0].sdfgId;
    }
    if(this.fileResponse.voaLetterResponse) {
      sdfgId = this.fileResponse.voaLetterResponse[0].sdfgId;
    }
    this.router.navigate(['business-dashboard/budgets/sdfg/grnbk', sdfgId]);
  }
}
