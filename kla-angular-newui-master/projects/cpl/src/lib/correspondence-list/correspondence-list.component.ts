import { Component, OnInit, Inject } from "@angular/core";
import { FilesService } from "../shared/services/files.service";
import { UploadChangeParam, NzNotificationService } from "ng-zorro-antd";
import { DocumentsService } from "../shared/services/documents.service";
import { Router } from "@angular/router";
import { CurrespondenceService } from "../shared/services/currespondence.service";
import { CommonService } from "../shared/services/common.service";

@Component({
  selector: "cpl-correspondence-list",
  templateUrl: "./correspondence-list.component.html",
  styleUrls: ["./correspondence-list.component.css"],
})
export class CorrespondenceListComponent implements OnInit {
  currespondenceList: any;
  selectedCurrespondenceDetails;
  tempCurrespondenceList: any;
  searchParam: string;
  viewContent = "";
  model_LetterView = false;
  model_Uplaod = false;
  uploadURL = this.docService.uploadUrl();
  uploadedFile = [];
  delayDoc = [];
  deptUser: any;
  user: any;
  pendingCorrespondence: any;
  tempPendingCorrespondence: any;
  sentCorrespondence: any;
  tempSentCorrespondence: any;
  inboxCorrespondence: any;
  tempInboxCorrespondence: any;
  outboxCorrespondence: any;
  tempOutboxCorrespondence: any;
  searchPendingParam: any;
  searchSentParam: any;
  searchInboxParam: any;
  searchOutboxParam: any;
  pendingTab = false;
  showTabs = false;
  code: any;
  tabIndex: any = 0;

  constructor(
    private fileDervice: FilesService,
    private docService: DocumentsService,
    private router: Router,
    private notification: NzNotificationService,
    private correspondenceService: CurrespondenceService,
    private commonService: CommonService,
    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    this.code = this.user.correspondenceCode.code;
    const urlParams = this.router.getCurrentNavigation().extras.state;
    if (urlParams) {
      this.tabIndex = urlParams.Index;
    }
    // if (this.user.authorities.includes('Department')) {
    //   this.code = 'GENERAL_ADMINISTRATION';
    // } else {
    //   this.code = 'CPL_SECTION';
    // }
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadPermissions();
    }, 500);
  }
  getDeptuser() {
    this.docService.getDeptUser(this.user.userId).subscribe((Res) => {
      this.deptUser = Res;
      this.getCurrespondence();
    });
  }

  getCurrespondence() {
    this.fileDervice
      .getCorrespondenceDepartmentrecieved(
        this.deptUser.data.details.departmentId
      )
      .subscribe((res) => {
        this.currespondenceList = res;
        this.tempCurrespondenceList = res;
      });
  }
  search() {
    // if (this.searchParam) {
    //   this.currespondenceList = this.tempCurrespondenceList.filter(
    //     (element) =>
    //       (element.fromType &&
    //         element.fromType
    //           .toLowerCase()
    //           .includes(this.searchParam.toLowerCase())) ||
    //       (element.referSubType &&
    //         element.referSubType
    //           .toLowerCase()
    //           .includes(this.searchParam.toLowerCase()))
    //   );
    // } else {
    //   this.currespondenceList = this.tempCurrespondenceList;
    // }
  }
  uploadDocument() {
    if (this.uploadedFile.length > 0) {
      const body = {
        correspondenceId: this.selectedCurrespondenceDetails.id,
        referId: this.selectedCurrespondenceDetails.businessReferId,
        attachments: this.uploadedFile,
      };
      this.fileDervice.uploadDocuments(body).subscribe((res) => {
        this.model_Uplaod = false;
        this.getInbox();
        this.selectedCurrespondenceDetails = {};
        this.uploadedFile = [];
        this.delayDoc = [];
        this.handleCancel();
        this.notification.success("Success", "Uploaded successfully..");
      });
    } else {
      this.notification.info("Info", "Please upload file..");
    }
  }
  handleDelayChange(info: UploadChangeParam): void {
    const currentFile = info.fileList;
    this.uploadedFile = [];
    if (info.file.response) {
      for (const file of currentFile) {
        if (this.selectedCurrespondenceDetails.businessCode === 'DELAY_STATEMENT') {
          this.uploadedFile.push({
            name: info.file.name,
            attachmentUrl: info.file.response.body,
            isMainDocument: false,
            isDelayStatement: true,
            isStatementAsPerRule: false,
            currentNumber: null,
            isCorrection: false
          });
        } else {
          this.uploadedFile.push({
            name: info.file.name,
            attachmentUrl: info.file.response.body,
            isMainDocument: false,
            isDelayStatement: false,
            isStatementAsPerRule: false,
            currentNumber: null,
            isCorrection: true
          });
        }
      }
    }
  }
  viewDocumentDetails(id) {
    this.router.navigate(["business-dashboard/cpl/cpl-view", "view", id]);
  }
  handleCancel() {
    this.model_LetterView = false;
    this.model_Uplaod = false;
    this.delayDoc = [];
    this.uploadedFile = [];
    this.selectedCurrespondenceDetails = {};
  }
  showLetterView(data) {
    this.model_LetterView = true;
    this.viewContent = data;
  }
  showUpoadModel(data) {
    this.model_Uplaod = true;
    this.selectedCurrespondenceDetails = data;
  }

  getPendingCorrespondence() {
    this.correspondenceService.getPending(this.user.userId).subscribe((Res) => {
      this.pendingCorrespondence = Res;
      this.tempPendingCorrespondence = this.pendingCorrespondence;
    });
  }

  getSent() {
    this.correspondenceService.getSent(this.code).subscribe((Res) => {
      this.sentCorrespondence = Res;
      this.tempSentCorrespondence = this.sentCorrespondence;
    });
  }

  getInbox() {
    this.correspondenceService.getInbox(this.code).subscribe((Res) => {
      this.inboxCorrespondence = Res;
      this.tempInboxCorrespondence = this.inboxCorrespondence;
    });
  }

  getOutbox() {
    this.correspondenceService.getOutbox(this.code).subscribe((Res) => {
      this.outboxCorrespondence = Res;
      this.tempOutboxCorrespondence = this.outboxCorrespondence;
    });
  }

  searchPending() {
    if (this.searchPendingParam) {
      this.pendingCorrespondence = this.tempPendingCorrespondence.filter(
        (element) =>
          (element.fromDisplayName &&
            element.fromDisplayName
              .toLowerCase()
              .includes(this.searchPendingParam.toLowerCase())) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchPendingParam.toLowerCase()))
      );
    } else {
      this.pendingCorrespondence = this.tempPendingCorrespondence;
    }
  }

  searchSent() {
    if (this.searchSentParam) {
      this.sentCorrespondence = this.tempSentCorrespondence.filter(
        (element) =>
          (element.fromDisplayName &&
            element.fromDisplayName
              .toLowerCase()
              .includes(this.searchSentParam.toLowerCase())) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchSentParam.toLowerCase()))
      );
    } else {
      this.sentCorrespondence = this.tempSentCorrespondence;
    }
  }

  searchInbox() {
    if (this.searchInboxParam) {
      this.inboxCorrespondence = this.tempInboxCorrespondence.filter(
        (element) =>
          (element.fromDisplayName &&
            element.fromDisplayName
              .toLowerCase()
              .includes(this.searchInboxParam.toLowerCase())) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchInboxParam.toLowerCase()))
      );
    } else {
      this.inboxCorrespondence = this.tempInboxCorrespondence;
    }
  }

  searchOutbox() {
    if (this.searchOutboxParam) {
      this.outboxCorrespondence = this.tempOutboxCorrespondence.filter(
        (element) =>
          (element.fromDisplayName &&
            element.fromDisplayName
              .toLowerCase()
              .includes(this.searchOutboxParam.toLowerCase())) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchOutboxParam.toLowerCase()))
      );
    } else {
      this.outboxCorrespondence = this.tempOutboxCorrespondence;
    }
  }

  loadPermissions() {
    if (
      this.commonService.doIHaveCorrespondenceAccess(
        "PENDING_CORRESPONDENCE",
        "READ"
      )
    ) {
      this.pendingTab = true;
      this.getPendingCorrespondence();
      if (this.tabIndex === 1) {
        this.getInbox();
      } else if (this.tabIndex === 2) {
        this.getSent();
      } else if (this.tabIndex === 3) {
        this.getOutbox();
      }
    } else {
      this.getInbox();
      if (this.tabIndex === 1) {
        this.getSent();
      } else if (this.tabIndex === 2) {
        this.getOutbox();
      }
    }
    this.showTabs = true;
  }

  viewCorrespondence(workflowMandatory, id,) {
    if (workflowMandatory) {
      this.router.navigate([
        "business-dashboard/cpl/correspondence-workflow",
        id,
      ], {
        state: {
          Index: this.tabIndex
        }});
    } else {
      this.router.navigate([
        "business-dashboard/cpl/correspondence",
        "view",
        id,
      ], {
        state: {
          Index: this.tabIndex
      }});
    }
  }

  replyLetter(data) {
    let letterBusiness;
    if (data.businessCode === 'CORRECTION_STATEMENT_REQUEST') {
      letterBusiness = 'CORRECTION_STATEMENT_RESPONSE';
    } else {
      letterBusiness = 'NO_BUSINESS';
    }
    this.router.navigate(['business-dashboard/cpl/select-template'], {
      state: {
        business: letterBusiness,
        type: this.user.correspondenceCode.code,
        fileId: data.fileId,
        businessReferId: data.businessReferId,
        businessReferType: data.businessReferType,
        businessReferSubType: data.businessReferSubType,
        businessReferNumber: data.typeNumber,
        fileNumber: data.fileNumber,
        departmentId: null,
        masterLetter: data.masterLetter,
        refrenceLetter: data.id,
        toCode: data.fromCode,
        toDisplayName: data.fromDisplayName
      },
    });
  }

  showReference(id, businessCode) {
    if (businessCode === 'AMENDMENT') {
      this.router.navigate(['business-dashboard/cpl/amendment-view', id]);
    } else {
      this.router.navigate(['business-dashboard/cpl/cpl-view', 'view', id]);
    }
  }

  // showAmendList(fileId) {
  //   this.router.navigate(['business-dashboard/cpl/amendment-list-view', fileId]);
  // }
}
