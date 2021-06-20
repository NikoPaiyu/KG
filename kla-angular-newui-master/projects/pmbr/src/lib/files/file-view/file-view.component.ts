import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileServiceService } from '../../shared/services/file-service.service';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { NzModalService, NzNotificationService } from "ng-zorro-antd";
import { PmbrResolutionService } from '../../pmbr-resolution/shared/services/pmbr-resolution.service';
import { InoticeDetails } from '../../pmbr-bill/shared/models/pmbr-bill-model';

@Component({
  selector: 'pmbr-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
  billDetails: any;
  billDetail: any;
  billFileDetails;
  assignee: any;
  currentPoolUser: any;
  allWorkflowUsers: any = [];
  logDetails: any = [];
  stepStatusDetail: any = [];
  userDetails: any = [];
  roleDetails: any = [];
  notesInfo: any = [];
  notesData: any = [];
  userId: any;
  fileId: any;
  fileDetails: any = null;
  showBillContent;
  latestNote: any = null;
  responseAvailable = false;
  errataStatus = 'APPROVED';
  bulletinStatus;
  currentUser: any;
  ballotStatus = 'APPROVED';
  objStatus = 'LOB APPROVED';
  isEditPrio: boolean;
  priority;
  clauseStatus = 'APPROVED';
  tabParams = {};
  reportfullScreenMode = false;
  ratificationStatus = null;
  sectionRole: any;
  billId;
  billfillId;
  user;
  rejectionLetterForm: boolean;
  showLetterForm: boolean = false;
  showWonLetterTab = false;
  letterContent: any = null;
  letterStatus= 'APPROVED';
  resolutionStatus;
  resolutionBallotStatus = 'APPROVED';
  ballotResultStatus = 'APPROVED';
  speakerNoteStatus = 'APPROVED';
  memberReadingStatus = 'APPROVED';
  showNotice: boolean;
  noticeDetails: InoticeDetails;
  constructor(
    private route: ActivatedRoute,
    @Inject('authService') private AuthService,
    private router: Router,
    private file: FileServiceService,
    private pmbrCommonService: PmbrCommonService,
    private notify: NzNotificationService,
    private pmbrResolution: PmbrResolutionService,
    private modalService: NzModalService
  ) {
    this.user = AuthService.getCurrentUser();
    // const id = this.route.snapshot.params.id;
    this.billfillId = this.route.snapshot.params.id;
    if (this.billfillId > 0) {
      this.getBillFileById();
    }
    this.currentUser = AuthService.getCurrentUser();
    this.userId = AuthService.getCurrentUser().userId;
    // const Id = this.route.snapshot.params.id;
    // console.log(Id);
    // this.getFileByFileId(Id);
    // this.fileId=Id;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      //  const Id = this.route.snapshot.params.id;
      this.getFileByFileId(this.fileId);
      this.getBillFileById();
      // this.getAllNotes(this.fileId);
      // this.fileId=Id;
    });
  }
  getFileByFileId(fileId) {
    this.setTabfilters();
    this.file.getFileById(fileId, this.userId).subscribe((Response) => {
      if (Response) {
        this.showBillContent = this.route.snapshot.params.business;
        this.fileDetails = Response;
        if(this.fileDetails.pmbrScheduleLottingResultDTO) {
          if(this.fileDetails.pmbrScheduleLottingResultDTO.length > 0 &&
            this.fileDetails.pmbrScheduleLottingResultDTO.fileStatus === 'APPROVED') {
            this.showLetterForm = true;
          }
        }
        this.responseAvailable = true;
        this.getStatusForBlocks();
        // this.getWorkFlowTrack(Response.fileResponse.workflowId);
        // this.loadFileButtons(Response.fileResponse.status);
        this.notesInfo = this.fileDetails.fileResponse;
        if (this.notesInfo) {
          this.latestNote = this.notesInfo.notes[this.notesInfo.notes.length - 1];
          this.getWorkflowUsers(this.notesInfo);
          this.getAllNotes(this.notesInfo.fileId);
        }
        this.userDetails = this.fileDetails.fileResponse.user;
        this.roleDetails = this.fileDetails.fileResponse.user.roles;
        this.logDetails = this.fileDetails.fileResponse.logs;
        this.getWorkflowStatus();
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
        // if (this.noticeDetails && this.noticeDetails.length > 0) {
        //   this.noticeId = this.noticeDetails[0].notice.noticeId;
        // }
        // this.setLatestVersion(0);
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
          this.assignee = Number(current.assignee);
          // const current = this.stepStatus[this.stepStatus.length - 1];
          // this.currentPoolUser = current.owner;
          // this.getCurrentPool();
          // if (this.fileDocsArray.fileResponse.status !== "APPROVED") {
          //   this.getWorkFLowUsers();
          // }
        }
      });
  }

  getStatusForBlocks() {
    if (this.fileDetails.errata) {
      const status = this.fileDetails.errata.map(x => x.status);
      if (status.includes('SUBMITTED')) {
        this.errataStatus = 'SUBMITTED';
      } else if (status.includes('WAITING_FOR_SUBMISSION')) {
        this.errataStatus = 'WAITING_FOR_SUBMISSION';
      }
    }
    if (this.fileDetails.bulletins) {
      const fileStatus = this.fileDetails.bulletins.map(x => x.fileStatus);
      if (fileStatus.includes('SUBMITTED')) {
        this.bulletinStatus = 'SUBMITTED';
      } 
      else{
        this.bulletinStatus = 'APPROVED';
      }
    }
    if (this.fileDetails.ballot) {
      const status = this.fileDetails.ballot.map(x => x.status);
      if (status.includes('SUBMITTED')) {
        this.ballotStatus = 'SUBMITTED';
      }
    }
    if (this.fileDetails.objections) {
      const status = this.fileDetails.objections.map(x => x.status);
      if (status.includes('LOB_PENDING')) {
        this.objStatus = 'LOB PENDING';
      }
    }
    if (this.fileDetails.clauseByClauseList) {
      const clauseStatus = this.fileDetails.clauseByClauseList.map(x => x.listStatus);
      if (clauseStatus.includes('SUBMITTED')) {
        this.clauseStatus = 'SUBMITTED';
      } else if (clauseStatus.includes('APPROVED')) {
        this.clauseStatus = 'APPROVED';
      } else if (clauseStatus.includes('PUBLISHED')) {
        this.clauseStatus = 'PUBLISHED';
      }
    }
    if (this.fileDetails.letter) {
      const status = this.fileDetails.letter.map(x => x.status);
      if (status.includes('SUBMITTED')) {
        this.letterStatus = 'SUBMITTED';
      }
    }
    if (this.fileDetails.pmbrScheduleLottingResultDTO) {
      const status = this.fileDetails.pmbrScheduleLottingResultDTO.map(x => x.status);
      if (status.includes('SUBMITTED')||status.includes('LOTTING_COMPLETED')) {
        this.resolutionBallotStatus = 'SUBMITTED';
      }
    }
    if (this.fileDetails.resolutions) {
      let status = this.fileDetails.resolutions.filter(x => x.status !== 'APPROVED');
      if(status.length > 0 ) {
        this.resolutionStatus = 'PENDING'
      } else {this.resolutionStatus = 'APPROVED'
    }
    }
    if (this.fileDetails.pmbrScheduleLottingResultDTO) {
      const status = this.fileDetails.pmbrScheduleLottingResultDTO.map(x => x.status);
      if (status.includes('SUBMITTED')||status.includes('LOTTING_COMPLETED')) {
        this.ballotResultStatus = 'SUBMITTED';
      }
    }
    if (this.fileDetails.pmbrSpeakerNoteDto) {
      const status = this.fileDetails.pmbrSpeakerNoteDto.map(x => x.status);
      if (status.includes('SUBMITTED')) {
        this.speakerNoteStatus = 'SUBMITTED';
      }
    }
    if (this.fileDetails.pmbrMemberReadingDto) {
      const status = this.fileDetails.pmbrMemberReadingDto.map(x => x.status);
      if (status.includes('SUBMITTED')) {
        this.memberReadingStatus = 'SUBMITTED';
      }
    }
  }

  getVersion() {

  }
  edit() {

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

  showContent(key) {
    // this.showBillContent = key;
    this.tabParams['showIndex'] = 1;
    this.tabParams['CurrentTab'] = key;
  }
  getWorkflowUsers(notesinfo) {
    if (notesinfo.status === 'SUBMITTED') {
      this.file.getWorkflowActionUsers(
        notesinfo.workflowId,
        notesinfo.fileId
      ).subscribe((Res: any) => {
        // this.workflowUsers = Res.filter(user => user.actionRow <= (Res.find(u => u.userId === this.userId).actionRow + 2));
        this.allWorkflowUsers = Res;
      });
    }
  }
  getAllNotes(id) {
    this.file.getAllNotes(id).subscribe(Response => {
      if (Response) {
        this.notesInfo.notes = Response;
      }
    });
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

  returnOwner(status) {
    if (status && status.owner) {
      if (status.owner.includes('_')) {
        return status.owner.split('_').join(' ').toLowerCase();
      } else {
        return status.owner.split(/(?=[A-Z])/).join(' ').toLowerCase();
      }
    } else if (status && !status.owner) {
      if (status.taskDefinitionKeyName.includes('_')) {
        return status.taskDefinitionKeyName.split('_').join(' ').toLowerCase();
      } else {
        return status.taskDefinitionKeyName.split(/(?=[A-Z])/).join(' ').toLowerCase();
      }
    }
  }

  setTabfilters() {
    this.showWonLetterTab = false;
    this.tabParams = {
      CurrentTab: false,
      showIndex: 0,
    };
  }
  getFile(e) {
    this.getFileByFileId(e);
  }
  addClass() {
    this.reportfullScreenMode = !this.reportfullScreenMode;
  }
  onCancel() {
    this.isEditPrio = false;
  }
  getBillFileById() {
    this.fileId = this.billfillId,
    this.userId = this.user.userId
    this.file.getBillFileById(this.fileId, this.userId ).subscribe((Res) => {
    this.billFileDetails = Res;
    this.logDetails = this.billFileDetails.fileResponse.logs;
    });
  }
  onPublished() {
    this.getBillFileById();
  }
  showRejectionLetterForm(fileId) {
      this.rejectionLetterForm = true;
  }

  showWonLetter(id) {
    if (id) {
      // this.pmbrCommonService
      //   .getCorrespondenceById(id, this.user.correspondenceCode.code)
      //   .subscribe((Res: any) => {
      //     this.letterContent = Res.data;
      //     this.showWonLetterTab = true;
      //     // this.tabParams['showIndex'] = 2;
      //   });
      this.router.navigate(['business-dashboard/correspondence/correspondence','view',id,]);
    }
  }
  
  hideLetterTab() {
    this.showWonLetterTab = false;
  }
  sendCorrespondence(details) {
    if(this.fileDetails.fileResponse.status === 'APPROVED'){
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "PM_RESOLUTION_LETTER_TO_DEPARTMENT",
          type: "PMBR",
          fileId: this.fileDetails.fileResponse.fileId,
          businessReferId: details.id,
          businessReferType: "PM_BILL",
          businessReferSubType: "PMBR",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: this.fileDetails.fileResponse.fileNumber,
          departmentId: details.departmentId,
          masterLetter: null,
          refrenceLetter: null,
          toCode: details.department,
          toDisplayName: details.department,
          toEditable: false
          // redirectToFile: true,
          // redirectToModule: 'BUDGET'
        },
      }
    );
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
  viewCorrespondence(id) {
    const data = this.isLetterAvailable(id);
    if (data) {
      // this.setTabfilters();
      this.showWonLetter(data.correspondenceId);
    }
  }
  isLetterAvailable(id) {
    const letters =  this.billFileDetails.letter;
    if (letters) {
      return letters.find(x=> x.businessId == id);
    }
    return false;
  }

  viewFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }
  viewNotice(event) {
    const noticeDetails = event.notices.find(n => n.noticeType == 'PMR_REQUEST')
    this.pmbrResolution.getNoticeById(noticeDetails.id).subscribe((res:any)=>{
      if(res) {
        this.noticeDetails = {
          billId: res.pmResolutionId,
          noticeId: res.id,
          noticeType: res.noticeType,
          billStatus: event.status
        }
        this.showNotice = true;
      }
    });
  }
  hidePopUp(e){
    this.showNotice = false;
  }
  noticeAvailable(event, type) {
      return event.some(n => n.noticeType == type);
  }
  isAssistant() {
    return (this.AuthService.getCurrentUser().authorities.includes('assistant'));
  }
// Edit resolution
  editResolution(resolutionId) {
    this.router.navigate(["business-dashboard/pmbr/create-resolution", resolutionId]);
  }
  //edit bill
  editBill(billId){
    this.router.navigate(["business-dashboard/pmbr/create", billId]);
  }
}
