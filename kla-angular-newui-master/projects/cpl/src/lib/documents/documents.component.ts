import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { Data } from "@angular/router";
import { CplService } from "../cpl.service";
import { DocumentsService } from "../shared/services/documents.service";
import { FilesService } from "../shared/services/files.service";
import { CplFile } from "../shared/models/create-file";
import { Validators, FormBuilder, FormControl } from "@angular/forms";

import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../shared/services/common.service";
import { NzNotificationService } from "ng-zorro-antd";
import * as jsPdf from "jspdf";
import "jspdf-autotable";
import { forkJoin, of, interval } from "rxjs";
import { DynamicFormComponent } from "../shared/components/dynamic-form/dynamic-form.component";

@Component({
  selector: "cpl-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
})
export class DocumentsComponent implements OnInit {
  temp = '';
  radioValue = null;
  tabIndex = 0;
  printable = false;
  DocList: any = [];
  DocLists: any = [];
  isAttachVisible = false;
  hide = false;
  status: any;
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<any>();
  checkedFileId = null;
  checkedFile = null;
  checkedDocIds = new Set<any>();
  checkedCorrectionIds = new Set<any>();
  searchDoc: any;
  searchFile: any;
  listOfDoc: any;
  listOfAllDocs: any;
  sortName: string;
  sortValue: string;
  assemblyList = [];
  sessionList = [];
  delayStatusType = ["RECEIVED", "TO_BE_RECEIVED"];
  docType = ["ALL", "SRO", "ORDINANCE", "ACT", "REPORT"];
  statusType = ["APPROVED", "SUBMITTED"];
  priroties = ["ALL", "URGENT", "NORMAL", "ACTION_TODAY", "ASSEMBLY_URGENT"];
  deptDocType = "ALL";
  statusDocType = "ALL";
  subDoc = null;
  docSubType = [
    "ALL",
    "ANNUAL",
    "AUDIT",
    "COMPTROLLER_AUDITOR_GOI",
    "ENQUIRY_COMMISSION",
    "ECONOMIC_REVIEW",
    "VIGILANCE",
    "ACCOUNT",
  ];
  assemblyId = null;
  sessionId = null;
  fileDesc = null;
  fileSub = "";
  filePriority = null;
  fileNumType: any = "true";
  currentNumOption: any = [];
  fileNumber: any;
  currentNum: any = null;
  user: any;
  pendingFiles: any = [];
  searchPending: any;
  searchfilesubject: any;
  prioritylist: any;
  listOfPending: any;
  searchFileNum: any;
  searchFileSub: any;
  isAssignVisible: boolean;
  searchPerson;
  section;
  checkedType = null;
  isTypeNull = false;
  disableCheck = false;
  filterStatus = [
    { text: "SAVED", value: "SAVED" },
    { text: "SUBMITTED", value: "SUBMITTED" },
    { text: "LAYING_APPROVED", value: "LAYING_APPROVED" },
  ];
  checkboxes = [
    { id: 1, label: "Curr No", check: true, disable: false },
    { id: 2, label: "Document Title", check: true, disable: false },
    { id: 3, label: "Document Type", check: true, disable: false },
    { id: 4, label: "File Number", check: true, disable: false },
    { id: 5, label: "Submission Date", check: true, disable: false },
    { id: 6, label: "Laid Date", check: true, disable: false },
    { id: 7, label: "Delay Statement", check: true, disable: false },
    { id: 8, label: "Status", check: true, disable: false },
    { id: 9, label: "Portfolio", check: false, disable: true },
    { id: 10, label: "Minister Department", check: false, disable: true },
    { id: 11, label: "Gazette Publish Date", check: false, disable: true },
    { id: 12, label: "GO Date", check: false, disable: true },
    { id: 13, label: "GO Number", check: false, disable: true },
    { id: 14, label: "Document Number", check: false, disable: true },
    { id: 15, label: "Act Type", check: false, disable: true },
    { id: 16, label: "Act Name", check: false, disable: true },
    { id: 17, label: "Department FileNumber", check: false, disable: true },
    { id: 18, label: "Minister Subject", check: false, disable: true },
  ];
  checkbox = [
    { id: 1, label: "Curr No", check: true, disable: false },
    { id: 2, label: "Document Title", check: true, disable: false },
    { id: 3, label: "Document Type", check: true, disable: false },
    { id: 4, label: "Withdrawal File Number", check: true, disable: false },
    { id: 5, label: "Withdrawal Reason", check: true, disable: false },
    { id: 6, label: "Submission Date", check: true, disable: false },
    { id: 7, label: "Delay Statement/Statement By Minster", check: true, disable: false },
    { id: 8, label: "Status", check: true, disable: false },
    { id: 9, label: "Portfolio", check: false, disable: true },
    { id: 10, label: "Minister Department", check: false, disable: true },
    { id: 11, label: "Minister Subject", check: false, disable: true },
    // { id: 11, label: "Gazette Publish Date", check: false, disable: true },
    // { id: 12, label: "GO Date", check: false, disable: true },
    // { id: 13, label: "GO Number", check: false, disable: true },
    // { id: 14, label: "Document Number", check: false, disable: true },
    // { id: 15, label: "Act Type", check: false, disable: true },
    // { id: 16, label: "Act Name", check: false, disable: true },
    // { id: 17, label: "Department FileNumber", check: false, disable: true },
  ];
  public priorities = [
    { label: "Urgent", value: "URGENT" },
    { label: "Normal", value: "NORMAL" },
    { label: "Action Today", value: "ACTION_TODAY" },
    { label: "Assembly Urgent", value: "ASSEMBLY_URGENT" },
  ];
  tempDocType: any = null;
  tempFileType: any = null;
  list;
  docs;
  statu;
  pendingType = null;
  portfolioId: any;
  subDocType: any;
  cplTabs = this.getTabs();
  layPermission = false;
  tabShow = false;
  isViewVisible: boolean = false;
  isEditVisible: boolean = false;
  fileEdited: any = [];
  docId: number = 0;
  subDocId: number = 0;
  delayStatusId: number = 0;
  filterSelected = {
    fileNumber: null,
    priority: null,
    subject: null,
    subtype: null,
    regDate: null,
  };
  filenodisable = false;
  regdatedisable = false;
  prioritydisable = false;
  filesubjectdisable = false;
  subtypeDisable = false;
  priority = [];
  regDate = [];
  fileno = [];
  filesubject = [];
  filesubtype = [];
  isVisibleFilter = false;
  fileFiltered;
  fileListFiltered;
  tempFile: any = {
    subject: "",
    fileNumber: "",
    priority: "",
  };
  showDocFilterModal = false;
  filterDocCheckboxes = [
    { label: "Current Number", checked: false },
    { label: "Document Title", checked: false },
    { label: "File Number", checked: false },
    { label: "Delay Statement", checked: false },
    { label: "Status", checked: false },
  ];
  disableCurNum = false;
  disableDocTitle = false;
  disableFileNum = false;
  disableDelay = false;
  disableStatus = false;
  cNo = [];
  docTitle = [];
  docfileNum = [];
  delayStat = [];
  docstatus = [];
  docFilterSelected = {
    currentNumber: null,
    typeName: null,
    regFileNumber: null,
    delayStatus: null,
    status: null,
  };
  fileForPortfolio: any = [];
  docPortfolioId: any;
  deptDocs: any;
  AllDeptDocs: any;
  searchDeptDoc: any;
  deptSubDoc: any;
  assistantList: any;
  cplType: any;
  cplSubType: any;
  tempdocs: any;
  tempList: any;
  deptUser: any;
  assigneeId: any = null;
  listOfAssistants: any = [];
  tempFileForPortfolio: any;
  cplSectionId;
  soEdit = false;
  actRegistration = false;
  withrawDocs: any = [];
  tempWithdrawDocs: any = [];
  withdrawAssignModal = false;
  assignWithdraw = false;
  withdrawFile = false;
  isWithrawFileVisible = false;
  searchWithdrawDoc = '';
  assisstantId: any;
  pendingCorrectionStatement: any;
  tempPendingCorrectionStatement: any;
  assignCorrection = false;
  correctionFile = false;
  correctionModal = false;
  correctionAssignModal = false;
  fileType: any;
  docDepartmentId: any;
  correctionSearch: any;
  docAssembly = null;
  docSession = null;
  dashboardState: any;
  paramId: any;
  deptdashDocType: any;
  assemblySession: any = null;

  constructor(
    private docService: DocumentsService,
    private fileService: FilesService,
    private notification: NzNotificationService,
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute,
    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    if (this.route.snapshot.params.id == "file") {
      this.router.navigate(["business-dashboard/cpl/files"]);
    }
    const urlParams = this.router.getCurrentNavigation().extras.state;
    if (urlParams) {
      if (urlParams.Index) {
        this.tabIndex = urlParams.Index;
      } else {
        this.dashboardState = urlParams.status;
      }
    }
    this.cplSectionId = this.commonService.getSectionId();
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.paramId = params["id"];
      }
    });
  }

  ngOnInit() {
      this.docService.getAllAssemblyAndSession()
    .subscribe((res: any) => {
      this.assemblySession = res.assemblySession;
      this.assemblyList = res.assembly;
      this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
      this.assemblyId = null;
      this.sessionId = null;
      this.tabShow = false;
      this.cplTabs.documents = false;
      setTimeout(() => {
        this.loadCPLTabs();
        if (this.cplTabs.department) {
          this.deptdashDocType = this.route.snapshot.params.id;
          this.getDeptuser();
        }
        if (this.cplTabs.assign) {
          this.getDeptuser();
        }
        if (this.cplTabs.docsforaction) {
          this.getDoCList();
        } else {
          this.getAllDocs();
        }
        if (this.assignWithdraw || this.withdrawFile) {
          this.getPendingWithdrawals();
        }
      }, 500);
    });
    this.getAssistants();
  }

  getSessionForAssembly() {
    this.sessionId = null;
    this.sessionList = [];
    if (this.assemblyId === 0) {
      this.sessionList = [{
              id: 0,
              sessionId: 'No Session',
            }];
    } else {
      if (this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
    }
  }

  getAssemblyAndSession() {
    this.assemblyId = null;
    this.sessionId = null;
}


  getDoCList() {
    let tempType = null;
    if (this.deptDocType === 'ALL') {
      tempType = null;
    } else {
      tempType = this.deptDocType;
    }
    this.searchDoc = null;
    const body = {
      assemblyId: this.assemblyId,
      ministerDepartmentId: null,
      portfolioId: null,
      sessionId: this.sessionId,
      status: null,
      subtype: this.subDoc,
      type: tempType,
      userId: this.user.userId,
    };
    this.docService.getPendingForActionDocs(body).subscribe((Response) => {
      const templist: any = Response;
      this.DocList = templist.filter(
        (element) =>
          element.status &&
          element.status !== "DEPARTMENT_SAVED" &&
           element.status !== "DEPARTMENT_SUBMITTED"
        );
      this.listOfDoc = this.DocList;
      if (this.paramId) {
            let arrIds = this.paramId.split("-");
            this.docId = arrIds[0];
            if (this.docId <= 4) {
              this.deptDocType = this.docType[this.docId];
              if (arrIds[1]) {
                this.subDocId = arrIds[1];
                this.subDoc = this.docSubType[this.subDocId];
              } else {
                this.subDoc = this.docSubType[0];
              }
              this.filterDoc();
            }
            // tslint:disable-next-line:triple-equals
            if (this.docId == 5) {
              this.deptDocType = this.docType[0];
              if (arrIds[1]) {
                this.delayStatusId = arrIds[1];
                this.listOfDoc = this.DocList.filter(
                  (element) =>
                    element.delayStatus &&
                    element.delayStatus ===
                      this.delayStatusType[this.delayStatusId - 1]
                );
              } else {
                this.listOfDoc = this.DocList;
              }
            }
          } else {
            this.searchDocCol(this.docFilterSelected);
          }
      this.paramId = null;
      });
  }

  showAttachModal(): void {
    this.hide = false;
    this.isAttachVisible = true;
    this.getFileNumber();
  }

  showAssignModal() {
    this.isAssignVisible = true;
  }

  handleCancel() {
    this.hide = false;
    this.isAttachVisible = false;
    this.isAssignVisible = false;
    this.fileNumType = "true";
    this.radioValue = null;
    this.assigneeId = null;
    this.withdrawAssignModal = false;
    this.searchPending = null;
    this.searchFileNum = null;
    this.searchFileSub = null;
    this.fileSub = null;
    this.filePriority = null;
    this.fileDesc = null;
    this.correctionAssignModal = false;
    this.isWithrawFileVisible = false;
    this.searchPerson = null;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(
      ({ disabled }) => !disabled
    );
    this.checked = listOfEnabledData.every(({ id }) =>
      this.setOfCheckedId.has(id)
    );
    this.indeterminate =
      listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.checked;
  }

  onItemChecked(
    id: number,
    checked: boolean,
    type,
    subType,
    portfolioId,
    departmentId,
    assembly,
    session
  ): void {
    this.cplType = type;
    this.cplSubType = subType;
    this.docPortfolioId = portfolioId;
    this.docDepartmentId = departmentId;
    this.docAssembly = assembly;
    this.docSession = session;
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    if (this.setOfCheckedId.size === 0) {
      this.listOfDoc = this.DocList;
    } else if (type !== "REPORT") {
      this.pendingType = type;
      this.subDocType = type;
      this.listOfDoc = this.DocList.filter(
        (element) =>
          element.type &&
          element.type.includes(type) &&
          element.ministerDepartmentId &&
          element.ministerDepartmentId === departmentId &&
          element.fileId === null
      );
    } else {
      this.pendingType = subType;
      this.subDocType = subType;
      this.portfolioId = portfolioId;
      this.listOfDoc = this.DocList.filter(
        (element) =>
          element.subType &&
          element.subType.includes(subType) &&
          element.ministerDepartmentId &&
          element.ministerDepartmentId === departmentId &&
          element.fileId === null
      );
    }
    this.list = this.listOfDoc;
    this.docs = this.listOfDoc;
  }

  onFileChecked(id: number, file: any) {
    this.checkedFileId = id;
    this.checkedFile = file;
  }

  onDocChecked(id: number, checked: boolean) {
    if (checked) {
      this.checkedDocIds.add(id);
    } else {
      this.checkedDocIds.delete(id);
    }
  }

  filter(event): void {
    if (event) {
      this.listOfDoc = this.DocList.filter(
        (element) => element.status && element.status.includes(event)
      );
    }
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
    this.updateCheckedSet(item.id, checked)
  );
    this.refreshCheckedStatus();
  }

  onAllDeptChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.onDocChecked(item.id, checked)
    );
    this.refreshCheckedStatus();
  }

  onSearchPending() {
    if (this.searchPending) {
      this.fileForPortfolio = this.tempFileForPortfolio.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchPending.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchPending.toLowerCase()))
      );
    } else {
      this.fileForPortfolio = this.tempFileForPortfolio;
      this.searchPending = null;
    }
  }

  advancedSearch() {
    if (this.searchFileNum && this.searchFileSub) {
      this.fileForPortfolio = this.tempFileForPortfolio.filter(
        (element) =>
          element.fileNumber &&
          element.fileNumber
            .toLowerCase()
            .includes(this.searchFileNum.toLowerCase()) &&
          element.subject &&
          element.subject
            .toLowerCase()
            .includes(this.searchFileSub.toLowerCase())
      );
    } else if (this.searchFileNum) {
      this.fileForPortfolio = this.tempFileForPortfolio.filter(
        (element) =>
          element.fileNumber &&
          element.fileNumber
            .toLowerCase()
            .includes(this.searchFileNum.toLowerCase())
      );
    } else if (this.searchFileSub) {
      this.fileForPortfolio = this.tempFileForPortfolio.filter(
        (element) =>
          element.subject &&
          element.subject
            .toLowerCase()
            .includes(this.searchFileSub.toLowerCase())
      );
    } else {
      this.fileForPortfolio = this.tempFileForPortfolio;
    }
  }

  sortDoc(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    const data = this.DocList.filter((item) => item);
    if (this.sortName && this.sortValue) {
      this.listOfDoc = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName].toLowerCase() > b[this.sortName].toLowerCase()
            ? 1
            : -1
          : b[this.sortName].toLowerCase() > a[this.sortName].toLowerCase()
          ? 1
          : -1
      );
    } else {
      this.listOfDoc = data;
    }
  }

  createFile() {
    const file = new CplFile();
    if (this.docAssembly === null || this.docSession === null) {
      this.docAssembly = 0;
      this.docSession = 0;
    }
    file.docIds = [...this.setOfCheckedId];
    file.fileFormDto = {
      currentNumber: this.currentNum,
      assemblyId: this.docAssembly,
      assignedTo: 0,
      description: this.fileDesc,
      priority: this.filePriority,
      sectionId: this.cplSectionId,
      sessionId: this.docSession,
      subject: this.fileSub,
      subtype: this.subDocType,
      type: "CPL",
      userId: this.user.userId,
    };
    const body = {
      docIds: file.docIds,
      fileFormDto: file.fileFormDto,
    };
    this.fileService.createRegistrationList(body).subscribe((Res) => {
      const temp: any = Res;
      this.notification.create(
        "success",
        "Success",
        "File created with file number " + temp.fileNumber,
        { nzDuration: 10000 }
      );
      this.router.navigate(["business-dashboard/cpl/file-workflow", temp.fileId]);
      // this.router.navigate(["business-dashboard/cpl/files"]);
      this.setOfCheckedId = new Set<any>();
      this.currentNumOption = null;
      this.currentNum = null;
      this.fileSub = null;
      this.filePriority = null;
      this.fileNumType = "true";
      this.fileDesc = null;
      this.isAttachVisible = false;
      this.hide = false;
      this.radioValue = null;
      if (this.assemblyId === 0 || this.sessionId === 0) {
        this.assemblyId = null;
        this.sessionId = null;
      }
      this.getDoCList();
    });
  }

  viewDocument(id, tabIndex) {
    // this.router.navigate(["business-dashboard/cpl/cpl-view", "view", id]);
    this.router.navigate(["business-dashboard/cpl/cpl-view", "view", id], {
      state: {
        Index: tabIndex
      },
    });
  }
  deleteDocument(id) {
    this.docService.deleteDocumentById(id).subscribe((res: any) => {
      this.notification.success("Success", "Deleted Successfully!");
      this.getDoCList();
      if (this.cplTabs.department) {
        this.getDeptDocList();
      }
    });
  }
  regpage() {
    if (this.actRegistration) {
      this.router.navigate(["business-dashboard/cpl/act-registration"]);
    } else {
      this.router.navigate(["business-dashboard/cpl/registration"]);
    }
  }
  viewFile(id) {
    this.router.navigate(["business-dashboard/cpl/file-workflow", id]);
  }

  fileNum() {
    if (this.fileNumType === "true") {
      this.getFileNumber();
    } else {
      // this.currentNumOption = [];
      // this.currentNumOption = [this.arisingNum.body];
      this.currentNum = 0;
    }
  }

  getFileNumber() {
    if (this.fileNumType === "true") {
      this.currentNumOption = [];
      this.docService
        .getCurrentDocumentId([...this.setOfCheckedId])
        .subscribe((Res) => {
          this.fileNumber = Res;
          for (const num of this.fileNumber) {
            this.currentNumOption.push(num);
          }
          this.currentNum = this.currentNumOption[
            this.currentNumOption.length - 1
          ];
        });
    }
  }

  getFileForPortfolio() {
    if (this.docAssembly === null) {
      this.docAssembly = 0;
    }
    if (this.docSession === null) {
      this.docSession = 0;
    }
    this.fileForPortfolio = [];
    const body = {
      assemblyId: this.docAssembly,
      sessionId: this.docSession,
      portfolioId: this.docPortfolioId,
      cplType: this.cplType,
      cplSubType: this.cplSubType,
      userId: this.user.userId,
      departmentId: this.docDepartmentId
    };
    this.fileService.getFileForPortfolio(body).subscribe((Res: any) => {
      this.fileForPortfolio = Res.filter(file => file.status !== 'CLOSURE_PENDING');
      this.tempFileForPortfolio = this.fileForPortfolio;
    });
  }
 
  attachToFile() {
    const file = new CplFile();
    file.docIds = [...this.setOfCheckedId];

    file.fileFormDto = {
      fileId: this.checkedFileId,
      fileNumber: this.checkedFile.fileNumber,
      priority: this.checkedFile.priority,
      status: this.checkedFile.status,
      subject: this.checkedFile.subject,
      subtype: this.checkedFile.subtype,
      type: this.checkedFile.type,
      workflowId: this.checkedFile.workflowId,
      userId: this.user.userId,
    };
    const body = {
      docIds: file.docIds,
      fileFormDto: file.fileFormDto,
    };
    this.fileService.createRegistrationList(body).subscribe((Res) => {
      const temp: any = Res;
      this.notification.create(
        "success",
        "Success",
        "Document attached to file with file number " + temp.fileNumber
      );
      this.router.navigate(["business-dashboard/cpl/file-workflow", temp.fileId]);
      // this.router.navigate(["business-dashboard/cpl/files"]);
      this.setOfCheckedId = new Set<any>();
      this.currentNumOption = null;
      this.currentNum = null;
      this.checkedFileId = null;
      this.checkedFile = null;
      this.isAttachVisible = false;
      this.hide = false;
      this.getDoCList();
      this.pendingType = null;
      this.radioValue = null;
    });
  }

  personSearch() {
    if (this.searchPerson) {
      this.assistantList = this.listOfAssistants.filter(
        (element) =>
          element.fullName &&
          element.fullName
            .toLowerCase()
            .includes(this.searchPerson.toLowerCase())
      );
    } else {
      this.assistantList = this.listOfAssistants;
    }
  }

  filterDoc() {
    const checkArray: any = [];
    for (const check of this.filterDocCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.docs = this.DocList;
      this.list = this.DocList;
    }
    if (this.deptDocType !== "REPORT") {
      this.subDoc = null;
    }
    if (this.deptDocType && this.subDoc && this.searchDoc) {
      this.listOfDoc = this.docs.filter(
        (element) =>
          element.type.includes(this.deptDocType) &&
          element.subType.includes(this.subDoc) &&
          ((element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDoc.toLowerCase())) ||
            (element.currentNumber.toString() &&
              element.currentNumber.toString().includes(this.searchDoc)) ||
            (element.regFileNumber &&
              element.regFileNumber.includes(this.searchDoc.toLowerCase())))
      );
    } else if (this.deptDocType === "ALL" && this.searchDoc) {
      this.listOfDoc = this.docs.filter(
        (element) =>
          (element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDoc.toLowerCase())) ||
          (element.currentNumber.toString() &&
            element.currentNumber.toString().includes(this.searchDoc)) ||
          (element.regFileNumber &&
            element.regFileNumber.includes(this.searchDoc.toLowerCase()))
      );
    } else if (this.deptDocType && this.searchDoc) {
      this.listOfDoc = this.docs.filter(
        (element) =>
          element.type.includes(this.deptDocType) &&
          element.typeName &&
          ((element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDoc.toLowerCase())) ||
            (element.currentNumber.toString() &&
              element.currentNumber.toString().includes(this.searchDoc)) ||
            (element.regFileNumber &&
              element.regFileNumber.includes(this.searchDoc.toLowerCase())))
      );
    } else if (this.deptDocType && this.subDoc) {
      this.listOfDoc = this.docs.filter(
        (element) =>
          element.type.includes(this.deptDocType) &&
          element.subType.includes(this.subDoc)
      );
    } else if (this.deptDocType !== "ALL") {
      this.listOfDoc = this.docs.filter((element) =>
        element.type.includes(this.deptDocType)
      );
    } else if (this.searchDoc) {
      this.listOfDoc = this.docs.filter(
        (element) =>
          (element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDoc.toLowerCase())) ||
          (element.currentNumber.toString() &&
            element.currentNumber.toString().includes(this.searchDoc)) ||
          (element.regFileNumber &&
            element.regFileNumber.includes(this.searchDoc.toLowerCase()))
      );
    } else if (!checkArray.includes(true)) {
      this.listOfDoc = this.list;
    } else if (checkArray.includes(true)) {
      this.listOfDoc = this.docs;
    }
    this.tempDocType = this.deptDocType;
  }

  getTabs() {
    return {
      documents: false,
      department: false,
      assign: false,
      docsforaction: false,
      assisstantDocs: false,
      correction: false,
      createOrdinance: false
    };
  }

  loadCPLTabs() {
    if (this.commonService.doIHaveAnAccess("DOCUMENTS", "READ")) {
      this.cplTabs.documents = true;
    }
    if (this.commonService.doIHaveAnAccess("DEPARTMENT", "CREATE")) {
      this.cplTabs.department = true;
    }
    if (this.commonService.doIHaveAnAccess("DEPARTMENT", "FORWARD")) {
      this.cplTabs.assign = true;
    }
    if (this.commonService.doIHaveAnAccess("LAY-PERMISSION", "UPDATE")) {
      this.layPermission = true;
    }
    if (this.commonService.doIHaveAnAccess("DOCUMENTS FOR ACTION", "READ")) {
      this.cplTabs.docsforaction = true;
    }
    if (this.commonService.doIHaveAnAccess("ASSEMBLY_SESSION_ADD", "UPDATE")) {
      this.soEdit = true;
    }
    if (this.commonService.doIHaveAnAccess("ACT_REGISTRATION", "CREATE")) {
      this.actRegistration = true;
    }
    if (this.commonService.doIHaveAnAccess('WITHDRAW_DOCUMENT', 'WITHDRAW')) {
      this.assignWithdraw = true;
    }
    if (this.commonService.doIHaveAnAccess('WITHDRAW_DOCUMENT', 'CREATE')) {
      this.withdrawFile = true;
    }
    if (this.commonService.doIHaveAnAccess("ASSISSTANT_DOCUMENTS", "READ")) {
      this.cplTabs.assisstantDocs = true;
    }
    if (this.commonService.doIHaveAnAccess("CORRECTION_STATEMENT", "READ")) {
      this.cplTabs.correction = true;
      this.getPendingCorrectionStatement();
    }
    if (this.commonService.doIHaveAnAccess("CORRECTION_STATEMENT", "FORWARD")) {
      this.assignCorrection = true;
    }
    if (this.commonService.doIHaveAnAccess("CORRECTION_STATEMENT", "UPDATE")) {
      this.correctionFile = true;
    }
    if (
      this.commonService.doIHaveAnAccess("ORDINANCE_CREATE", "CREATE")
    ) {
      this.cplTabs.createOrdinance = true;
    }
    this.tabShow = true;
  }

  captureScreen() {
    let doc = new jsPdf("p", "pt");

    doc.autoTable({ html: "#mladata" });

    var blob = doc.output("blob");

    var w = window.open(URL.createObjectURL(blob));
  }
  printableScreen() {
    this.printable = true;
  }
  cancelPrint() {
    this.printable = false;
  }

  showModal(): void {
    this.isVisibleFilter = true;
  }

  _hideFilter(): void {
    this.isVisibleFilter = false;
    this.showDocFilterModal = false;
  }

  _chooseFilter(box) {
    box.checked = !box.checked;
  }

  _loadSelectedfilterData() {
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;

    this.filenodisable
      ? Object.keys(self.listOfPending).forEach(function (key) {
          counter1++;
          self.fileno.push(self.listOfPending[key].fileNumber);
          if (counter1 == self.listOfPending.length) {
            self.fileno = self.fileno.filter((v, i, a) => a.indexOf(v) === i);
          }
        })
      : "";

    this.filesubjectdisable
      ? Object.keys(self.listOfPending).forEach(function (key) {
          counter2++;
          self.filesubject.push(self.listOfPending[key].subject);
          if (counter2 == self.listOfPending.length) {
            self.filesubject = self.filesubject.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.prioritydisable
      ? Object.keys(self.listOfPending).forEach(function (key) {
          counter3++;
          self.priority.push(self.listOfPending[key].priority);
          if (counter3 == self.listOfPending.length) {
            self.priority = self.priority.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.subtypeDisable
      ? Object.keys(self.listOfPending).forEach(function (key) {
          counter4++;
          self.filesubtype.push(self.listOfPending[key].subtype);
          if (counter4 == self.listOfPending.length) {
            self.filesubtype = self.filesubtype.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.regdatedisable
      ? Object.keys(self.listOfPending).forEach(function (key) {
          counter5++;
          self.regDate.push(self.listOfPending[key].createdDate);
          if (counter5 == self.listOfPending.length) {
            self.regDate = self.regDate.filter((v, i, a) => a.indexOf(v) === i);
            self.regDate.sort();
          }
        })
      : "";
  }

  applyFilter(element: any, filter: any): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === "string") {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field] === "number") {
          if (!element[field] || element[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  clearFilter() {
    this.deptSubDoc = "";
    this.filenodisable = false;
    this.regdatedisable = false;
    this.prioritydisable = false;
    this.filesubjectdisable = false;
    this.subtypeDisable = false;
    this.filterSelected = {
      fileNumber: null,
      priority: null,
      subject: null,
      subtype: null,
      regDate: null,
    };
    this._loadSelectedfilterData();
    this.searchDoc = "";
    this.subDoc = null;
    this.deptDocType = "ALL";
    this.disableCurNum = false;
    this.disableDocTitle = false;
    this.disableFileNum = false;
    this.disableDelay = false;
    this.disableStatus = false;
    this.docFilterSelected = {
      currentNumber: null,
      typeName: null,
      regFileNumber: null,
      delayStatus: null,
      status: null,
    };
    this.filterDocCheckboxes.forEach((element) => {
      {
        element.checked = false;
      }
    });
    this.searchDocCol(this.docFilterSelected);
    this._loadDocFilterData();
    this.searchDeptDocCol(this.docFilterSelected);
    this._loadDeptDocFilterData();
  }

  doNothing() {
    return false;
  }

  cancel() {}

  showFilterModal() {
    this.showDocFilterModal = true;
  }

  _showDocFilter() {
    this.showDocFilterModal = false;
    this.disableCurNum = this.filterDocCheckboxes.find(
      (element) => element.label === "Current Number"
    ).checked;
    this.disableDocTitle = this.filterDocCheckboxes.find(
      (element) => element.label === "Document Title"
    ).checked;
    this.disableFileNum = this.filterDocCheckboxes.find(
      (element) => element.label === "File Number"
    ).checked;
    this.disableDelay = this.filterDocCheckboxes.find(
      (element) => element.label === "Delay Statement"
    ).checked;
    this.disableStatus = this.filterDocCheckboxes.find(
      (element) => element.label === "Status"
    ).checked;
    this._loadDocFilterData();
    this._loadDeptDocFilterData();
  }

  _loadDocFilterData() {
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;
    this.cNo = [];
    this.docTitle = [];
    this.docfileNum = [];
    this.delayStat = [];
    this.docstatus = [];
    this.disableCurNum
      ? Object.keys(self.DocList).forEach(function (key) {
          counter1++;
          self.cNo.push(self.DocList[key].currentNumber);
          if (counter1 == self.DocList.length) {
            self.cNo = self.cNo.filter((v, i, a) => a.indexOf(v) === i);
          }
        })
      : "";

    this.disableDocTitle
      ? Object.keys(self.DocList).forEach(function (key) {
          counter2++;
          self.docTitle.push(self.DocList[key].typeName);
          if (counter2 == self.DocList.length) {
            self.docTitle = self.docTitle.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.disableFileNum
      ? Object.keys(self.DocList).forEach(function (key) {
          counter3++;
          self.docfileNum.push(self.DocList[key].regFileNumber);
          if (counter3 == self.DocList.length) {
            self.docfileNum = self.docfileNum.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.disableDelay
      ? Object.keys(self.DocList).forEach(function (key) {
          counter4++;
          self.delayStat.push(self.DocList[key].delayStatus);
          if (counter4 == self.DocList.length) {
            self.delayStat = self.delayStat.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.disableStatus
      ? Object.keys(self.DocList).forEach(function (key) {
          counter5++;
          self.docstatus.push(self.DocList[key].status);
          if (counter5 == self.DocList.length) {
            self.docstatus = self.docstatus.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
  }

  searchDocCol(filter) {
    if (!filter) {
      this.listOfDoc = this.DocList;
    } else {
      this.listOfDoc = this.DocList.filter((item: any) =>
        this.applyFilter(item, filter)
      );
      this.docs = this.listOfDoc;
      this.list = this.listOfDoc;
    }
  }

  disableDocFilter(value) {
    switch (value) {
      case 1:
        this.disableCurNum = false;
        this.docFilterSelected.currentNumber = null;
        this.filterDocCheckboxes.forEach((element) => {
          if (element.label == "Current Number") {
            element.checked = false;
          }
        });
        break;
      case 2:
        this.disableDocTitle = false;
        this.docFilterSelected.typeName = null;
        this.filterDocCheckboxes.forEach((element) => {
          if (element.label == "Document Title") {
            element.checked = false;
          }
        });
        break;
      case 3:
        this.disableFileNum = false;
        this.docFilterSelected.regFileNumber = null;
        this.filterDocCheckboxes.forEach((element) => {
          if (element.label == "File Number") {
            element.checked = false;
          }
        });
        break;
      case 4:
        this.disableDelay = false;
        this.docFilterSelected.delayStatus = null;
        this.filterDocCheckboxes.forEach((element) => {
          if (element.label == "Delay Statement") {
            element.checked = false;
          }
        });
        break;
      case 5:
        this.disableStatus = false;
        this.docFilterSelected.status = null;
        this.filterDocCheckboxes.forEach((element) => {
          if (element.label == "Status") {
            element.checked = false;
          }
        });
        break;
      default:
        break;
    }
    this.searchDocCol(this.docFilterSelected);
    this._loadDocFilterData();
    this.searchDeptDocCol(this.docFilterSelected);
    this._loadDeptDocFilterData();
  }

  getDeptDocList() {
    let tempDocType = null;
    if (this.deptDocType === 'ALL') {
      tempDocType = null;
    } else {
      tempDocType = this.deptDocType;
    }
    if (this.deptDocType !== 'REPORT') {
      this.deptSubDoc = null;
    } else {
      if (this.deptSubDoc === 'ALL') {
        this.deptSubDoc = null;
      }
    }
    this.checkedDocIds = new Set<any>();
    let body: any;
    if (this.cplTabs.department) {
      body = {
        assemblyId: this.assemblyId,
        ministerDepartmentId: null,
        portfolioId: null,
        sessionId: this.sessionId,
        status: null,
        subtype: this.deptSubDoc,
        type: tempDocType,
        userId: this.user.userId,
      };
      // if (this.cplTabs.createOrdinance) {
      //   body = {
      //     assemblyId: this.assemblyId,
      //     ministerDepartmentId: null,
      //     portfolioId: null,
      //     sessionId: this.sessionId,
      //     status: null,
      //     subtype: this.deptSubDoc,
      //     type: tempDocType,
      //     userId: this.user.userId,
      //   };
      // } else {
      //   body = {
      //     assemblyId: this.assemblyId,
      //     ministerDepartmentId: this.deptUser.data.details.departmentId,
      //     portfolioId: this.deptUser.data.details.portfolioId,
      //     sessionId: this.sessionId,
      //     status: null,
      //     subtype: this.deptSubDoc,
      //     type: tempDocType,
      //     userId: this.user.userId,
      //   };
      // }
    } else {
      body = {
        assemblyId: this.assemblyId,
        ministerDepartmentId: null,
        portfolioId: null,
        sessionId: this.sessionId,
        status: "DEPARTMENT_SUBMITTED",
        subtype: null,
        type: null,
        userId: this.user.userId,
      };
    }
    this.docService.getPendingForActionDocs(body).subscribe((Res) => {
      const temp: any = Res;
      this.deptDocs = temp.filter((element) => element.status !== "SAVED");
      this.tempdocs = this.deptDocs;
      this.AllDeptDocs = this.deptDocs;
      this.searchDeptDocCol(this.docFilterSelected);
      if (this.deptdashDocType) {
        // const docType = this.route.snapshot.params.id;
        this.deptDocs = temp.filter((element) => element.type === this.deptdashDocType);
        this.deptDocType = this.deptdashDocType;
        const tempDocs = this.deptDocs;
        if (this.dashboardState) {
          this.deptDocs = tempDocs.filter((element) => element.status === this.dashboardState);
        }
        this.tempdocs = this.deptDocs;
        this.AllDeptDocs = this.deptDocs;
      }
      this.deptdashDocType = null;
    });
  }

  filterDeptDoc() {
    const checkArray: any = [];
    for (const check of this.filterDocCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.tempdocs = this.AllDeptDocs;
      this.tempList = this.AllDeptDocs;
    }
    if (this.deptDocType !== "REPORT") {
      this.deptSubDoc = null;
    }
    if (this.deptDocType && this.deptSubDoc && this.searchDeptDoc) {
      this.deptDocs = this.tempdocs.filter(
        (element) =>
          element.type.includes(this.deptDocType) &&
          element.subType.includes(this.deptSubDoc) &&
          ((element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDeptDoc.toLowerCase())) ||
            (element.currentNumber.toString() &&
              element.currentNumber.toString().includes(this.searchDeptDoc)) ||
            (element.regFileNumber &&
              element.regFileNumber.includes(this.searchDeptDoc.toLowerCase())))
      );
    } else if (this.deptDocType === "ALL" && this.searchDeptDoc) {
      this.deptDocs = this.tempdocs.filter(
        (element) =>
          (element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDeptDoc.toLowerCase())) ||
          (element.currentNumber.toString() &&
            element.currentNumber.toString().includes(this.searchDeptDoc)) ||
          (element.regFileNumber &&
            element.regFileNumber.includes(this.searchDeptDoc.toLowerCase()))
      );
    } else if (this.deptDocType && this.searchDeptDoc) {
      this.deptDocs = this.tempdocs.filter(
        (element) =>
          element.type.includes(this.deptDocType) &&
          element.typeName &&
          ((element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDeptDoc.toLowerCase())) ||
            (element.currentNumber.toString() &&
              element.currentNumber.toString().includes(this.searchDeptDoc)) ||
            (element.regFileNumber &&
              element.regFileNumber.includes(this.searchDeptDoc.toLowerCase())))
      );
    } else if (this.deptDocType && this.deptSubDoc) {
      this.deptDocs = this.tempdocs.filter(
        (element) =>
          element.type.includes(this.deptDocType) &&
          element.subType.includes(this.deptSubDoc)
      );
    } else if (this.deptDocType !== "ALL") {
      this.deptDocs = this.tempdocs.filter((element) =>
        element.type.includes(this.deptDocType)
      );
    } else if (this.searchDeptDoc) {
      this.deptDocs = this.tempdocs.filter(
        (element) =>
          (element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDeptDoc.toLowerCase())) ||
          (element.currentNumber.toString() &&
            element.currentNumber.toString().includes(this.searchDeptDoc)) ||
          (element.regFileNumber &&
            element.regFileNumber.includes(this.searchDeptDoc.toLowerCase()))
      );
    } else if (!checkArray.includes(true)) {
      this.deptDocs = this.tempList;
    } else if (checkArray.includes(true)) {
      this.deptDocs = this.tempdocs;
    }
    this.tempDocType = this.deptDocType;
  }

  getAssistants() {
    this.commonService.getAssisstantList(['CPL_ASSISTANT']).subscribe((Res) => {
      this.assistantList = Res;
      this.listOfAssistants = this.assistantList;
    });
  }

  assignTOAssistant(assignType) {
    this.isAssignVisible = false;
    this.correctionAssignModal = false;
    let body;
    if (assignType === 'CORRECTED') {
      body = {
        correctionDocumentIds: [...this.checkedCorrectionIds],
        assignee: this.assigneeId,
        type: assignType,
        fromGroup: "section office"
      };
    } else {
      body = {
        cplDocumentIds: [...this.checkedDocIds],
        assignee: this.assigneeId,
        type: assignType,
        fromGroup: "section office"
      };
    }
    this.docService.assignTask(body).subscribe((Res) => {
      this.getPendingCorrectionStatement();
      this.getDeptDocList();
      this.getPendingWithdrawals();
      this.assigneeId = null;
      this.checkedCorrectionIds =  new Set<any>();
      this.checkedDocIds = new Set<any>();
      this.notification.create(
        "success",
        "Success",
        "Task Assigned Succesfully"
      );
    });
  }

  searchDeptDocCol(filter) {
    if (!filter) {
      this.deptDocs = this.AllDeptDocs;
    } else {
      if (this.AllDeptDocs) {
       this.deptDocs = this.AllDeptDocs.filter((item: any) =>
        this.applyFilter(item, filter)
       );
       this.tempdocs = this.deptDocs;
       this.tempList = this.deptDocs;
      }
    }
  }

  _loadDeptDocFilterData() {
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;

    this.disableCurNum
      ? Object.keys(self.AllDeptDocs).forEach(function (key) {
          counter1++;
          self.cNo.push(self.AllDeptDocs[key].currentNumber);
          if (counter1 == self.AllDeptDocs.length) {
            self.cNo = self.cNo.filter((v, i, a) => a.indexOf(v) === i);
          }
        })
      : "";

    this.disableDocTitle
      ? Object.keys(self.AllDeptDocs).forEach(function (key) {
          counter2++;
          self.docTitle.push(self.AllDeptDocs[key].typeName);
          if (counter2 == self.AllDeptDocs.length) {
            self.docTitle = self.docTitle.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.disableFileNum
      ? Object.keys(self.AllDeptDocs).forEach(function (key) {
          counter3++;
          self.docfileNum.push(self.AllDeptDocs[key].regFileNumber);
          if (counter3 == self.AllDeptDocs.length) {
            self.docfileNum = self.docfileNum.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.disableDelay
      ? Object.keys(self.AllDeptDocs).forEach(function (key) {
          counter4++;
          self.delayStat.push(self.AllDeptDocs[key].delayStatus);
          if (counter4 == self.AllDeptDocs.length) {
            self.delayStat = self.delayStat.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.disableStatus
      ? Object.keys(self.AllDeptDocs).forEach(function (key) {
          counter5++;
          self.docstatus.push(self.AllDeptDocs[key].status);
          if (counter5 == self.AllDeptDocs.length) {
            self.docstatus = self.docstatus.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
  }

  markAsLaid(id) {
    this.docService.markAsLaid(id).subscribe((res) => {
      this.notification.create("success", "Success", "Marked As Laid");
      this.getAllDocs();
    });
  }
  disableCheckBoxes() {
    let count = 0;
    for (const box of this.checkboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 9) {
      for (const box of this.checkboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.checkboxes) {
        box.disable = false;
      }
    }
  }
  disableCheckBox() {
    let count = 0;
    for (const box of this.checkbox) {
      if (box.check) {
        count++;
      }
    }

    if (count === 9) {
      for (const box of this.checkbox) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.checkbox) {
        box.disable = false;
      }
    }
  }

  getDeptuser() {
    this.docService.getDeptUser(this.user.userId).subscribe((Res) => {
      this.deptUser = Res;
      if (this.deptUser) {
        this.getDeptDocList();
      }
    });
  }

  getAllDocs() {
    this.searchDoc = null;
    let tempType = null;
    if (this.deptDocType === 'ALL') {
      tempType = null;
    } else {
      tempType = this.deptDocType;
    }
    const body = {
          assemblyId: this.assemblyId,
          ministerDepartmentId: null,
          portfolioId: null,
          sessionId: this.sessionId,
          status: null,
          subtype: this.subDoc,
          type: tempType
        };
    this.docService
          .getDeptDocs(body)
          .subscribe((Response) => {
            const templist: any = Response;
            this.DocList = templist.filter(
              (element) =>
                element.status &&
                element.status !== "DEPARTMENT_SAVED" &&
                element.status !== "DEPARTMENT_SUBMITTED"
            );
            this.listOfDoc = this.DocList;
            this.route.params.subscribe((params) => {
              if (params["id"]) {
                let arrIds = params["id"].split("-");
                this.docId = arrIds[0];
                if (this.docId <= 4) {
                  this.deptDocType = this.docType[this.docId];
                  if (arrIds[1]) {
                    this.subDocId = arrIds[1];
                    this.subDoc = this.docSubType[this.subDocId];
                  } else {
                    this.subDoc = this.docSubType[0];
                  }
                  this.filterDoc();
                }
                // tslint:disable-next-line:triple-equals
                if (this.docId == 5) {
                  this.deptDocType = this.docType[0];
                  if (arrIds[1]) {
                    this.delayStatusId = arrIds[1];
                    this.listOfDoc = this.DocList.filter(
                      (element) =>
                        element.delayStatus &&
                        element.delayStatus ===
                          this.delayStatusType[this.delayStatusId - 1]
                    );
                  } else {
                    this.listOfDoc = this.DocList;
                  }
                }
              } else {
                this.searchDocCol(this.docFilterSelected);
              }
            });
          });
  }

  clearSearch() {
    this.searchPending = "";
    this.searchDeptDoc = "";
    this.searchDoc = "";
  }

  getPendingWithdrawals() {
    this.checkedDocIds = new Set<any>();
    const body = {
      assemblyId: this.assemblyId,
      ministerDepartmentId: null,
      portfolioId: null,
      sessionId: this.sessionId,
      status: null,
      subtype: null,
      type: null,
      userId: this.user.userId,
    };
    this.docService.getPendingWithdrawList(body).subscribe(Res => {
        this.withrawDocs = Res;
        this.tempWithdrawDocs = this.withrawDocs;
        this.tempList = this.tempWithdrawDocs;
      });
  }

  showWithdrawAssignModal() {
    this.withdrawAssignModal = true;
  }

  showWithdrawFileModal(type) {
    this.isWithrawFileVisible = true;
    this.fileType = type;
  }

  createWithdrawFile() {
    let Ids;
    if (this.fileType === 'WITHDRAW') {
      Ids = [...this.checkedDocIds];
    } else {
      Ids = [...this.checkedCorrectionIds];
    }
    if (this.assemblyId === null || this.sessionId === null) {
      this.assemblyId = 0;
      this.sessionId = 0;
    }
    const fileForm = {
      currentNumber: 0,
      assemblyId: this.assemblyId,
      assignedTo: 0,
      description: this.fileDesc,
      priority: this.filePriority,
      sectionId: this.cplSectionId,
      sessionId: this.sessionId,
      subject: this.fileSub,
      subtype: this.fileType,
      type: 'CPL',
      userId: this.user.userId,
    };
    const body = {
      docIds: Ids,
      fileFormDto: fileForm,
    };
    this.fileService.createRegistrationList(body).subscribe((Res) => {
      const temp: any = Res;
      this.router.navigate(["business-dashboard/cpl/file-workflow", temp.fileId]);
      this.notification.create(
        'success',
        'Success',
        'File created with file number ' + temp.fileNumber,
        { nzDuration: 10000 }
      );
      this.fileType = null;
      this.checkedDocIds = new Set<any>();
      this.checkedCorrectionIds = new Set<any>();
      this.fileSub = null;
      this.filePriority = null;
      this.fileDesc = null;
      this.isWithrawFileVisible = false;
      if (this.assemblyId === 0 || this.sessionId === 0) {
        this.assemblyId = null;
        this.sessionId = null;
      }
      this.getPendingWithdrawals();
      this.getPendingCorrectionStatement();
    });
  }

  searchWithrawRequests() {
    if (this.checkedDocIds.size === 0 && this.searchWithdrawDoc === '') {
      this.tempList = this.tempWithdrawDocs;
    }
    if (this.checkedDocIds.size !== 0  && this.searchWithdrawDoc === '') {
      this.tempList = this.temp;
    }
    if (this.searchWithdrawDoc) {
      this.withrawDocs = this.tempList.filter(
        (element) =>
          (element.currentNumber.toString() &&
          element.currentNumber.toString()
              .toLowerCase()
              .includes(this.searchWithdrawDoc.toLowerCase())) ||
          (element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchWithdrawDoc.toLowerCase())) ||
          (element.type &&
                element.type
                  .toLowerCase()
                  .includes(this.searchWithdrawDoc.toLowerCase())) ||
          (element.withdrawalFileNumber &&
                    element.withdrawalFileNumber
                      .toLowerCase()
                      .includes(this.searchWithdrawDoc.toLowerCase())) ||
          (element.withdrawalReason &&
                        element.withdrawalReason
                          .toLowerCase()
                          .includes(this.searchWithdrawDoc.toLowerCase()))
      );
    } else {
      this.withrawDocs = this.tempList;
    }
    this.tempList = this.withrawDocs;
  }

  onWithdrawChecked(type, subType, departmentId): void {
    if (this.checkedDocIds.size === 0) {
      this.withrawDocs = this.tempWithdrawDocs;
    } else if (type !== 'REPORT') {
      this.withrawDocs = this.tempList.filter(
        (element) =>
          element.type &&
          element.type.includes(type) &&
          element.ministerDepartmentId &&
          element.ministerDepartmentId === departmentId
      );
    } else {
      this.withrawDocs = this.tempList.filter(
        (element) =>
          element.subType &&
          element.subType.includes(subType) &&
          element.ministerDepartmentId &&
          element.ministerDepartmentId === departmentId
      );
    }
    this.tempList = this.withrawDocs;
    this.temp = this.withrawDocs;
  }

  getAssisstantDocs() {
    this.searchDoc = null;
    const body = {
      assemblyId: this.assemblyId,
      ministerDepartmentId: null,
      portfolioId: null,
      sessionId: this.sessionId,
      status: null,
      subtype: null,
      type: null,
      userId: this.assisstantId,
    };
    if (this.assisstantId) {
      this.docService.getPendingForActionDocs(body).subscribe((Response) => {
        const templist: any = Response;
        this.DocList = templist.filter(
          (element) =>
            element.status &&
            element.status !== "DEPARTMENT_SAVED" &&
             element.status !== "DEPARTMENT_SUBMITTED"
          );
        this.listOfDoc = this.DocList;
      });
    } else {
      this.listOfDoc = [];
      this.DocList = [];
    }
  }

  getPendingCorrectionStatement() {
    const body = {
      documentId: null,
      status: null,
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      portfolioId: null,
      ministerDepartmentId: null,
      type: null,
      subtype: null,
      userId: this.user.userId
    };
    this.docService.getCorrectionStatement(body).subscribe(Res => {
      this.pendingCorrectionStatement = Res;
      this.tempPendingCorrectionStatement = this.pendingCorrectionStatement;
    });
  }

  showCorrectionModal(id) {
    this.correctionModal = true;
    this.requestForCorrection(id);
  }

  requestForCorrection(docId) {
    const body = {
      id: docId,
      withdrawalReason: null,
      requestLetterId: 112
    };
    this.docService.correctionRequest(body).subscribe(Res => {
      this.notification.create(
        'success',
        'Success',
        'Correction request made successfully!'
      );
    });
  }

  onCorrectionChecked(id: number, checked: boolean, deptId) {
    if (checked) {
      this.checkedCorrectionIds.add(id);
    } else {
      this.checkedCorrectionIds.delete(id);
    }
    if (this.checkedCorrectionIds.size === 0) {
      this.pendingCorrectionStatement = this.tempPendingCorrectionStatement;
    } else {
      this.pendingCorrectionStatement = this.tempPendingCorrectionStatement.filter(
        (element) =>
          element.ministerDepartmentId === deptId &&
          element.correctionFileId === null &&
          element.correctionStatus === 'PENDING'
        );
    }
  }

  showCorrectionAssignModal() {
    this.correctionAssignModal = true;
  }

  correctionReply(data) {
    this.commonService.getSubjectById(data.ministerDepartmentId).subscribe((Res: any) => {
      this.router.navigate(["business-dashboard/correspondence/select-template"], {
        state: {
          business: "CORRECTION_STATEMENT_RESPONSE",
          type: "CPL_SECTION",
          fileId: data.correctionFileId,
          businessReferId: data.documentId,
          businessReferType: 'REPORT',
          businessReferSubType: data.subType,
          businessReferNumber: data.typeNumber,
          businessReferName: data.typeName,
          fileNumber: data.correctionFileNumber,
          departmentId: data.ministerDepartmentId,
          masterLetter: data.requestLetterId,
          refrenceLetter: data.requestLetterId,
          toCode: Res.code,
          toDisplayName: Res.departmentName
        },
      });
    });
  }

  viewCorrectionLetter(id) {
    this.router.navigate(
      [
        '/business-dashboard/correspondence/correspondence',
        'view',
        id,
      ]
    );
  }

  searchCorrection() {
    if (this.correctionSearch) {
      this.pendingCorrectionStatement = this.tempPendingCorrectionStatement.filter(
        (element) =>
          (element.typeName &&
          element.typeName.toLowerCase().includes(this.correctionSearch.toLowerCase())) ||
          (element.nameOfInstitution &&
            element.nameOfInstitution.toLowerCase().includes(this.correctionSearch.toLowerCase()))
        );
    } else {
      this.pendingCorrectionStatement = this.tempPendingCorrectionStatement;
    }
  }

  onDepartmentDocChecked(deptId, type, subtype) {
    if (this.checkedDocIds.size !== 0) {
      if (type === 'REPORT') {
        this.deptDocs = this.AllDeptDocs.filter(
          (element) =>
            element.subType &&
            element.subType.includes(subtype) &&
            element.ministerDepartmentId &&
            element.ministerDepartmentId === deptId
        );
      } else {
        this.deptDocs = this.AllDeptDocs.filter(
          (element) =>
            element.type &&
            element.type.includes(type) &&
            element.ministerDepartmentId &&
            element.ministerDepartmentId === deptId
        );
      }
    } else {
      this.deptDocs = this.AllDeptDocs;
    }
  }

  returnTabTitle() {
    if (this.actRegistration) {
      return 'cpl.documents.documents';
    } else {
      return 'cpl.documents.DocumentsforAction';
    }
  }
}
