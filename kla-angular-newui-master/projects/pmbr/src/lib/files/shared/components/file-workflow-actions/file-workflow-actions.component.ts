import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FileServiceService } from '../../../../shared/services/file-service.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { Location } from '@angular/common';
import { PmbrCommonService } from 'projects/pmbr/src/lib/shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-file-workflow-actions',
  templateUrl: './file-workflow-actions.component.html',
  styleUrls: ['./file-workflow-actions.component.css']
})
export class FileWorkflowActionsComponent implements OnInit {
  skip = false;
  @Input() allWorkflowUsers;
  @Input() notesInfo;
  @Input() currentPoolUser;
  @Input() assignee;
  @Input() fileResponse;
  @Input() stepStatusDetail;
  @Input() fileId;
  latestNote: any;
  id;
  fromGroup: any;
  actionRow: any;
  currentUserActionRow: any;
  forwardAssignee: any;
  forwardAssigneeGroup: any;
  selectedRole: any;
  showSkipModal = false;
  workflowUsers: any = [];
  // allWorkflowUsers: any = [];
  forwardReturnButton = 'Forward';
  userId;
  reason = '';
  popConfirm = false;
  permissions = {
    approve: false,
    correspondence: false,
    cbcapprove: false,
    fileClosure: false,
    createCorrespondence:false
  };
  forward = false;
  owner = '';
  hideForward = true;
  showForward = true;
  user;
  canPull = false;
  pullGroup: any;
  showPullModal = false;
  pullRemark = null;
  notes: any = [];
  logDetails: any = [];
  currentPool: any = null;
  currentActionName = null;
  fromPool: any;
  pullButton = false;
  ratificationApprove = false;
  canApprove = false;
  ratification = false;
  sectionRole: any;
  reject;
  send;
  ratificationStatus: any;
  @Output() fileApproved = new EventEmitter<string>();
  @Output() fileForwarded = new EventEmitter<string>();
  @Output() fileClosureInitiated = new EventEmitter<string>();
  @Output() fileRejected = new EventEmitter<string>();
  rejectionLetter: any;
  
  constructor(
    private file: FileServiceService,
    @Inject('authService') private AuthService,
    // private authService:AuthService,
    private router: Router,
    private notification: NzNotificationService,
    private commonService: PmbrCommonService,
    private _location: Location
  ) {
    // this.userId = AuthService.getCurrentUser().userId;
    this.owner = AuthService.getCurrentUser().authorities[0];
    this.user = AuthService.getCurrentUser();
    // console.log(this.user)
    if(this.user.authorities.includes('speaker')){
      this.reject = true;
    }
    if(this.user.authorities[0] == 'assistant'){
      this.send = true;
    }
    this.userId = this.user.userId;
    this.commonService.setPermissions(this.user.rbsPermissions);
    this.fromGroup = AuthService.getCurrentUser().authorities[0];
  }

  ngOnInit() {
    if(this.fileResponse.letter) {
      this.rejectionLetter = this.fileResponse.letter.find(element => element.businessSubType === 'PRIVATE_MEMBER_BILL_REJECTION_LETTER')
    }
    this.getRbsPermissionsinList();
    // if (this.fileResponse.fileResponse.subtype === 'PRIORITY_LIST_REQUEST' &&
    //   this.fileResponse.priorityRequest.correspondenceId === null
    //   && this.fileResponse.priorityRequest.cosId) {
    //   this.showForward = false;
    // }
    if(this.fileResponse.bill) {
      if(this.fileResponse.bill.status === 'REJECTED') {
        this.fileRejected.emit(this.fileId);
        if( this.fileResponse.letter === null){
          this.showForward = false;
        }else {
          this.showForward = true;
        }
      }else if(this.fileResponse.pmbrScheduleLottingResultDTO) {
        if(this.fileResponse.pmbrScheduleLottingResultDTO.status === 'APPROVED') {
          this.showForward = false;
        }
      }
    }
    this.getFileByFileId();
    
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('FILE', 'APPROVE')) {
      this.permissions.approve = true;
    }
    if (this.commonService.doIHaveAnAccess('ATTACH_CORRESPONDENCE', 'CREATE')) {
      this.permissions.correspondence = true;
    }
    if (this.commonService.doIHaveAnAccess('PULL_BUTTON', 'READ')) {
      this.pullButton = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE_RATIFICATION', 'APPROVE')) {
      this.ratificationApprove = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE_CLOSURE', 'READ')) {
      this.permissions.fileClosure = true;
    }
    if(this.commonService.doIHaveAnAccess('CORRESPONDENCE', 'CREATE')) {
      this.permissions.createCorrespondence = true;
    }
  }
  returnFile() {

  }
  submitFile() {

  }

  goBack() {
    window.history.back();
    //this._location.back();
  }

  // approveFile() { }

  cancel() { }

  forwardOrReturn() {
    let arrForwardUerInfo = this.selectedRole.split('-');
    let forwardActionRow = arrForwardUerInfo[1];
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
    // const current = this.stepStatus[this.stepStatus.length - 1];
    this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
    if (this.latestNote && this.latestNote.user.userId === this.userId) {
      this.popConfirm = true;
      // const body = {
      //   fromGroup: this.fromGroup,
      //   groupId: group.code,
      // };
      if (this.skip) {
        this.showSkipModal = true;
      } else {
        const body = {
          processInstanceId: this.notesInfo.workflowId,
          action: 'FORWARD',
          groupId: this.forwardAssigneeGroup,
          fromGroup: this.fromGroup,
          assignee: this.forwardAssignee,
          remark: this.reason,
          skipped: this.showSkipModal
        };
        this.file.forwardFile(body, fileId).subscribe((Res) => {
          // this.fileApproved.emit();
          // this.getFileById(this.fileId);
          // this.getWorkflowStatus();
          this.notification.create(
            'success',
            'Success',
            'File ' + this.forwardReturnButton + 'ed Successfully!'
          );
          this.showSkipModal = false;
          this.selectedRole = null;
          if(this.notesInfo.subtype ==='PM_BILL') {
            setTimeout(() => {
              this.router.navigate(['business-dashboard/pmbr/file-list']);
            }, 500);
          } else if(this.notesInfo.subtype ==='PMBR_SCHEDULE') {
            setTimeout(() => {
              this.router.navigate(['business-dashboard/pmbr/file-list/schedule-files']);
            }, 500);
          } 
          // else if((this.notesInfo.subtype ==='PM_RESOLUTION') || (this.notesInfo.subType === 'PMBR_SCHEDULE_LOTTING_RESULT')){
          //   setTimeout(() => {
          //     this.router.navigate(['business-dashboard/pmbr/file-list/resolution-files']);
          //   }, 500);
          // } else if((this.notesInfo.type ==='PM_RESOLUTION') && (this.notesInfo.subType === 'PMBR')){
          //   setTimeout(() => {
          //     this.router.navigate(['business-dashboard/pmbr/file-list/resolution-files']);
          //   }, 500);
          // }
          else if(this.notesInfo.type ==='PM_RESOLUTION'){
            setTimeout(() => {
              this.router.navigate(['business-dashboard/pmbr/file-list/resolution-files']);
            }, 500);
          } 
          else{ this.fileForwarded.emit(this.fileId);}
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
      if (this.latestNote && this.latestNote.user.userId === this.userId) {
        this.markAsApproved();
      } else {
        this.addNote();
      }
  }

  markAsApproved() {
    if (!this.ratification) {
      const body = {
        fileId: this.notesInfo.fileId,
        userId: this.userId,
      };
      this.file.approveFile(body).subscribe((Res: any) => {
        // this.fileApproved.emit();
        this.notification.create('success', 'Success', 'File Approved Successfully!');
        if ((Res.activeSubTypes.includes('PRIORITY_LIST_REQUEST')) || (Res.activeSubTypes.includes('BILL_PRIORITY_LIST_FILE'))) {
          setTimeout(() => {
            this.router.navigate(['business-dashboard/bill/files/priority-list-files']);
          }, 500);
        } else if(Res.subtype ==='PM_BILL') {
          setTimeout(() => {
            this.router.navigate(['business-dashboard/pmbr/file-list']);
          }, 500);
        } else if(Res.subtype ==='PMBR_SCHEDULE') {
          setTimeout(() => {
            this.router.navigate(['business-dashboard/pmbr/file-list/schedule-files']);
          }, 500);
        } 
        // else if((Res.subtype ==='PM_RESOLUTION')|| (Res.subType === 'PMBR_SCHEDULE_LOTTING_RESULT')){
        //   setTimeout(() => {
        //     this.router.navigate(['business-dashboard/pmbr/file-list/resolution-files']);
        //   }, 500);
        // }else if((Res.type ==='PM_RESOLUTION') && (Res.subType === 'PMBR')){
        //   setTimeout(() => {
        //     this.router.navigate(['business-dashboard/pmbr/file-list/resolution-files']);
        //   }, 500);
        // }
        else if(Res.type ==='PM_RESOLUTION'){
          setTimeout(() => {
            this.router.navigate(['business-dashboard/pmbr/file-list/resolution-files']);
          }, 500);
        } 
        else{ this.fileApproved.emit(this.fileId);}
      });
    } else {
      const body = {
        fileId: this.fileId,
        userId: this.userId,
        ratification: this.ratification,
        fromGroup: this.fromGroup,
      };
      this.file.approveFile(body).subscribe((Res) => {
        this.selectedRole = null;
        this.notification.create('success', 'Success', 'File approved Successfully!'
        );
        this.fileApproved.emit(this.fileId);
      });
    }
  }

  addNote() {
    let noteContent;
    if (this.fileResponse.fileResponse.activeSubTypes.includes('BULLETIN')) {
      noteContent = 'File Approved and Circulation Order Issued.';
    } else {
      noteContent = 'File Approved.';
    }
    const reqBody = {
      noteId: null,
      fileId: this.notesInfo.fileId,
      note: noteContent,
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: false,
      userId: this.userId
    };
    this.file.createNote(reqBody).subscribe((data: any) => {
      this.notesInfo.notes = data;
      this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
      this.markAsApproved();
    });
  }
  // checkFileOwner() {
  //   if(this.stepStatusDetail.length > 0){
  //   const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
  //   if(current.owner===this.owner){
  //     this.forward= true;
  //   }
  // }
  // }
  getFileByFileId() {
    this.file.getFileById(this.fileId, this.userId).subscribe((Response) => {
      this.fileResponse = Response;
      if (this.fileResponse.fileResponse.status === 'SUBMITTED') {
        this.notes = this.fileResponse.fileResponse.notes;
        this.latestNote = this.notes[this.notes.length - 1];
        if (this.fileResponse.fileResponse.status !== 'APPROVED') {
          this.canApprove = true;
        }
        this.getWorkflowStatus();
        if ( this.fileResponse.fileResponse.status === 'SUBMITTED') {
          this.getWorkFLowUsers();
        }
        if (this.fileResponse.fileResponse.ratification && this.fileResponse.fileResponse.ratification.length !== 0) {
          const temp = this.fileResponse.fileResponse.ratification.filter(
            (x) => x.sectionRole === this.sectionRole
          );
          if (temp.length !== 0) {
            this.ratificationStatus = temp[0].status;
          }
        }
      }
    });
  }
  showPullpopup() {
    this.showPullModal = true;
  }
  cancelPull() {
    this.showPullModal = false;
  }
  pullFile() {
    this.showPullModal = false;
    this.getPullGroup();
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    // const noteBody = {
    //   fileId: this.fileId,
    //   note: 'Pulled to ' + this.user.userName,
    //   referenceBusiness: [0],
    //   referenceRules: [0],
    //   temporary: false,
    //   userId: current.assignee,
    //   fromGroupId: current.owner
    // };
    // this.file.createPullNote(this.fileId, noteBody).subscribe((Res) => {
    //     this.notes = Res;
    //     this.showPullModal = false;
    //     this.latestNote = this.notes[this.notes.length - 1];
    //     this.getAllLogs(this.fileId);
    //   });
    const fromRow = this.workflowUsers.find((user) => user.code === current.owner);
    const groupRow = this.workflowUsers.find((user) => user.code === this.currentPool);
    const body = {
      processInstanceId: this.fileResponse.fileResponse.workflowId,
      action: 'FORWARD',
      groupId: this.currentPool,
      fromGroup: this.pullGroup,
      assignee: this.userId,
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
        this.getFileByFileId();
      });
    } else {
      this.notification.create('warning', 'Warning', 'You cannot pull from higher authority!');
    }
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
        this.pullGroup =  element.name;
        this.currentActionName = element.actionName;
      }
    });
  }
  getPullGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current) {
      this.workflowUsers.forEach(element => {
        if (element.actionId === current.owner) {
          this.fromPool =  element.name;
        }
      });
    }
  }
  getFromGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    this.workflowUsers.forEach(element => {
      if (element.userId === this.user.userId) {
        this.fromGroup =  element.name;
        this.sectionRole =  element.actionId;
      }
    });
  }
  getWorkflowStatus() {
    let tempId;
    if (this.fileResponse.fileResponse.status === 'CLOSURE_PENDING') {
      tempId = this.fileResponse.fileResponse.fileClosureId;
    } else {
      tempId = this.fileResponse.fileResponse.workflowId;
    }
    this.file.checkWorkFlowStatus(tempId)
      .subscribe((Res) => {
        this.stepStatusDetail = Res;
        const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
        this.currentPoolUser = current.owner;
        this.assignee = parseInt(current.assignee, 10);
        this.getCurrentPool();
        if (this.fileResponse.fileResponse.status === 'SUBMITTED') {
          this.getWorkFLowUsers();
        }
      });
  }
  getWorkFLowUsers() {
    let tempId;
    if (this.fileResponse.fileResponse.status === 'CLOSURE_PENDING') {
      tempId = this.fileResponse.fileResponse.fileClosureId;
    } else {
      tempId = this.fileResponse.fileResponse.workflowId;
    }
    this.file.getWorkflowActionUsers(tempId, this.fileResponse.fileResponse.fileId)
      .subscribe((Res) => {
        this.allWorkflowUsers = Res;
        this.workflowUsers = this.allWorkflowUsers.filter(user => user.actionRow <=
          (this.allWorkflowUsers.find(u => u.userId === this.userId).actionRow + 2));
          this.getCurrentPool();
        for (var user of this.workflowUsers) {
          if (this.currentPoolUser === user.code) {
            this.currentUserActionRow = user.actionRow;
            break;
          }
        }
        this.pullOrNot();
      });
  }
  pullOrNot() {
    this.getPullGroup();
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
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
  ratificationApproveFile(fileId) {
    this.ratification = true;
    this.approveFile();
    this.approveBill();
  }
  fileClosure() {
    this.file.fileClosure(this.fileId, this.user.userId).subscribe(Res => {
      this.notification.create('success', 'Success', 'File closure initiated successfully!');
      this.getFileByFileId();
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
        // this.inputValue = null;
        // this.currentRuleStatement = null;
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
      this.notification.create('success', 'Success', 'File Closed Successfully!');
    });
  }
  sendToLawDept() {
    const body = {
      billId : this.fileResponse.bill.id,
      // fileId: this.fileId,
    }
    this.commonService.sendFileLawDep(body).subscribe(Res => {
      this.notification.create('success', 'Success', 'File Send to Law Department Successfully');
      this.getFileByFileId();
      // this.fileClosureInitiated.emit(this.fileId);
      this.getAllLogs(this.fileId);
    });
  }

  approveBill(){
    const body = {
      id: this.fileResponse.bill.id
    }
    this.file.approveBill(body).subscribe((Res) => {
      this.selectedRole = null;
      this.notification.create('success', 'Success', 'File approved Successfully!'
      );
      setTimeout(() => { this.router.navigate(['business-dashboard/pmbr/file-list']); }, 500);
    });
  }
  // rejectBill(){
  //   const body = {
  //     id: this.fileResponse.bill.id
  //   }
  //   this.file.secondRejectBill(body).subscribe((Res) => {
  //     this.notification.create('success', 'Success', 'File has been Rejected'
  //     );
  //     setTimeout(() => { this.router.navigate(['business-dashboard/pmbr/file-list']); }, 500);
  //   });
  // }
  rejectBill(){
    const body = {
      id: this.fileResponse.fileResponse.fileId
    }
    this.file.secondRejectBill(body).subscribe((Res) => {
      this.notification.create('success', 'Success', 'File has been Rejected'
      );
      setTimeout(() => { this.router.navigate(['business-dashboard/pmbr/file-list']); }, 500);
    });
  }
}
