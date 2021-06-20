import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { PmbrBillService } from '../../pmbr-bill/shared/services/pmbr-bill.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PmbrResolutionService } from '../shared/services/pmbr-resolution.service';
import { BulletinService } from '../../shared/services/bulletin.service';
import { BulletinContentViewComponent } from '../../bulletin/bulletin-content-view/bulletin-content-view.component';
@Component({
  selector: 'pmbr-resolution-ballot-view',
  templateUrl: './resolution-ballot-view.component.html',
  styleUrls: ['./resolution-ballot-view.component.css']
})
export class ResolutionBallotViewComponent implements OnInit {
  ballotid;
  ballotResult: any = [];
  performList: any = [];
  user: any;
  attachtofileButton;
  createFilePopUp = false;
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  pmbillId;
  isAssignVisible = false;
  radioValue: any = null;
  @Output() showLetter = new EventEmitter<any>();
  memberCodes: any = null;
  @Input() ballotId;
  @Input() isFileView;
  bulletinData: any = null;
  fileStatus: any = null;
  showBulletinPart2Popup = false;
  speakerNote: any = null;
  readingPreview = false;
  permission = {
    createFile: false,
    createBulletin: false,
    createLetter: false
  };
  fileResponse: any = null;
  memberReading: any = null;
  memberReadingPreview: any = null;
  type = "RESOLUTION";
  canAddToLob: boolean= false;
  sessionList: any = [];
  assemblyList: any = [];
  validateForm = this.fb.group({
    assemblyId: [null, [Validators.required]],
    sessionId: [null, [Validators.required]],
    subject: [null, [Validators.required]],
    priority: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });
  departmentToCode: any;
  additionalResolution;
  showResolutionList: boolean = false;
  listOfResolution: any;
  resolutionIds: any;
  allAssembly: any = [];
  assemblySession: any = null;
  constructor(private pmbrCommonService: PmbrCommonService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    private pmbrBillService: PmbrBillService,
    @Inject('authService') private AuthService,
    private fileService: FileServiceService,
    private modalService: NzModalService,
    private pmbrService : PmbrResolutionService,
    private bullettin: BulletinService,
    private fb: FormBuilder) {
    this.ballotid = this.route.snapshot.params.id;
    this.user = AuthService.getCurrentUser();
    this.pmbrCommonService.setPermissions(this.user.rbsPermissions);
    if (this.user.authorities[0] === 'assistant') {
      this.attachtofileButton = true;
    }
  }

  ngOnInit() {
    this.getPermissions();
    this.getResolutionList()
    if (!this.ballotId) {
      this.ballotid = this.route.snapshot.params.id;
      this.ballotResultById();

    } else {
      this.ballotid = this.ballotId;
      this.ballotResultById();
      this.attachtofileButton = false;
    }
this.getAssembly();
  }
  getAssembly() {
    this.pmbrCommonService.getAllAssemblyAndSession().subscribe(res => {
      this.allAssembly = res;
      this.assemblySession = res.assemblySession;
      this.assemblyList = this.allAssembly.assembly;
    });
  }
  getSessionForAssembly() {
    if (this.assemblySession.find(x => x.id === this.validateForm.value.assemblyId)) {
      this.sessionList = this.assemblySession.find(x => x.id === this.validateForm.value.assemblyId).session;
    }
  }
  createFilePop() {
    this.createFilePopUp = true;
  }
  onCancelCreateFilePopup() {
    this.createFilePopUp = false;
    this.isAssignVisible = false;
    this.radioValue = null;
  }
  createFile() {
    const body = {
      billId: null,
      pmbrScheduleId: null,
      pmbrLottingId: this.ballotResult.id,
      fileForm: {
        assemblyId: this.validateForm.value.assemblyId,
        currentNumber: null,
        description: this.validateForm.value.description,
        sessionId: this.validateForm.value.sessionId,
        status: "SAVED",
        subject: this.validateForm.value.subject,
        activeSubTypes: ["PMBR_SCHEDULE_LOTTING_RESULT"],
        subtype: "PM_RESOLUTION",
        type: "PM_RESOLUTION",
        userId: this.user.userId,
        priority: this.validateForm.value.priority,
      },
      priorityMasterId: 0
    };
    if (this.validateForm.valid) {
    this.pmbrBillService.createBillFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with file number :" + Res.fileResponse.fileNumber
      );
      setTimeout(() => {
        this.router.navigate(["business-dashboard/pmbr/file-view", Res.fileResponse.fileId]);
      }, 1500);
    });
    this.createFilePopUp = false;}
    else{
      this.notification.create(
        'warning',
        'Warning',
        'Please fill in the required fields!'
      );
    }
  }
  ballotResultById() {
    const body = {
      id: this.ballotid
    }
    this.pmbrCommonService.getBallotResultById(body).subscribe((res: any) => {
      this.ballotResult = res;
      this.checkAddTolob()
      this.getFileById();
    })
  }
  resubmitFile() {
    const body = {
      pmbrLottingId: this.ballotResult.id,
      fileForm: {
        fileId: this.ballotResult.fileId,
        activeSubTypes: ["PMBR_SCHEDULE_LOTTING_RESULT"],
        type: "PM_RESOLUTION",
        userId: this.user.userId,
        subtype: "PMBR_SCHEDULE_LOTTING_RESULT",
        pmbrScheduleId: this.ballotResult.pmbrScheduleId
      }

    }
    this.pmbrCommonService.attachToFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Resubmitted Successfully"
      );
      this.router.navigate(['business-dashboard/pmbr/file-view/', Res.fileResponse.fileId]);
    });
  }
  attachToFile() {
    const body = {
      pmbrLottingId: this.ballotResult.id,
      fileForm: {
        fileId: this.ballotResult.fileId,
        activeSubTypes: ["PMBR_SCHEDULE_LOTTING_RESULT"],
        requestedAdditionalSubtype: ["PMBR_SCHEDULE_LOTTING_RESULT"],
        type: "PMBR",
        userId: this.user.userId,
        subtype: "PMBR_SCHEDULE_LOTTING_RESULT",
        pmbrScheduleId: this.ballotResult.pmbrScheduleId
      }
    }
    this.pmbrCommonService.attachFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Attached Successfully"
      );
      this.router.navigate(['business-dashboard/pmbr/file-view/', Res.fileResponse.fileId]);
      // this.router.navigate(['business-dashboard/pmbr/file-view/'], Res.fileResponse.fileId);
    });
  }
  cancel() {

  }

  viewFile() {
    this.router.navigate(['business-dashboard/pmbr/file-view/', this.ballotResult.fileId]);
  }
  getMemberCodes() {
    this.pmbrCommonService.getWonMembersResolution(this.ballotId, this.type).subscribe(res => {
      if (res) {
        this.memberCodes = res;
      }
      this.draftCorrespondence();
    });
  }

  draftCorrespondence() {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "PRIVATE_MEMBER_BILL_WON_LETTER",
          type: "PMBR_SECTION",
          fileId: this.ballotResult.fileId,
          businessReferId: this.ballotResult.id,
          businessReferType: "PMBR",
          businessReferSubType: "PRIVATE_MEMBER_BILL_WON_LETTER",
          businessReferValue: "Letter to Won Members",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: this.ballotResult.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: this.memberCodes,
          toDisplayName: this.memberCodes.map(x => x.displayName).join(),
          toEditable: false,
          redirectToModule: 'PMBR'
          // onSuccess: "business-dashboard/bill/list-priority-list",
        },
      }
    );
  }

  viewLetter(corresId) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',corresId,
    ]);
  }

  createBulletin() {
    let resolutionIds = this.ballotResult.pmbrResolutionLottingResultDto.filter(x=> x.resolutionId !== null);
    if(resolutionIds.length === this.ballotResult.pmbrResolutionLottingResultDto.length) {
    this.bulletinData = {
      title: '',
      businessId: this.ballotid,
      businessType: 'PM_RESOLUTION',
      assemblyId: null,
      sessionId: null,
      fileId: this.ballotResult.fileId,
      description: '',
      type: 'PM_RESOLUTION',
      part: '2',
      // approvedBy: this.currentUser.userId,
      userId: this.user.userId
    };
    this.fileService.getFileById(this.ballotResult.fileId, this.user.userId).subscribe((res: any) => {
      if (res) {
        this.fileStatus = res.fileResponse.status;
        if (this.fileStatus === 'APPROVED') {
          this.showBulletinPart2Popup = true;
        } else {
          this.modalService.create({
            nzTitle: 'Create Bulletin Part 2',
            nzWidth: '500',
            nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot create bulletin now... </b>',
            nzOkText: 'OK',
            nzOnOk: () => { },
          });
        }
      }
    });
  } else {
      this.notification.warning('Warning', 'Sorry, You will be able to create bulletin, only when all the won members have submitted the resolutions!');
    }
  }

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
    this.bulletinData = {};
  }

  afterCreateBulletin(e) {
    if (e) {
      this.notification.success('Success', 'Bulletin Created.');
      this.resubmitFile();
    }
    this.cancelBulletin();
  }

  resubmitBulletinFile() {
    const body = {
      fileForm: {
        fileId: this.ballotResult.fileId,
        activeSubTypes: ['BULLETIN'],
        type: 'PMBR_RESOLUTION',
        userId: this.user.userId,
      }
    };
    this.fileService.attachToFile(body).subscribe((Res: any) => {
      this.router.navigate(['business-dashboard/pmbr/file-view/', this.ballotResult.fileId]);
    });
  }

  generateSpeakerNote() {
    let resolutionIds = this.ballotResult.pmbrResolutionLottingResultDto.filter(x=> x.resolutionId !== null);
    if(resolutionIds.length === this.ballotResult.pmbrResolutionLottingResultDto.length) {
      // const flow ='FIRST';
      const body ={
        ballotResultId: this.ballotResult.id,
        flow:'FIRST',
        resolutionIds: this.resolutionIds? this.resolutionIds: null
      }
      this.pmbrCommonService.generateSpeakerNote(body).subscribe((Res: any) => {
        this.speakerNote = Res;
        this.readingPreview = true;
        this.ballotResultById();
      });
    } else {this.notification.warning('Warning', 'Sorry, You will be able to create speaker note, only when all the won members have submitted the resolutions!');}
  }
  viewSpeakerNote(id) {
    this.pmbrCommonService.getPmbrSpeakerNote(id).subscribe((Res: any) => {
      this.speakerNote = Res;
      this.readingPreview = true;
    });
  }

  attachSpeakerNoteToFile() {
    this.fileService.getFileById(this.ballotResult.fileId, this.user.userId).subscribe((res: any) => {
      if (res) {
        if (res.fileResponse.status === 'APPROVED') {
          const body = {
            pmbrSpeakerNoteId: this.speakerNote.id,
            fileForm: {
              fileId: this.ballotResult.fileId,
              activeSubTypes: ['PMBR_SPEAKER_NOTE'],
              type: 'PM_RESOLUTION',
              userId: this.user.userId,
            }
          };
          this.fileService.attachToFile(body).subscribe((Res: any) => {
            this.router.navigate(['business-dashboard/pmbr/file-view/', this.ballotResult.fileId]);
          });
        } else {
          this.notification.warning('Warning', 'File is under approval flow. Cannot attach now!');
        }
      }
    });
  }

  hidePreview() {
    this.speakerNote = null;
    this.readingPreview = false;
    this.memberReading = null;
    this.memberReadingPreview = false;
  }

  getPermissions() {
    if (this.pmbrCommonService.doIHaveAnAccess('BULLETIN', 'CREATE')) {
      this.permission.createBulletin = true;
    }

    if (this.pmbrCommonService.doIHaveAnAccess('FILE', 'CREATE')) {
      this.permission.createFile = true;
    }

    if (this.pmbrCommonService.doIHaveAnAccess('CORRESPONDENCE', 'CREATE')) {
      this.permission.createLetter = true;
    }
  }

  getFileById() {
    if (this.ballotResult.fileId) {
      this.fileService.getFileById(this.ballotResult.fileId, this.user.userId).subscribe((res: any) => {
        this.fileResponse = res;
      });
    }
  }

  generateMemberReading(id) {
    const flow = 'FIRST'
    this.pmbrCommonService.generateMemberReading(id, flow).subscribe((Res: any) => {
      this.memberReading = Res;
      this.memberReadingPreview = true;
      this.ballotResultById();
    });
  }
  viewMemberReading(id) {
    this.pmbrCommonService.viewMemberReading(id).subscribe((Res: any) => {
      this.memberReading = Res;
      this.memberReadingPreview = true;
    });
  }

  // attachMemberReadingToFile() {
  //   this.fileService.getFileById(this.ballotResult.fileId, this.user.userId).subscribe((res: any) => {
  //     if (res) {
  //       if (res.fileResponse.status === 'APPROVED') {
  //         const body = {
  //           pmbrMemberReadingId: this.memberReading.id,
  //           fileForm: {
  //             fileId: this.ballotResult.fileId,
  //             activeSubTypes: ['PMBR_MEMBER_READING'],
  //             type: 'PM_RESOLUTION',
  //             userId: this.user.userId,
  //           }
  //         };
  //         this.fileService.attachToFile(body).subscribe((Res: any) => {
  //           this.router.navigate(['business-dashboard/pmbr/file-view/', this.ballotResult.fileId]);
  //         });
  //       } else {
  //         this.notification.warning('Warning', 'File is under approval flow. Cannot attach now!');
  //       }
  //     }
  //   });
  // }
  addToLob() {
    if(this.ballotResult.speakerNoteId) {
      this.pmbrCommonService.addResolutionToLob(this.ballotResult.speakerNoteId).subscribe(res=> {
        if(res) {
          this.ballotResultById();
          this.notification.success('Success', 'Resolution added to Lob!');
        }
      });
    } else {
      this.notification.warning('Warning', 'Add speaker note!');
    }
  }
  checkAddTolob() {
    let memberReadingIds = this.ballotResult.pmbrResolutionLottingResultDto.filter(x=> x.memberReadingId !== null);
    if(memberReadingIds.length>0) {
      this.canAddToLob = true;
    }
  }
  attachMemberReadingToFile() {
    const currentMember = this.ballotResult.pmbrResolutionLottingResultDto.find(x => x.memberReadingId === this.memberReading.id);
    if(currentMember && this.fileResponse) {
      const body = {
        pmBillId: currentMember.resolutionId,
        billId: currentMember.resolutionId,
        pmbrLottingId: this.ballotResult.id,
        pmbrMemberReadingId: this.memberReading.id,
        fileForm: {
          assemblyId: this.fileResponse.fileResponse.assemblyId,
          sessionId: this.fileResponse.fileResponse.sessionId,
          fileId: this.ballotResult.fileId,
          currentNumber: null,
          description: this.fileResponse.fileResponse.description,
          status: "SAVED",
          subject: this.fileResponse.fileResponse.subject,
          activeSubTypes: ["PM_RESOLUTION","PMBR_MEMBER_READING"],
          requestedAdditionalSubtype: ["PM_RESOLUTION", "PMBR_MEMBER_READING"],
          type: "PM_RESOLUTION",
          userId: this.user.userId,
          subtype: "PM_RESOLUTION",
          priority: this.fileResponse.fileResponse.priority  
        }
      }
      this.pmbrCommonService.resubmitOrAttachFile(body).subscribe((Res: any) => {
        this.notification.success(
          "Success",
          "File Attached Successfully"
        );
        this.memberReadingPreview = false;
        // this.router.navigate(['business-dashboard/pmbr/file-view/', Res.fileResponse.fileId]);
      });
    }
  }
  getDepartmentCode(resolutionId) {
    this.pmbrCommonService.getResolutionDepartmentCode(resolutionId).subscribe((res: any) => {
      console.log('deptCode', res)
      if (res) {
        this.router.navigate(
          ['business-dashboard/correspondence/select-template'],
          {
            state: {
              business: 'PM_RESOLUTION_LETTER_TO_STAKE_HOLDER',
              type: 'PMBR_SECTION',
              fileId: this.ballotResult.fileId,
              businessReferId: resolutionId,
              businessReferType: 'PMBR',
              businessReferSubType: 'PM_RESOLUTION_LETTER_TO_STAKE_HOLDER',
              businessReferValue : 'Letter to Departent',
              businessReferNumber: null,
              businessReferName: null,
              fileNumber:  this.ballotResult.fileNumber,
              departmentId: null,
              masterLetter: null,
              refrenceLetter: null,
              toCode: res[0].code,
              toDisplayName: res[0].stakeHolder,
              toEditable: false,
              redirectToModule: 'PMBR',
              redirectToFile: true
              // onSuccess: "business-dashboard/bill/list-priority-list",
            },
          }
        );
      } else {
        this.notification.success(
          'Warning',
          'Department Not Found'
        );
      }
    });
  }
  //additional resolution list popup view
  showAdditionalResolutionList() {
    this.showResolutionList = true;
  }
  //listing of additional resolution
  getResolutionList() {
    this.pmbrService.getAdditionalResolutionList().subscribe(res => {
      if(res) {
        this.listOfResolution  = res;
      }
    });
  }
//save additional resolution
  saveResolutionList() {
    this.showResolutionList = false;
    this.resolutionIds= this.additionalResolution.map( x=>x.id);
  }
  // hide addition resolution list popup
  hideResolutionlist() {
    this.showResolutionList = false;
  }
  viewBulletin(bulletinId) {
    this.bullettin.getBulletinById(bulletinId).subscribe(res => {
      this.modalService.create({
        nzTitle: null,
        nzWidth: '800',
        nzContent: BulletinContentViewComponent,
        nzClosable: true,
        nzFooter: null,
        nzMaskClosable: false,
        nzComponentParams: {
          bulletin: res,
        }
      });
    });
  }
}
