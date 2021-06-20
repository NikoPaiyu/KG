import { Component, OnInit, Inject } from "@angular/core";
import { DocumentsService } from "../shared/services/documents.service";
import { NzNotificationService } from "ng-zorro-antd";
import { CommonService } from "../shared/services/common.service";
import { forkJoin, of, interval } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: "cpl-doc-amendments",
  templateUrl: "./doc-amendments.component.html",
  styleUrls: ["./doc-amendments.component.css"],
})
export class DocAmendmentsComponent implements OnInit {
  amendMentList: any;
  tempAmendmentList: any;
  searchParam: string;
  docUrl = "";
  isVisible = false;
  user: any;
  acceptReject = false;
  checkbox = false;
  setOfCheckedId = new Set<any>();
  documentId: any;
  assemblyId;
  sessionId;
  desc = '';
  subject = '';
  priority = '';
  hide = false;
  isAttachVisible = false;
  fileNumType;
  radioValue;
  assemblyList: any = [];
  sessionList: any = [];
  maxNumber;
  maxValue;
  cplSectionId;
  pendingAmendments: any = [];
  tempPendingAmendments: any = [];
  pendingParam: any;
  amendmentInform = false;
  
  constructor(
    private documentApi: DocumentsService,
    private notification: NzNotificationService,
    private commonService: CommonService,
    private router: Router,
    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    this.cplSectionId = this.commonService.getSectionId();
  }

  ngOnInit() {
    forkJoin(
      this.documentApi.getAllAssembly(),
      this.documentApi.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblyList = assembly;
      const res = this.assemblyList.map(x => x.id);
      this.maxNumber = Math.max.apply(null, res);
      this.assemblyId = this.maxNumber;
      this.sessionList = session;
      const result = this.sessionList.map(x => x.id);
      this.maxValue = Math.max.apply(null, result);
      this.sessionId = this.maxValue;
      this.getAllAmendmentList();
      setTimeout(() => {
      this.loadPermissions();
      }, 500);
    });
  }
  getAllAmendmentList() {
    this.documentApi.getAllAmendments().subscribe((res) => {
      this.amendMentList = res;
      this.tempAmendmentList = res;
    });
  }
  updateStatus(data, status) {
    let body = {
      documentId: data.id,
      status: status,
    };
    this.documentApi.updateAmendmentsStatus(body).subscribe((res: any) => {
      data.status = status;
      this.notification.success(
        "Success",
        `${status.toLowerCase()} succesfully..`
      );
    });
  }
  search() {
    if (this.searchParam) {
      this.amendMentList = this.tempAmendmentList.filter(
        (element) =>
          (element.type &&
          element.type
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.memberName && element.memberName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.layingDate && element.layingDate
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.listFileNumber && element.listFileNumber
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase().replace('_', ' ')
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.amendMentList = this.tempAmendmentList;
    }
  }
  handleCancel() {
    this.isVisible = false;
    this.isAttachVisible = false;
    this.subject = null;
    this.priority = null;
    this.desc = null;
  }
  showPdfModal(url) {
    this.isVisible = true;
    this.docUrl = url;
  }

  loadPermissions() {
    if (this.commonService.doIHaveAnAccess("AMENDMENTS", "APPROVE")) {
      this.acceptReject = true;
    }
    if (this.commonService.doIHaveAnAccess("AMENDMENTS", "CREATE")) {
      this.checkbox = true;
    }
    if (this.commonService.doIHaveCorrespondenceAccess('CORRESPONDENCE_WORKFLOW_DRAFT', 'CREATE')) {
      this.amendmentInform = true;
    }
    this.getPendingAmendments();
  }

  onItemChecked(id: number, checked: boolean, docId) {
    this.updateCheckedStatus(id, checked);
    this.documentId = docId;
    if (this.setOfCheckedId.size === 0) {
      this.pendingAmendments = this.tempPendingAmendments;
    } else {
      this.pendingAmendments = this.tempPendingAmendments.filter(
        (element) =>
          element.documentId
          .includes(docId) &&
          element.listFileNumber === null &&
          element.status === 'LAYING_APPROVED'
        );
    }
  }

  updateCheckedStatus(id: number, checked: boolean) {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  createFile() {
    const body = {
      docIds: [...this.setOfCheckedId],
      fileFormDto: {
        fileId: null,
        assemblyId: this.assemblyId,
        fileNumber: null,
        currentNumber: 0,
        description: this.desc,
        priority: this.priority,
        sectionId: this.cplSectionId,
        sessionId: this.sessionId,
        subject: this.subject,
        subtype: null,
        type: "CPL",
        userId: this.user.userId
      }
    };
    this.documentApi.createAmendementList(body).subscribe(Res => {
      const temp: any = Res;
      this.notification.create(
        "success",
        "Success",
        "List created successfully with list file number " + temp[0].listFileNumber
      );
      this.setOfCheckedId = new Set<any>();
      this.desc = '';
      this.subject = '';
      this.priority = '';
      this.hide = false;
      this.isAttachVisible = false;
      this.getPendingAmendments();
    });
  }

  attachToFile() {}

  showFileModal() {
    this.isAttachVisible = true;
  }

  viewAmendment(id) {
    this.router.navigate(['business-dashboard/cpl/amendment-view', id]);
  }

  viewDocument(id) {
    this.router.navigate(["business-dashboard/cpl/cpl-view", "view", id]);
  }

  getPendingAmendments() {
    let body;
    if (this.acceptReject) {
      body = {
        layingDate: null,
        documentId: null,
        status: 'LIST_APPROVED'
      };
    } else {
      body = {
        layingDate: null,
        documentId: null,
        status: 'LAYING_APPROVED'
      };
    }
    this.documentApi.getPendingAmendments(body).subscribe(Res => {
      this.pendingAmendments = Res;
      this.tempPendingAmendments = this.pendingAmendments;
    });
  }

  searchPending() {
    if (this.pendingParam) {
      this.pendingAmendments = this.tempPendingAmendments.filter(
        (element) =>
          (element.memberName &&
          element.memberName
            .toLowerCase()
            .includes(this.pendingParam.toLowerCase())) ||
          (element.type && element.type
            .toLowerCase()
            .includes(this.pendingParam.toLowerCase())) ||
          (element.layingDate && element.layingDate
            .toLowerCase()
            .includes(this.pendingParam.toLowerCase())) ||
          (element.typeNumber && element.typeNumber
            .toLowerCase()
            .includes(this.pendingParam.toLowerCase())) ||
          (element.listFileNumber &&
            element.listFileNumber
              .toLowerCase()
              .includes(this.pendingParam.toLowerCase()))
      );
    } else {
      this.pendingAmendments = this.tempPendingAmendments;
    }
  }

  replyLetter(data) {
    this.commonService.getSubjectById(data.ministerDepartmentId).subscribe((Res: any) => {
    this.router.navigate(['business-dashboard/correspondence/select-template'], {
      state: {
        business: 'AMENDMENT',
        type: 'CPL_SECTION',
        fileId: data.listFileId,
        businessReferId: data.id,
        businessReferType: data.type,
        businessReferSubType: 'AMENDMENT',
        businessReferNumber: data.typeNumber,
        fileNumber: data.listFileNumber,
        departmentId: data.ministerDepartmentId,
        masterLetter: null,
        refrenceLetter: null,
        toCode: Res.code,
        toDisplayName: Res.departmentName
      },
    });
   });
  }
}
