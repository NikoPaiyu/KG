import { Component, OnInit, Inject } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { CorrespondenceService } from '../shared/services/correspondence.service';

@Component({
  selector: "correspondence-correspondence-list",
  templateUrl: "./correspondence-list.component.html",
  styleUrls: ["./correspondence-list.component.scss"],
})
export class CorrespondenceListComponent implements OnInit {
  currespondenceList: any;
  selectedCurrespondenceDetails;
  tempCurrespondenceList: any;
  searchParam: string;
  viewContent = "";
  modelLetterView = false;
  modelUplaod = false;
  uploadURL = this.correspondenceService.uploadUrl();
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
    private router: Router,
    private notification: NzNotificationService,
    private correspondenceService: CorrespondenceService,
    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    this.correspondenceService.getCorrespondencePermissions(this.user.rbsPermissions);
    this.code = this.user.correspondenceCode.code;
    const urlParams = this.router.getCurrentNavigation().extras.state;
    if (urlParams) {
      this.tabIndex = urlParams.Index;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadPermissions();
    }, 500);
  }

  getDeptuser() {
    this.correspondenceService
      .getDeptUser(this.user.userId)
      .subscribe((Res) => {
        this.deptUser = Res;
        this.getCurrespondence();
      });
  }

  getCurrespondence() {
    this.correspondenceService
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
      this.correspondenceService.uploadDocuments(body).subscribe((res) => {
        this.modelUplaod = false;
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
        if (
          this.selectedCurrespondenceDetails.businessCode === "DELAY_STATEMENT"
        ) {
          this.uploadedFile.push({
            name: info.file.name,
            attachmentUrl: info.file.response.body,
            isMainDocument: false,
            isDelayStatement: true,
            isStatementAsPerRule: false,
            currentNumber: null,
            isCorrection: false,
          });
        } else {
          this.uploadedFile.push({
            name: info.file.name,
            attachmentUrl: info.file.response.body,
            isMainDocument: false,
            isDelayStatement: false,
            isStatementAsPerRule: false,
            currentNumber: null,
            isCorrection: true,
          });
        }
      }
    }
  }
  viewDocumentDetails(id) {
    // this.router.navigate(['business-dashboard/cpl/cpl-view', 'view', id]);
  }
  handleCancel() {
    this.modelLetterView = false;
    this.modelUplaod = false;
    this.delayDoc = [];
    this.uploadedFile = [];
    this.selectedCurrespondenceDetails = {};
  }
  showLetterView(data) {
    this.modelLetterView = true;
    this.viewContent = data;
  }
  showUpoadModel(data) {
    this.modelUplaod = true;
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
      this.correspondenceService.doIHaveCorrespondenceAccess(
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

  viewCorrespondence(workflowMandatory, id) {
    if (workflowMandatory) {
      this.router.navigate(
        ["business-dashboard/correspondence/correspondence-workflow", id],
        {
          state: {
            Index: this.tabIndex,
          },
        }
      );
    } else {
      this.router.navigate(
        ["business-dashboard/correspondence/correspondence", "view", id],
        {
          state: {
            Index: this.tabIndex,
          },
        }
      );
    }
  }

  replyLetter(data) {
    
    let letterBusiness;
    if (data.businessCode === "CORRECTION_STATEMENT_REQUEST") {
      letterBusiness = "CORRECTION_STATEMENT_RESPONSE";
    } else if (data.businessCode === "COMMITEE_REQUEST_NOMINEES") {
      let toPpoData = data.toCode.find(
        (element) => element.toCode == this.code.toString()
      );
      if (toPpoData && !toPpoData.isReplaied && !toPpoData.actionRequired) {
        letterBusiness = "COMMITTEE_NOMINEE_SUBMISSION";
      } else {
        letterBusiness = "NO_BUSINESS";
      }
    } else if (
      data.businessCode === "COMMITTEE_MEETING_SUPPORTING_DOCUMENT_REQUEST"
    ) {
      let deptData = data.toCode.find(
        (element) => element.toCode == this.code.toString()
      );
      if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
        letterBusiness = "COMMITTEE_MEETING_SUPPORTING_DOCUMENT_RESPONSE";
      } else {
        letterBusiness = "NO_BUSINESS";
      }
    } else if (
      data.businessCode === "BUDGET_AP_BILL_REQUEST"
    ) {
      let deptData = data.toCode.find(
        (element) => element.toCode == this.code.toString()
      );
      if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
        letterBusiness = "BUDGET_AP_BILL_RESPONSE";
      } else {
        letterBusiness = "NO_BUSINESS";
      }
    }else if (
      data.businessCode === "VOA_AP_BILL_REQUEST"
    ) {
      let deptData = data.toCode.find(
        (element) => element.toCode == this.code.toString()
      );
      if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
        letterBusiness = "VOA_AP_BILL_RESPONSE";
      } else {
        letterBusiness = "NO_BUSINESS";
      }
    }else if (
      data.businessCode === "SDG_AP_BILL_REQUEST"
    ) {
      let deptData = data.toCode.find(
        (element) => element.toCode == this.code.toString()
      );
      if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
        letterBusiness = "SDG_AP_BILL_RESPONSE";
      } else {
        letterBusiness = "NO_BUSINESS";
      }
    }else if (
      data.businessCode === "BUDGET_SDG_EG_REQUEST_LETTER"
    ) {
      let deptData = data.toCode.find(
        (element) => element.toCode == this.code.toString()
      );
      if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
        letterBusiness = "BUDGET_SDG_EG_REPLY_LETTER";
      } else {
        letterBusiness = "NO_BUSINESS";
      }
    }else if (
      data.businessCode === "SDG_EG_TIME_ALLOCATION_LETTER"
    ) {
      let deptData = data.toCode.find(
        (element) => element.toCode == this.code.toString()
      );
      if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
        letterBusiness = "SDG_EG_TIME_ALLOCATION_RESPONSE";
      } else {
        letterBusiness = "NO_BUSINESS";
      }
    }else if (
      data.businessCode === "TABLE_BUSINESS_TIME_ALLOCATION"
    ) {
      let deptData = data.toCode.find(
        (element) => element.toCode == this.code.toString()
      );
      if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
        letterBusiness = "TABLE_BUSINESS_TIME_ALLOCATION_RESPONSE";
      } else {
        letterBusiness = "NO_BUSINESS";
      }
    }
    else if (
      data.businessCode === "TABLE_CORRESPONDANCE_LAW_DEPT"
      || data.businessCode === "TABLE_TIME_ALLOCATION"
      || data.businessCode === "BUDGET_TIME_ALLOCATION_BUDGET_SPEECH"
      || data.businessCode === "BUDGET_TIME_ALLOCATION_CUT_MOTION"
      || data.businessCode === "BUDGET_TIME_ALLOCATION_AP_BILL_ON_BUDGET"
      || data.businessCode === "BUDGET_TIME_ALLOCATION_AP_BILL_ON_SDG"
      || data.businessCode === "BUDGET_TIME_ALLOCATION_AP_BILL_ON_VOA"
    ) {
      letterBusiness = this.handleGoverNorsADressetters(data, letterBusiness);
    }
    
    else if (
      data.businessCode === "BUDGET_DOCUMENT_LETTER" 
    ) {
      letterBusiness = "BUDGET_DOCUMENT_REPLY_LETTER" ;
    }
    else if (
      data.businessCode === "BUDGET_SDFG_LETTER" 
    ) {
      letterBusiness = "BUDGET_SDFG_LETTER_RESPONSE" ;
    }
    else if (
      data.businessCode === "BUDGET_VOA_LETTER" 
    ) {
      letterBusiness = "BUDGET_VOA_LETTER_RESPONSE" ;
    }
    else if (
      data.businessCode === "BUDGET_DOCUMENT_GRL_REQUEST_LETTER" 
    ) {
      letterBusiness = "BUDGET_DOCUMENT_GRL_REPLY_LETTER" ;
    }

    else {
      letterBusiness = "NO_BUSINESS";
    }
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
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
          toDisplayName: data.fromDisplayName,
        },
      }
    );
  }

  showReference(id, businessCode, businessReferType) {
    // if (businessCode === 'AMENDMENT') {
    //   this.router.navigate(['business-dashboard/cpl/amendment-view', id]);
    // } else {
    //   this.router.navigate(['business-dashboard/cpl/cpl-view', 'view', id]);
    // }
    if (businessReferType === "BILL") {
      this.router.navigate(["business-dashboard/bill/bill-view", id]);
    } else if (businessReferType === 'PRIORITY_LIST') {
      this.router.navigate([
        'business-dashboard/bill/view-priority-list',
        id
       ]);
    }
  }
  handleGoverNorsADressetters(data, letterBusiness) {
    let deptData;
    switch (data.businessCode) {
      case "TABLE_CORRESPONDANCE_LAW_DEPT":
        deptData = data.toCode.find(
          (element) => element.toCode == this.code.toString()
        );
        if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
          letterBusiness = "TABLE_GOVERNORS_SPEECH";
        } else {
          letterBusiness = "NO_BUSINESS";
        }
        break;
      case "TABLE_TIME_ALLOCATION":
        deptData = data.toCode.find(
          (element) => element.toCode == this.code.toString()
        );
        if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
          letterBusiness = "TABLE_TIME_ALLOCATION_RESPONSE";
        } else {
          letterBusiness = "NO_BUSINESS";
        }
        break;
      case "BUDGET_TIME_ALLOCATION_BUDGET_SPEECH":
        deptData = data.toCode.find(
          (element) => element.toCode == this.code.toString()
        );
        if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
          letterBusiness = "BUDGET_TIME_ALLOCATION_BUDGET_SPEECH_RESPONSE";
        } else {
          letterBusiness = "NO_BUSINESS";
        }
        break;
        case "BUDGET_TIME_ALLOCATION_CUT_MOTION":
          deptData = data.toCode.find(
            (element) => element.toCode == this.code.toString()
          );
          if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
            letterBusiness = "BUDGET_TIME_ALLOCATION_CUT_MOTION_RESPONSE";
          } else {
            letterBusiness = "NO_BUSINESS";
          }
          break;
      case "BUDGET_TIME_ALLOCATION_AP_BILL_ON_BUDGET":
        deptData = data.toCode.find(
          (element) => element.toCode == this.code.toString()
        );
        if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
          letterBusiness = "BUDGET_TIME_ALLOCATION_AP_BILL_ON_BUDGET_RESPONSE";
        } else {
          letterBusiness = "NO_BUSINESS";
        }
        break;
      case "BUDGET_TIME_ALLOCATION_AP_BILL_ON_SDG":
        deptData = data.toCode.find(
          (element) => element.toCode == this.code.toString()
        );
        if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
          letterBusiness = "BUDGET_TIME_ALLOCATION_AP_BILL_ON_SDG_RESPONSE";
        } else {
          letterBusiness = "NO_BUSINESS";
        }
        break;
      case "BUDGET_TIME_ALLOCATION_AP_BILL_ON_VOA":
        deptData = data.toCode.find(
          (element) => element.toCode == this.code.toString()
        );
        if (deptData && !deptData.isReplaied && !deptData.actionRequired) {
          letterBusiness = "BUDGET_TIME_ALLOCATION_AP_BILL_ON_VOA_RESPONSE";
        } else {
          letterBusiness = "NO_BUSINESS";
        }
        break;
      default:
        break;
    }
    return letterBusiness;
  }
}
