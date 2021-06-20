import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FileServiceService } from '../../shared/services/file-service.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { Location } from '@angular/common';

@Component({
  selector: 'lib-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {
  skip = false;
  @Input() allWorkflowUsers;
  @Input() notesInfo;
  @Input() currentPoolUser;
  @Input() assignee;
  @Input() fileResponse;
  @Input() stepStatusDetail;
  @Input() fileId;
  // @Input() assembly;
  // @Input() session;
  // @Input() isPriorityFile;
  latestNote: any;
  fromGroup: any;
  currentUserActionRow: any;
  forwardAssignee: any;
  forwardAssigneeGroup: any;
  selectedRole: any;
  showSkipModal = false;
  workflowUsers: any = [];
  forwardReturnButton = 'Forward';
  userId;
  reason = '';
  popConfirm = false;
  permissions = {
    approve: false,
    correspondence: false,
    cbcapprove: false,
    fileClosure: false
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
  ratificationStatus: any;
  @Output() fileApproved = new EventEmitter<string>();
  @Output() fileForwarded = new EventEmitter<string>();
  @Output() fileClosureInitiated = new EventEmitter<string>();
    constructor(
    private file: FileServiceService,
    @Inject('authService') private AuthService,
    // private authService:AuthService,
    private router: Router,
    private notification: NzNotificationService,
    private commonService: BillcommonService,
    private _location: Location
  ) {
    // this.userId = AuthService.getCurrentUser().userId;
    this.owner = AuthService.getCurrentUser().authorities[0];
    this.user = AuthService.getCurrentUser();
    this.userId = this.user.userId;
    this.commonService.setBillPermissions(this.user.rbsPermissions);
    this.fromGroup = AuthService.getCurrentUser().authorities[0];
    //  if(this.notesInfo) {
    // console.log(this.notesInfo);
    //  this.getWorkflowUsers(this.notesInfo);
    // }
  }

  ngOnInit() {
    this.getRbsPermissionsinList();
    if (this.fileResponse.fileResponse.subtype === 'BILL_PRIORITY_LIST_FILE' && this.fileResponse.priorityRequest &&
    this.fileResponse.priorityRequest.correspondenceId === null
    && this.fileResponse.priorityRequest.cosId) {
      this.showForward = false;
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
    if (this.commonService.doIHaveAnAccess('CBC_APPROVAL', 'READ')) {
      this.permissions.cbcapprove = true;
    }
    if (this.commonService.doIHaveAnAccess('PULL_BUTTON', 'READ')) {
      this.pullButton = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE_RATIFICATION', 'APPROVE')) {
      this.ratificationApprove = true;
    }
    // if (this.commonService.doIHaveAnAccess('FILE_CLOSURE', 'READ')) {
    //   this.permissions.fileClosure = true;
    // }
  }
  returnFile() {

  }
  submitFile() {

  }

  goBack() {
     window.history.back();
    //this._location.back();
  //   if(this.isPriorityFile){
  //     this.router.navigate(['business-dashboard/bill/files/priority-list-files/'], {
  //       state: {
  //         particularAssembly:this.assembly,
  //         particularSession:this.session,
  //       },
  //     });
  //   }else{
  //   this.router.navigate(['business-dashboard/bill/files/'], {
  //     state: {
  //       particularAssembly:this.assembly,
  //       particularSession:this.session,
  //     },
  //   });
  // }
  }

  // approveFile() { }

  cancel() { }

  forwardOrReturn() {
    // console.log(this.stepStatusDetail);
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
        this.file.forwardFile(body, fileId).subscribe((Res: any) => {
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
          if ((Res.subtype === 'BILL_PRIORITY_LIST_FILE')) {
              this.router.navigate(['business-dashboard/bill/files/priority-list-files']);
          } else {
          this.router.navigate(['business-dashboard/bill/files']);
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
      if ((Res.subtype === 'BILL_PRIORITY_LIST_FILE')) {
          setTimeout(() => {
            this.router.navigate(['business-dashboard/bill/files/priority-list-files']);
          }, 1500);
        } else {
          setTimeout(() => {this.router.navigate(['business-dashboard/bill/files']); }, 1500);
        }
      });
    } else {
      const body = {
        fileId: this.fileId,
        userId: this.userId,
        ratification: this.ratification,
        fromGroup: this.fromGroup,
      };
      this.file.approveFile(body).subscribe((Res: any) => {
        this.selectedRole = null;
        this.notification.create( 'success', 'Success', 'File approved Successfully!'
        );
        if ((Res.subtype === 'BILL_PRIORITY_LIST_FILE')) {
          setTimeout(() => {this.router.navigate(['business-dashboard/bill/files/priority-list-files']); }, 1500);
      } else {
        setTimeout(() => {this.router.navigate(['business-dashboard/bill/files']); }, 1500);
      }
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
      if (this.fileResponse.fileResponse.status !== 'APPROVED' &&
          this.fileResponse.fileResponse.status !== 'CLOSED') {
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
    //     console.log('notes', Res);
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
    if (this.user.authorities.includes('assistant')) {
      this.currentPool = 'LEGISLATION_ASSISTANT';
      this.pullGroup = 'Assisstant';
      this.currentActionName = 'Assistant';
    } else if (this.user.authorities.includes('sectionOfficer')) {
      this.currentPool = 'LEGISLATION_SECTION_OFFICER';
      this.pullGroup = 'Section Officer';
      this.currentActionName = 'SectionOfficer';
    } else if (this.user.authorities.includes('underSecretary')) {
      this.currentPool = 'LEGISLATION_UNDER_SECRETARY';
      this.pullGroup = 'Under Secretary';
      this.currentActionName = 'UnderSecretary';
    } else if (this.user.authorities.includes('deputySecretary')) {
      this.currentPool = 'LEGISLATION_DEPUTY_SECRETARY';
      this.pullGroup = 'Deputy Secretary';
      this.currentActionName = 'DeputySecretary';
    } else if (this.user.authorities.includes('jointSecretary')) {
      this.currentPool = 'LEGISLATION_JOINT_SECRETARY';
      this.pullGroup = 'Joint Secretary';
      this.currentActionName = 'JointSecretary';
    } else if (this.user.authorities.includes('additionalSecretary')) {
      this.currentPool = 'LEGISLATION_ADDITIONAL_SECRETARY';
      this.pullGroup = 'Additional Secretary';
      this.currentActionName = 'JointSecretary';
    } else if (this.user.authorities.includes('specialSecretary')) {
      this.currentPool = 'LEGISLATION_SPECIAL_SECRETARY';
      this.pullGroup = 'Special Secretary';
      this.currentActionName = 'JointSecretary';
    } else if (this.user.authorities.includes('secretary')) {
      this.currentPool = 'SECRETARY';
      this.pullGroup = 'Secretary';
      this.currentActionName = 'Secretary';
    } else if (this.user.authorities.includes('speaker')) {
      this.currentPool = 'SPEAKER';
      this.pullGroup = 'Speaker';
      this.currentActionName = 'Speaker';
    }
  }
  getPullGroup() {
    const current = this.stepStatusDetail[this.stepStatusDetail.length - 1];
    if (current.owner === 'LEGISLATION_ASSISTANT') {
      this.fromPool = 'Assistant';
    } else if (current.owner === 'LEGISLATION_SECTION_OFFICER') {
      this.fromPool = 'Section Officer';
    } else if (current.owner === 'LEGISLATION_UNDER_SECRETARY') {
      this.fromPool = 'Under Secretary';
    } else if (current.owner === 'LEGISLATION_DEPUTY_SECRETARY') {
      this.fromPool = 'Deputy Secretary';
    } else if (current.owner === 'LEGISLATION_JOINT_SECRETARY') {
      this.fromPool = 'Joint Secretary';
    } else if (current.owner === 'LEGISLATION_ADDITIONAL_SECRETARY') {
      this.fromPool = 'Additional Secretary';
    } else if (current.owner === 'LEGISLATION_SPECIAL_SECRETARY') {
      this.fromPool = 'Special Secretary';
    } else if (current.owner === 'SECRETARY') {
      this.fromPool = 'Secretary';
    } else if (current.owner === 'SPEAKER') {
      this.fromPool = 'Speaker';
    }
  }
  getFromGroup() {
    if (this.user.authorities.includes('assistant')) {
      this.fromGroup = 'Assistant';
      this.sectionRole = 'LEGISLATION_ASSISTANT';
    } else if (this.user.authorities.includes('sectionOfficer')) {
      this.fromGroup = 'Section Officer';
      this.sectionRole = 'LEGISLATION_SECTION_OFFICER';
    } else if (this.user.authorities.includes('underSecretary')) {
      this.fromGroup = 'Under Secretary';
      this.sectionRole = 'LEGISLATION_UNDER_SECRETARY';
    } else if (this.user.authorities.includes('deputySecretary')) {
      this.fromGroup = 'Deputy Secretary';
      this.sectionRole = 'LEGISLATION_DEPUTY_SECRETARY';
    } else if (this.user.authorities.includes('jointSecretary')) {
      this.fromGroup = 'Joint Secretary';
      this.sectionRole = 'LEGISLATION_JOINT_SECRETARY';
    } else if (this.user.authorities.includes('additionalSecretary')) {
      this.fromGroup = 'Additional Secretary';
      this.sectionRole = 'LEGISLATION_ADDITIONAL_SECRETARY';
    } else if (this.user.authorities.includes('specialSecretary')) {
      this.fromGroup = 'Special Secretary';
      this.sectionRole = 'LEGISLATION_SPECIAL_SECRETARY';
    } else if (this.user.authorities.includes('secretary')) {
      this.fromGroup = 'Secretary';
      this.sectionRole = 'SECRETARY';
    } else if (this.user.authorities.includes('speaker')) {
      this.fromGroup = 'Speaker';
      this.sectionRole = 'SPEAKER';
    }
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
        if (this.fileResponse.fileResponse.status !== 'APPROVED' &&
            this.fileResponse.fileResponse.status !== 'CLOSED') {
          this.getWorkFLowUsers();
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
      for (var user of this.workflowUsers) {
        if (this.currentPoolUser === user.code) {
          this.currentUserActionRow = user.actionRow;
          break;
        }
      }
      this.pullOrNot();
    });

    // this.workflowUsers = this.allWorkflowUsers.filter(user => user.actionRow <=
    //   (this.allWorkflowUsers.find(u => u.userId === this.userId).actionRow + 2));
    // for (let user of this.workflowUsers) {
    //     if (this.currentPoolUser === user.code) {
    //     this.currentUserActionRow = user.actionRow;
    //     break;
    //     }
    //   }
    // this.pullOrNot();

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
}
