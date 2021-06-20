import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { map } from 'rxjs/operators';
import { TranslationViewComponent } from '../../bill-full-view/translation-view/translation-view.component';
import { FileServiceService } from '../../shared/services/file-service.service';

@Component({
  selector: 'lib-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.css']
})
export class FileViewComponent implements OnInit {
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
  bulletinStatus = 'APPROVED';
  currentUser: any;
  ballotStatus = 'APPROVED';
  objStatus = 'LOB APPROVED';
  translationStatus ='APPROVED';
  isEditPrio: boolean;
  priority;
  clauseStatus = 'APPROVED';
  tabParams = {};
  reportfullScreenMode = false;
  ratificationStatus = null;
  sectionRole: any;
  assemblyid;
  sessionid;
  urlParams:any;
  constructor(
    private route: ActivatedRoute,
    @Inject('authService') private AuthService,
    private router: Router,
    private file: FileServiceService,
    private modalService: NzModalService,
  ) {
    // const id = this.route.snapshot.params.id;
    this.currentUser = AuthService.getCurrentUser();
    this.userId = AuthService.getCurrentUser().userId;
    // this.urlParams = this.router.getCurrentNavigation().extras.state;
    // const Id = this.route.snapshot.params.id;
    // console.log(Id);
    // this.getFileByFileId(Id);
    // this.fileId=Id;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      // this.assemblyid=params.assemblyId;
      // this.sessionid=params.sessionId;
      //  const Id = this.route.snapshot.params.id;
      this.getFileByFileId(this.fileId);
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
        this.assignee = current.assignee;
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
      const status = this.fileDetails.bulletins.map(x => x.fileStatus);
      if (status.includes('SUBMITTED')) {
        this.bulletinStatus = 'SUBMITTED';
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
    if (this.fileDetails.translations) {
      const status = this.fileDetails.translations.map(x => x.status);
      if (status.includes('SUBMITTED')) {
        this.translationStatus = 'SUBMITTED';
      }
    }
    if (this.fileDetails.clauseByClauseList) {
      const clauseStatus = this.fileDetails.clauseByClauseList.map(x => x.listStatus);
      if (clauseStatus.includes('SUBMITTED')) {
        this.clauseStatus = 'SUBMITTED';
      } else if (clauseStatus.includes('APPROVED')) {
        this.clauseStatus = 'APPROVED';
      } else if (clauseStatus.includes('PUBLISHED'))  {
        this.clauseStatus = 'PUBLISHED';
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
    if (notesinfo.status !== 'APPROVED') {
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
        const notes = Response as any;
        this.notesInfo.notes = notes.filter(x => x.status === 'SAVED' || x.status == null || (x.status == 'DRAFT' && x.userId == this.currentUser.userId));
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
  downloadTranlatedBill(data){
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", data);
    link.setAttribute("download", data);
    document.body.appendChild(link);
    link.click();
  }
  previewTranslation(data){
    this.modalService.create({
      nzContent: TranslationViewComponent,
      nzWidth: "1000",
      nzFooter: null,
      nzTitle: '',
      nzClosable: true,
      nzComponentParams: {
        transData: data
      },
    });
  }

  editTranslation(data){
    this.modalService.create({
      nzContent: TranslationViewComponent,
      nzWidth: "1000",
      nzFooter: null,
      nzTitle: '',
      nzClosable: true,
      nzComponentParams: {
        transData: data,
        billDetails: this.fileDetails.bill,
        editDetails: true
      },
    });
  }

  viewFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }
}
