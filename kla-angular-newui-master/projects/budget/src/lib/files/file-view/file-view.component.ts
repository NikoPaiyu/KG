import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FileServiceService } from '../../shared/services/file-service.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { DomSanitizer } from "@angular/platform-browser";
import { BudgetCommonService } from "../../shared/services/budgetcommon.service";
import { BudgetDocumentService } from "../../shared/services/budget-document.service";

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
  letterContent;
  fileDetails: any = null;
  latestNote: any = null;
  currentUser: any;
  isEditPrio: boolean;
  priority;
  tabParams = {};
  reportfullScreenMode = false;
  ratificationStatus = null;
  sectionRole: any;
  memberCodes = [];
  correspondenceId;
  replyLetter;
  budgetdocreplyletterDto;
  budgetDocId;
  budgetdocuments;
  document;
  validatePasswd = {
    showModal: false,
    key: null
  }
  constructor(
    private route: ActivatedRoute,
    @Inject('authService') private auth,
    private router: Router,
    private file: FileServiceService,
    private notify: NzNotificationService,
    private sanitizer: DomSanitizer,
    public common: BudgetCommonService,
    private BDservcie: BudgetDocumentService,
  ) {
    this.currentUser = auth.getCurrentUser();
    this.userId = auth.getCurrentUser().userId;
    this.common.setBudgetPermissions(auth.getCurrentUser().rbsPermissions);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      this.getFileByFileId(this.fileId);
    });
  }
  getFileByFileId(fileId) {
    this.setTabfilters();
    this.fileDetails = null;
    this.file.getFileById(fileId, this.userId).subscribe((Response) => {
      if (Response) {
        this.fileDetails = Response;
        this.getbudgetdocdetails(this.fileDetails);
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
        this.handlePDFUrl();
        this.getbudgetdocdetails(this.fileDetails);
        this.getMemberCode();
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
  getbudgetdocdetails(fileDetails) {
    if (fileDetails.budgetDocumentReplyLetter) {
      this.correspondenceId = fileDetails.budgetDocumentReplyLetter[0].correspondenceId;
      this.getCorrespondenceById(this.correspondenceId);
    }
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

  showCurrentTab(key, canEdit) {
    if (key == 'budgetDocument' || key == 'budgetSpeech') {
      this.validatePasswd.key = key;
      this.validatePasswd.showModal = true;
      return;
    }
    this.tabParams['showIndex'] = 1;
    this.tabParams['showBtn'] = canEdit;
    this.tabParams['CurrentTab'] = key;
    this.checkIfLetter();
  }
  getWorkflowUsers(notesinfo) {
    if (notesinfo.status !== 'APPROVED') {
      this.file.getWorkflowActionUsers(
        notesinfo.workflowId,
        notesinfo.fileId
      ).subscribe((Res: any) => {
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
    this.tabParams = {
      CurrentTab: "",
      showIndex: 0,
      timeAllocation: {}
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
  reloadFileDetails() {
    this.getFileByFileId(this.fileId);
  }
  viewCorrespondence(id) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      id,
    ]);
  }
  handlePDFUrl() {
    if (this.fileDetails) {
      if (this.fileDetails['budgetSpeech'] && this.fileDetails['budgetSpeech'][0]) {
        let budgetUrl = this.fileDetails['budgetSpeech'][0].budgetUrl;
        this.fileDetails['budgetSpeech'][0].budgetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(budgetUrl);
        console.log(budgetUrl)
      }
    }
  }
  getCorrespondenceById(id) {
    if (id) {
      this.common
        .getCorrespondenceById(id, this.currentUser.correspondenceCode.code)
        .subscribe((Res: any) => {
          this.replyLetter = Res;
          this.letterContent = Res.data;
        });
    }
  }
  getbudgetdocuments(Id) {
    if (Id) {
      this.BDservcie
        .getbudgetDocById(Id)
        .subscribe((Res: any) => {
          this.budgetdocuments = Res;
          this.document = Res.data
          console.log('see here', this.budgetdocuments)
          // this.replyLetter = Res;
          // this.letterContent = Res.data;
        });
    }
  }


  checkIfLetter() {
    switch (this.tabParams['CurrentTab']) {
      case 'budgetDocumentLetter':
        if (this.fileDetails['budgetDocumentLetter'] && this.fileDetails['budgetDocumentLetter'][0]) {
          this.correspondenceId = this.fileDetails['budgetDocumentLetter'][0].correspondenceId
        }
        break;
      case 'budgetDocumentReplyLetter':
        if (this.fileDetails['budgetDocumentReplyLetter'] && this.fileDetails['budgetDocumentReplyLetter'][0]) {
          this.correspondenceId = this.fileDetails['budgetDocumentReplyLetter'][0].budgetDocumentRequestLetter.correspondenceId
        }
        break;
      case 'sdfgLetterResponse':
        if (this.fileDetails['sdfgLetterResponse'] && this.fileDetails['sdfgLetterResponse'][0]) {
          this.correspondenceId = this.fileDetails['sdfgLetterResponse'][0].correspondenceId
        }
        break;
      case 'budgetSDFGLetter':
        if (this.fileDetails['budgetSDFGLetter'] && this.fileDetails['budgetSDFGLetter'][0]) {
          this.correspondenceId = this.fileDetails['budgetSDFGLetter'][0].correspondenceId
        }
        break;
        case 'budgetVOALetter':
          if (this.fileDetails['budgetVOALetter'] && this.fileDetails['budgetVOALetter'][0]) {
            this.correspondenceId = this.fileDetails['budgetVOALetter'][0].correspondenceId
          }
          break;
          case 'voaLetterResponse':
        if (this.fileDetails['voaLetterResponse'] && this.fileDetails['voaLetterResponse'][0]) {
          this.correspondenceId = this.fileDetails['voaLetterResponse'][0].correspondenceId
        }
        break;
      case 'budgetDocumentGRLRequestLetter':
        if (this.fileDetails['budgetDocumentGRLRequestLetter'] && this.fileDetails['budgetDocumentGRLRequestLetter'][0]) {
          this.correspondenceId = this.fileDetails['budgetDocumentGRLRequestLetter'][0].correspondenceId
        }
        break;

      case 'budgetDocumentGRLReplyLetter':
        if (this.fileDetails['budgetDocumentGRLReplyLetter'] && this.fileDetails['budgetDocumentGRLReplyLetter'][0]) {
          this.correspondenceId = this.fileDetails['budgetDocumentGRLReplyLetter'][0].correspondenceId
        }
        break;

      case 'budgetDocument':
        if (this.fileDetails['budgetDocument'] && this.fileDetails['budgetDocument'][0]) {
          this.budgetDocId = this.fileDetails['budgetDocument'][0].id
        }
        break;

      default:
        break;
    }
    if (this.correspondenceId) {
      this.getCorrespondenceById(this.correspondenceId);
    }
    if (this.budgetDocId) {
      // this.getbudgetdocuments(this.budgetDocId);
    }
  }
  draftAPbillCorrespondence() {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "BUDGET_AP_BILL_REQUEST",
          type: "BUDGET",
          fileId: this.fileDetails.fileResponse.fileId,
          businessReferId: this.fileDetails['budgetSpeech'][0].budgetDoc.id,
          businessReferType: "BUDGET",
          businessReferSubType: "BUDGET",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: this.fileDetails.fileResponse.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: this.memberCodes,
          toDisplayName: this.memberCodes,
          toEditable: true,
          // redirectToFile: true,
          // redirectToModule: 'BUDGET'
        },
      }
    );
  }
  getMemberCode() {
    let type = 'DEPARTMENT'
    this.common
      .getAllCode(type)
      .subscribe((Res: any) => {
        let deptCode = Res.filter(x => x.code == 'FINANCE');
        this.memberCodes = deptCode;
      });
  }
  getUrls(event) {
    debugger;
    if (event) {
      if (this.validatePasswd.key == 'budgetDocument') {
        this.budgetdocuments = event
        this.tabParams['CurrentTab'] = this.validatePasswd.key;
        this.tabParams['showIndex'] = 1;
      } else {
        this.fileDetails['budgetSpeech'][0].budgetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(event[0].docUrl);;
        this.tabParams['CurrentTab'] = this.validatePasswd.key;
        this.tabParams['showIndex'] = 1;
      }
    }
    this.validatePasswd.showModal = false
  }
  checkAppropriationRequest() {
    if (this.fileDetails && this.fileDetails.budgetAppropriationRequests != null) {
      this.tabParams['apReqTab'] = 'budgetAppropriationRequests'
      this.tabParams['apTabTitle'] = 'Request Letter for Appropriation Bill on Budget '
      return true;
    }
    if (this.fileDetails && this.fileDetails.sdgAppropriationRequests != null) {
      this.tabParams['apReqTab'] = 'sdgAppropriationRequests'
      this.tabParams['apTabTitle'] = 'Request Letter for Appropriation Bill on SDG'
      return true;
    }
    if (this.fileDetails && this.fileDetails.voaAppropriationRequests != null) {
      this.tabParams['apReqTab'] = 'voaAppropriationRequests'
      this.tabParams['apTabTitle'] = 'Request Letter for Appropriation Bill on VOA'
      return true;
    }
    return false
  }
  checkAppropriationResponse() {
    if (this.fileDetails && this.fileDetails.budgetAppropriationResponses != null) {
      this.tabParams['apResponseTab'] = 'budgetAppropriationResponses'
      this.tabParams['apTabTitle'] = 'Reply Letter on Appropriation Bill on Budget'
      return true;
    }
    if (this.fileDetails && this.fileDetails.voaAppropriationResponses != null) {
      this.tabParams['apResponseTab'] = 'voaAppropriationResponses'
      this.tabParams['apTabTitle'] = 'Reply Letter on Appropriation Bill on VOA'
      return true;
    }
    if (this.fileDetails && this.fileDetails.sdgAppropriationResponses != null) {
      this.tabParams['apResponseTab'] = 'sdgAppropriationResponses'
      this.tabParams['apTabTitle'] = 'Reply Letter on Appropriation Bill on SDG'
      return true;
    }
    return false
  }
  isTimeAllocationReq() {
    let status = true;
    switch (this.tabParams['CurrentTab']) {
      case 'budgetTimeAllocationBudgetSpeech':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationBudgetSpeech'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationBudgetSpeech'][0].masterId;
        break;
      case 'budgetTimeAllocationCutMotion':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationCutMotion'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationCutMotion'][0].masterId;
        break;
      case 'budgetTimeAllocationForSdgEg':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationForSdgEg'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationForSdgEg'][0].masterId;
        break;
      case 'budgetTimeAllocationApBillOnBudget':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationApBillOnBudget'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationApBillOnBudget'][0].masterId;
        break;
      case 'budgetTimeAllocationApBillOnSdg':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationApBillOnSdg'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationApBillOnSdg'][0].masterId;
        break;
      case 'budgetTimeAllocationApBillOnVoa':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationApBillOnVoa'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationApBillOnVoa'][0].masterId;
        break;
      default:
        status = false;
        break;
    }
    return status;
  }
  isTimeAllocationRes() {
    let status = true;
    switch (this.tabParams['CurrentTab']) {
      case 'budgetTimeAllocationBudgetSpeechResponse':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationBudgetSpeechResponse'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationBudgetSpeechResponse'][0].masterId;
        break;
      case 'budgetTimeAllocationCutMotionResponse':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationCutMotionResponse'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationCutMotionResponse'][0].masterId;
        break;
      case 'budgetTimeAllocationForSdgEgResponse':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationForSdgEgResponse'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationForSdgEgResponse'][0].masterId;
        break;
      case 'budgetTimeAllocationApBillOnBudgetResponse':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationApBillOnBudgetResponse'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationApBillOnBudgetResponse'][0].masterId;
        break;
      case 'budgetTimeAllocationApBillOnSdgResponse':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationApBillOnSdgResponse'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationApBillOnSdgResponse'][0].masterId;
        break;
      case 'budgetTimeAllocationApBillOnVoaResponse':
        this.tabParams['timeAllocation'].type = this.fileDetails['budgetTimeAllocationApBillOnVoaResponse'][0].type;
        this.tabParams['timeAllocation'].masterId = this.fileDetails['budgetTimeAllocationApBillOnVoaResponse'][0].masterId;
        break;
      default:
        status = false;
        break;
    }
    return status;
  }

  viewSubFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }
}

