import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from '../shared/services/documents.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { FilesService } from '../shared/services/files.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: 'cpl-amendment-view',
  templateUrl: './amendment-view.component.html',
  styleUrls: ['./amendment-view.component.scss'],
  providers: [DatePipe]
})
export class AmendmentViewComponent implements OnInit {
  notes: any = [];
  amendmentId: any;
  amendment: any = [];
  selectedRole: any;
  workFlowUsers: any = [];
  forwardAssignee: any;
  fromGroup: any;
  forwardAssigneeGroup: any;
  user: any;
  showPdfModal = false;
  noticeUrl: string;
  editMode = false;
  editorInstance: any;
  editorIndex: any;
  versionArray: any;
  currentVersion: any = 0;
  counter = Array;
  stepStatus: any = [];
  currentPoolUser: any;
  currentPool: string;
  currentActionName: string;
  layingDate: any;
  dateList: any = [];
  assemblyId: any;
  sessionId: any;
  assemblyList: any = [];
  sessionList: any = [];
  inputValue: any = '';
  latestNote: any = [];
  update: boolean;
  noteId: any;
  pendingAmendments: any = [];
  tempPendingAmendments: any = [];
  documentApi: any;
  permissions = {
    version: false
  };

  constructor(private route: ActivatedRoute,
              private docService: DocumentsService,
              @Inject('authService') private AuthService,
              private notification: NzNotificationService,
              private router: Router,
              private fileService: FilesService,
              public datepipe: DatePipe,
              private commonService: CommonService) {
                this.user = AuthService.getCurrentUser();
                this.commonService.getCPLPermissions(this.user.rbsPermissions);
               }

  ngOnInit() {
    this.getPermissions();
    this.route.params.subscribe((params) => {
      this.amendmentId = params.id;
      this.getAmendmentById(this.amendmentId);
      // this.getWorkFLowUsers(this.amendmentId);
      // this.getFromGroup();
      // this.getNotes();
    });
    this.getAssemblyList();
    this.getSessionList();
  }

  getAssemblyList() {
    this.docService.getAllAssembly().subscribe(Response => {
      this.assemblyList = Response;
    });
  }

  getSessionList() {
    this.docService.getAllSession().subscribe(Response => {
      this.sessionList = Response;
    });
  }

  getAmendmentById(id) {
    this.docService.getAmendmentById(id).subscribe(Res => {
      this.amendment = Res;
      this.currentVersion = this.amendment.amendmentDto.currentVersion;
      this.getVersion(this.currentVersion);
      // this.getWorkflowStatus(this.amendment.amendmentDto.workflowId);
      this.getDateDetails(this.amendment.amendmentDto.layingDate);
    });
  }

  goBack() {
    window.history.back();
  }

  // getFromGroup() {
  //   if (this.user.authorities.includes('assistant')) {
  //     this.fromGroup = 'Assistant';
  //   } else if (this.user.authorities.includes('sectionOfficer')) {
  //     this.fromGroup = 'Section Officer';
  //   } else if (this.user.authorities.includes('underSecretary')) {
  //     this.fromGroup = 'Under Secretary';
  //   } else if (this.user.authorities.includes('deputySecretary')) {
  //     this.fromGroup = 'Deputy Secretary';
  //   } else if (this.user.authorities.includes('jointSecretary')) {
  //     this.fromGroup = 'Joint Secretary';
  //   } else if (this.user.authorities.includes('additionalSecretary')) {
  //     this.fromGroup = 'Additional Secretary';
  //   } else if (this.user.authorities.includes('secretary')) {
  //     this.fromGroup = 'Secretary';
  //   } else if (this.user.authorities.includes('specialSecretary')) {
  //     this.fromGroup = 'Special Secretary';
  //   } else if (this.user.authorities.includes('speaker')) {
  //     this.fromGroup = 'Speaker';
  //   }
  // }

  // getWorkFLowUsers(id) {
  //   this.docService.getAmendmentWorkflowActionUsers(id)
  //     .subscribe((Res) => {
  //       this.workFlowUsers = Res;
  //     });
  // }

  // forwardAmendment() {
  //   if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
      
  //   const arrForwardUerInfo = this.selectedRole.split('-');
  //   const forwardActionRow = arrForwardUerInfo[1];
  //   this.forwardAssignee = arrForwardUerInfo[0];
  //   this.forwardAssigneeGroup = arrForwardUerInfo[2];
  //   const body = {
  //     processInstanceId: this.amendment.amendmentDto.workflowId,
  //     action: 'FORWARD',
  //     groupId: this.forwardAssigneeGroup,
  //     fromGroup: this.fromGroup,
  //     assignee: this.forwardAssignee,
  //   };
    
  //   this.docService.forwardAmendment(body, this.amendmentId).subscribe(Res => {
  //     this.notification.create(
  //       'success',
  //       'Success',
  //       'File forwarded Successfully!'
  //     );
  //     this.router.navigate(['business-dashboard/cpl/amendments']);
  //   });
    
  // }
  // else {
  //   this.notification.create("warning", "Warning", "Please Add Note!");
  // }
  // }

  showPreview(url) {
    this.showPdfModal = true;
    this.noticeUrl = url;
  }

  hideModal() {
    this.showPdfModal = false;
    this.noticeUrl = '';
  }

  // SaveEditorInstance(instance) {
  //   this.editorInstance = instance;
  // }

  // SetCurrentIndex() {
  //   if (this.editorInstance) {
  //     try {
  //       this.editorIndex = this.editorInstance.getSelection().index;
  //     } catch {}
  //   }
  // }

  // setContentHtml(instance) {
  //   this.amendment.amendmentDto.content = instance.html;
  // }

  // editAmendment() {
  //   this.editMode = true;
  //   this.layingDate = this.versionArray.layingDate;
  // }

  // saveAmendment() {
  //   this.editMode = false;
  //   this.versionArray.layingDate = this.layingDate;
  //   console.log(this.versionArray);
  //   this.docService.editAmendment(this.versionArray).subscribe(Res => {
  //     this.getAmendmentById(this.amendmentId);
  //     this.notification.create(
  //       'success',
  //       'Success',
  //       'Amendment Updated Successfully!'
  //     );
  //   });
  // }

  // cancel() {
  //   this.editMode = false;
  // }

  getVersion(version) {
    this.versionArray = this.amendment.versionMap[version];
  }
  viewDocument(id) {
    this.router.navigate(["business-dashboard/cpl/cpl-view", "view", id]);
  }
  // getStatusByReason(reason) {
  //   if (reason) {
  //     if (reason === 'completed') {
  //       return 'finish';
  //     }
  //     if (reason === 'in progress') {
  //       return 'wait';
  //     }
  //   }
  // }

  // getWorkflowStatus(id) {
  //   this.fileService
  //     .checkWorkFlowStatus(id)
  //     .subscribe((Res) => {
  //       this.stepStatus = Res;
  //       const current = this.stepStatus[this.stepStatus.length - 1];
  //       this.currentPoolUser = current.owner;
  //       this.getCurrentPool();
  //   });
  // }

  // getCurrentPool() {
  //   if (this.user.authorities.includes('assistant')) {
  //     this.currentPool = 'CPL_ASSISTANT';
  //     this.currentActionName = 'Assistant';
  //   } else if (this.user.authorities.includes('sectionOfficer')) {
  //     this.currentPool = 'CPL_SECTION_OFFICER';
  //     this.currentActionName = 'SectionOfficer';
  //   } else if (this.user.authorities.includes('underSecretary')) {
  //     this.currentPool = 'CPL_UNDER_SECRETARY';
  //     this.currentActionName = 'UnderSecretary';
  //   } else if (this.user.authorities.includes('deputySecretary')) {
  //     this.currentPool = 'CPL_DEPUTY_SECRETARY';
  //     this.currentActionName = 'DeputySecretary';
  //   } else if (this.user.authorities.includes('jointSecretary')) {
  //     this.currentPool = 'CPL_JOINT_SECRETARY';
  //     this.currentActionName = 'JS/AS/SS';
  //   } else if (this.user.authorities.includes('additionalSecretary')) {
  //     this.currentPool = 'CPL_JOINT_SECRETARY';
  //     this.currentActionName = 'JS/AS/SS';
  //   } else if (this.user.authorities.includes('secretary')) {
  //     this.currentPool = 'SECRETARY';
  //     this.currentActionName = 'Secretary';
  //   } else if (this.user.authorities.includes('specialSecretary')) {
  //     this.currentPool = 'CPL_JOINT_SECRETARY';
  //     this.currentActionName = 'JS/AS/SS';
  //   } else if (this.user.authorities.includes('speaker')) {
  //     this.currentPool = 'SPEAKER';
  //     this.currentActionName = 'Speaker';
  //   }
  // }

  getDateDetails(date) {
    const body = [date];
    this.docService.getDateDetails(body).subscribe(Res => {
      const dateDetails: any = Res;
      if (dateDetails !== []) {
        this.assemblyId = dateDetails[0].assemblyId;
        this.sessionId = dateDetails[0].sessionId;
        this.getDateList();
      }
    });
  }

  getDateList() {
    this.docService.getDates(this.assemblyId, this.sessionId).subscribe(Res => {
      this.dateList = Res;
    });
  //   this.dateList = [
  //     '2020-06-19',
  //     '2020-06-30',
  //     '2020-07-14',
  //     '2020-07-15',
  //     '2020-07-16'
  // ];
  }

  // addNote() {
  //   if (!this.update) {
  //     const body = {
  //       amendmentVersion: this.currentVersion,
  //       note: this.inputValue,
  //       temporary: false,
  //       amendmentId: this.amendmentId,
  //       userId: this.user.userId
  //     };
  //     let add = false;
  //     if (this.latestNote) {
  //       if (this.latestNote.user.userId !== this.user.userId) {
  //         add = true;
  //       } else {
  //         add = false;
  //       }
  //     } else {
  //       add = true;
  //     }
  //     if (this.inputValue.charAt(0) !== ' ' && add) {
  //     this.docService.addAmendmentNote(body).subscribe(Res => {
  //       this.inputValue = null;
  //       this.notification.create(
  //         'success',
  //         'Success',
  //         'Note Added Successfully!'
  //       );
  //       this.getNotes();
  //     });
  //    } else if (this.inputValue.charAt(0) === ' ') {
  //     this.notification.create(
  //       'warning',
  //       'Warning',
  //       'First Character Should Not Be Space!'
  //     );
  //   } else if (!add) {
  //     this.notification.create(
  //       'warning',
  //       'Warning',
  //       'You can add only one note!'
  //     );
  //   }
  //   }
  //   if (this.update) {
  //     const body =  {
  //       id: this.noteId,
  //       amendmentVersion: this.currentVersion,
  //       note: this.inputValue,
  //       temporary: false,
  //       amendmentId: this.amendmentId,
  //       userId: this.user.userId
  //     };
  //     if (this.inputValue.charAt(0) !== ' ') {
  //     this.docService.updateAmendmentNote(body).subscribe(Res => {
  //       this.inputValue = null;
  //       this.notification.create(
  //         'success',
  //         'Success',
  //         'Note Updated Successfully!'
  //       );
  //       this.getNotes();
  //     });
  //     } else {
  //       this.notification.create(
  //         'warning',
  //         'Warning',
  //         'First Character Should Not Be Space!'
  //       );
  //     }
  //   }
  // }

  // getNotes() {
  //   this.docService.getAmendmentNote(this.amendmentId).subscribe(Res => {
  //     this.notes = Res;
  //     this.latestNote = this.notes[this.notes.length - 1];
  //   });
  // }

  // deleteNote(id) {
  //   this.docService.deleteAmendmentNote(id).subscribe((res: any) => {
  //     this.notification.create(
  //       'success',
  //       'Success',
  //       'Note Deleted Successfully!'
  //     );
  //     this.getNotes();
  //   });
  // }


  // cancelEdit() {
  //   this.inputValue = null;
  //   this.update = false;
  // }

  // editNote(id, note) {
  //   this.update = true;
  //   this.inputValue = note;
  //   this.noteId = id;
  // }

  replyLetter() {
    // this.router.navigate(["business-dashboard/cpl/select-template"], {
    //   state: {
    //     business: "AMENDMENT",
    //     type: "CPL_SECTION",
    //     fileId: data.fileId,
    //     businessReferId: data.id,
    //     businessReferType: data.type,
    //     businessReferSubType: data.subType,
    //     businessReferNumber: data.typeNumber,
    //     fileNumber: data.regFileNumber,
    //     departmentId: data.ministerDepartmentId,
    //     masterLetter: null,
    //     refrenceLetter: null,
    //     toCode: Res.code,
    //     toDisplayName: Res.displayName
    //   },
    // });
  }

  getPermissions() {
    if (this.commonService.doIHaveAnAccess('VERSION', 'READ')) {
      this.permissions.version = true;
    }
  }
}
