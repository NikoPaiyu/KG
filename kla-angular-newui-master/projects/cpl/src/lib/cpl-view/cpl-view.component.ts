import { Component, OnInit, Inject } from "@angular/core";
import { DocumentsService } from "../shared/services/documents.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../shared/services/common.service";
import { FilesService } from "../shared/services/files.service";
import { CplFile } from "../shared/models/create-file";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { CplDocs } from "../shared/models/registration";
import {
  NzMessageService,
  UploadChangeParam,
  NzNotificationService,
} from "ng-zorro-antd";
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import { parseISO } from "date-fns";
import { forkJoin } from "rxjs";
import { UploadFile } from 'ng-zorro-antd/upload';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "cpl-cpl-view",
  templateUrl: "./cpl-view.component.html",
  styleUrls: ["./cpl-view.component.css"],
})
export class CplViewComponent implements OnInit {
  maindocCheck = false;
  confidentialityCheck = false;
  isconfidential = false;
  uploadURL = this.docService.uploadUrl();
  uploadURL1 = this.docService.uploadUrl();
  delaystatement_radioButtonValue = "browse";
  mainDocument_radioButtonValue = "browse";
  coveringDocument_radioButtonValue = "browse";
  additionalDocument_radioButtonValue = "browse";
  ruleRadioButtonValue = 'browse';
  ministerfor;
  tempListOfExistingDocs;
  existingDocsArray: any = [];
  listOfExistingDocs: any = [];
  cplTabs = this.getTabs();
  delayList = [];
  model_ExistFile_other = false;
  model_ExistFile_cover = false;
  showDelayList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  showRuleList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  docType = ["SRO", "REPORT"];
  isDelayNeeded: boolean = false;
  today: any = new Date();
  listofdate: any = [];
  document: any;
  docResponse: any = null;
  id: any;
  editable = false;
  minPortfolios: any = [];
  ministerDept: any = [];
  hide: boolean;
  isAttachVisible: boolean;
  searchFileNum: any;
  searchFileSub: any;
  pendingFiles: any;
  listOfPending: any;
  checkedFileId: number;
  checkedFile: any;
  fileNumType: any = "true";
  fileNumber: any;
  setOfCheckedId = new Set<any>();
  currentNumOption: any;
  currentNum: any;
  fileSub = null;
  filePriority = null;
  fileDesc = null;
  searchPending: any;
  user: any;
  arisingNum: any;
  doctype;
  ministerdepartmentId;
  validateForm: FormGroup;
  existingFileSearch;
  docBody: any = [];
  mainDoc: any = [];
  addDocs: any = [];
  delayDoc: any = [];
  fileList = [];
  docList: any = [];
  fileLists = [];
  mainDocDeleted = false;
  coverDocDeleted = false;
  delayDeleted = false;
  ruleDeleted = false;
  deptSubjects: any = [];
  docSubType = [
    {
      name: "Annual",
      code: "ANNUAL",
    },
    {
      name: "Audit",
      code: "AUDIT",
    },
    {
      name: "Comptroller Auditor GOI",
      code: "COMPTROLLER_AUDITOR_GOI",
    },
    {
      name: "Enquiry Commission",
      code: "ENQUIRY_COMMISSION",
    },
    {
      name: "Economic Review",
      code: "ECONOMIC_REVIEW",
    },
    {
      name: "Vigilance",
      code: "VIGILANCE",
    },
    {
      name: "Account",
      code: "ACCOUNT",
    },
  ];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  showUploadList1 = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  mainDocAtt: any;
  coverDocAtt: any;
  delayAtt: any;
  ruleAtt: any = null;
  fileDocsArray: any;
  currentPoolUser: any;
  currentPool: any;
  stepStatus: any;
  editButton = false;
  fileForPortfolio: any;
  tempFileForPortfolio: any;
  isStatementAsPerRule: any;
  ruleDoc: any = [];
  ruleList: any = [];
  disableFields = false;
  radioValue = null;
  draftEdit = true;
  listOfActName: any = [];
  actNameOptions: any = [];
  cplSectionId: any;
  assemblyList: any = [];
  sessionList: any = [];
  deptUser: any = [];
  listOfInstName: any = [];
  InstNameOptions: any = [];
  addAct: any = false;
  addInst: any = false;
  soEdit = false;
  currentVersion: any;
  counter = Array;
  versionArray: any = [];
  listOfReferenceDoc: any = [];
  actRegistration = false;
  editAct = false;
  coveringDoc: any = [];
  coveringDocFileList = [];
  withdrawModal = false;
  reason: any = "";
  assemblyId;
  sessionId;
  existingOtherDocuments: any = [];
  tempExistingOtherDocuments: any = [];
  tempData: any = [];
  activeSession: any = [];
  urlParams: any = null;
  correctionStatement: any = null;
  tempCheckedDoc: any;
  previewVisible = false;
  docUrl: any;
  showForm = false;
  yearList: any = [];
  rangeList: any = [];
  yearRadio = 'Financial Year';
  createOrdinance = false;
  ordYearList: any = [];
  purpose: any = null;
  assemblySession: any = null;

  constructor(
    private docService: DocumentsService,
    private fileService: FilesService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
    public translate: TranslateService,
  ) {
    this.formValidation();
    this.user = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    this.cplSectionId = this.commonService.getSectionId();
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    if (this.user.authorities.includes('assistant')) {
      this.docType.push('ACT');
    }
    this.getYearList(true);
    // this.currentAssemblyAndSession();
    this.getAllAssemblyAndSession();
    this.formValidation();
    this.cplTabs.documents = false;
    this.cplTabs.department = false;
    this.actRegistration = false;
    this.route.params.subscribe((params) => {
      this.purpose = params["purpose"];
      if (params["id"]) {
        this.id = params["id"];
        this.getAllPortfolios();
        if (params["purpose"] == "edit") {
          // this.edit();
        }
      }
    });
    setTimeout(() => {
      this.loadCPLTabs();
      this.getDoCbyId();
      if (this.cplTabs.department) {
        this.getDeptuser();
        if (!this.createOrdinance) {
          // this.validateForm.get("ministerfor").clearValidators();
          // this.validateForm.get("ministerdepartmentId").clearValidators();
          this.validateForm.get("assembly").clearValidators();
          this.validateForm.get("session").clearValidators();
          // tslint:disable-next-line:forin
          for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].updateValueAndValidity();
          }
        }
      }
    }, 500);
    this.getInstName();
    this.getActName();
  }

  getDeptuser() {
    this.docService.getDeptUser(this.user.userId).subscribe((Res) => {
      this.deptUser = Res;
      this.getMinisterDepartments(this.deptUser.data.details.portfolioId);
    });
  }

  getDoCbyId() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.docService
        .getDocumentbyID(this.id, this.user.userId)
        .subscribe((Response) => {
          this.docResponse = Response;
          // if (!this.docResponse.cplDocumentResponseDto.typeYear.includes('-')) {
          //   this.yearRadio = 'Calendar Year';
          // }
          this.correctionStatement = this.docResponse.cplDocumentResponseDto.attachments.find(element => element.isCorrection);
          this.validateForm.patchValue({
            currentVersion: this.docResponse.cplDocumentResponseDto
              .currentVersion,
          });
          this.assemblyId = this.docResponse.cplDocumentResponseDto.assemblyId;
          this.sessionId = this.docResponse.cplDocumentResponseDto.sessionId;
          this.tempData =  this.docResponse.versionMap[this.docResponse.cplDocumentResponseDto.currentVersion];
          if (this.cplTabs.department) {
            this.getAllSubjects(this.docResponse.cplDocumentResponseDto.ministerDepartmentId);
          }
          this.getVersion(
            this.docResponse.cplDocumentResponseDto.currentVersion
          );
          if (this.docResponse.cplDocumentResponseDto.isDelayed) {
            this.isDelayNeeded = true;
          }
          if (this.listofdate) {
            if (this.purpose == 'edit') {
              this.edit();
            }
            this.tempDataAdd();
            if (
              this.docResponse.cplDocumentResponseDto.status === "SECTION_SAVED"
            ) {
              this.editAct = true;
              this.validateForm.get("ministerfor").clearValidators();
              this.validateForm.get("ministerdepartmentId").clearValidators();
              for (const i in this.validateForm.controls) {
                this.validateForm.controls[i].updateValueAndValidity();
              }
            }
            this.validateForm.patchValue({
              doctype: this.listofdate.type,
              ministerfor: this.listofdate.portfolioId,
              ministerdepartmentId: this.listofdate.ministerDepartmentId,
              docsubtype: this.listofdate.subType,
              deptSubjectId: this.listofdate.subjectId
            });
            if (
              this.docResponse.cplDocumentResponseDto.status ===
              "DEPARTMENT_DRAFT"
            ) {
              if (this.cplTabs.department) {
                this.draftEdit = false;
              } else {
                this.draftEdit = true;
              }
            }
            if (
              this.docResponse.cplDocumentResponseDto.status ===
                "DEPARTMENT_DRAFT" ||
              this.docResponse.cplDocumentResponseDto.status === "SUBMITTED"
            ) {
              this.disableFields = true;
            } else {
              this.disableFields = false;
            }
            if (this.listofdate.isStatementAsPerRule) {
              this.isStatementAsPerRule = "yes";
            } else {
              this.isStatementAsPerRule = "no";
            }
            this.delayAtt = [];
            this.mainDocAtt = [];
            this.coverDocAtt = [];
            this.delayAtt = [];
            this.ruleAtt = [];
            for (const doc of this.docResponse.cplDocumentResponseDto.attachments) {
              if (doc.isMainDocument) {
                this.mainDocAtt = doc;
              } else if (doc.isDelayStatement) {
                this.delayAtt = doc;
              } else if (doc.isStatementAsPerRule) {
                this.ruleAtt = doc;
              } else if (doc.isCorrection) {
                this.correctionStatement = doc;
              } else if (doc.isLetter) {
                this.coverDocAtt = doc;
              }
            }
            if (this.listofdate.fileId !== null) {
              this.getFileById(this.listofdate.fileId);
            } else {
              this.editButton = true;
            }
          }
          if (this.docResponse.cplDocumentResponseDto.fileId !== null) {
            this.getFileById(this.docResponse.cplDocumentResponseDto.fileId);
          } else {
            this.editButton = true;
          }
        });
    });
  }

  getFileById(fileId) {
    this.fileService.getDocumentsByFileId(fileId).subscribe((Res) => {
      this.fileDocsArray = Res;
      this.getWorkflow();
    });
  }

  getWorkflow() {
    this.fileService
      .checkWorkFlowStatus(this.fileDocsArray.fileResponse.workflowId)
      .subscribe((Res) => {
        this.stepStatus = Res;
        const current = this.stepStatus[this.stepStatus.length - 1];
        this.currentPoolUser = current.owner;
        if (
          this.docResponse.cplDocumentResponseDto.status !==
            "LAYING_APPROVED" &&
          this.currentPoolUser === "CPL_ASSISTANT"
        ) {
          this.editButton = true;
        }
      });
  }

  handleChange1(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.addDocs = [];
    if (info.file.response) {
      for (const file of fileLists) {
        this.addDocs.push({
          name: file.name,
          attachmentUrl: file.response.body,
          isDelayStatement: false,
          isMainDocument: false,
          isStatementAsPerRule: false,
          currentNumber: this.docResponse.cplDocumentResponseDto.currentNumber,
          isConfindential: false,
          isLetter: false,
        });
      }
    }
    this.fileLists = fileLists.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }

  darft() {
    this.listofdate = this.tempData;
    this.validateForm.patchValue({
      currentVersion: this.docResponse.cplDocumentResponseDto.currentVersion
    });
    if (this.mainDoc.length === 0 && this.mainDocDeleted) {
      this.notification.create(
        "warning",
        "Warning",
        "Please Upload Covering Document!"
      );
    } else if (this.mainDocDeleted) {
      this.notification.create(
        "warning",
        "Warning",
        "Please Save to continue!"
      );
    } else {
      this.editable = false;
    }
  }
  edit() {
    this.editable = true;
    this.formValidation();
    // if (!this.docResponse.cplDocumentResponseDto.typeYear.includes('-')) {
    //   this.yearRadio = 'Calendar Year';
    // }
    if (this.cplTabs.department&& !this.createOrdinance) {
      // this.validateForm.get("ministerfor").clearValidators();
      // this.validateForm.get("ministerdepartmentId").clearValidators();
      this.validateForm.get("assembly").clearValidators();
      this.validateForm.get("session").clearValidators();
      // tslint:disable-next-line:forin
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.listofdate.type === 'ACT' || this.listofdate.type === 'ORDINANCE') {
      this.validateForm.value.docYear = parseInt(this.validateForm.value.docYear, 10);
      this.listofdate.typeYear = parseInt(this.listofdate.typeYear, 10);
    }
    this.validateForm.patchValue({
      ministerdepartmentId: this.tempData.ministerDepartmentId,
      deptSubjectId: this.tempData.subjectId
    });
  }
  getAllPortfolios() {
    this.docService.getAllPortfolios().subscribe((Res) => {
      this.minPortfolios = Res;
    });
  }

  getMinisterDepartments(portfolioId) {
    this.docService.getMinisterDepartments(portfolioId).subscribe((Res) => {
      this.ministerDept = Res;
      if (this.listofdate.type !== 'ORDINANCE' && this.createOrdinance && !this.user.authorities.includes('assistant')) {
        this.listofdate.ministerDepartmentId = this.deptUser.data.details.departmentId;
        this.listofdate.portfolioId = portfolioId;
      }
    });
  }

  getAllSubjects(deptId) {
    if (deptId) {
      this.docService.getAllSubjectsByDepartmentId(deptId).subscribe((Res: any) => {
        this.deptSubjects = Res;
      });
    }
  }

  onMinisterChange(event) {
    if (event !== null) {
      this.getMinisterDepartments(event);
    }
    this.coveringDoc = [];
    this.coveringDocFileList = [];
    this.ministerDept = null;
    this.deptSubjects = null;
    this.validateForm.patchValue({
      ministerdepartmentId: null,
      deptSubjectId: null
    });
  }

  onDepartmentChange(event) {
    this.coveringDoc = [];
    this.coveringDocFileList = [];
    this.deptSubjects = null;
    this.validateForm.patchValue({
      deptSubjectId: null
    });
  }

  showAttachModal(): void {
    this.hide = false;
    this.isAttachVisible = true;
    this.formValidation();
    this.getFileNumber();
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

  onFileChecked(id: number, file: any) {
    this.checkedFileId = id;
    this.checkedFile = file;
  }

  handleCancel() {
    this.hide = false;
    this.isAttachVisible = false;
    this.fileNumType = "true";
    this.radioValue = null;
    this.searchFileNum = null;
    this.searchFileSub = null;
    this.searchPending = null;
    this.withdrawModal = false;
    this.fileDesc = null;
    this.fileSub = null;
    this.filePriority = null;
  }

  goBack() {
    if (this.urlParams) {
      this.router.navigate(['business-dashboard/cpl/documents'], {
        state: this.urlParams ? this.urlParams : null
      });
    } else {
      window.history.back();
    }
  }

  fileNum() {
    if (this.fileNumType === "true") {
      this.getFileNumber();
    } else {
      this.currentNum = 0;
    }
  }

  getFileNumber() {
    if (this.fileNumType === "true") {
      this.currentNumOption = [];
      this.docService
        .getCurrentDocumentId([this.docResponse.cplDocumentResponseDto.id])
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

  onSearch() {
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
    }
  }

  getFileForPortfolio() {
    let subType;
    if (
      this.listofdate.type !== "REPORT" &&
      this.listofdate.type !== "SRO"
    ) {
      subType = "NO_SUBTYPE";
    } else {
      subType = this.listofdate.subType;
    }
    const body = {
      assemblyId: this.listofdate.assemblyId,
      sessionId: this.listofdate.sessionId,
      portfolioId: this.listofdate.portfolioId,
      cplType: this.listofdate.type,
      cplSubType: subType,
      userId: this.user.userId,
      departmentId: this.listofdate.ministerDepartmentId
    };
    this.fileService.getFileForPortfolio(body).subscribe((Res: any) => {
      this.fileForPortfolio = Res.filter(file => file.status !== 'CLOSURE_PENDING');
      this.tempFileForPortfolio = this.fileForPortfolio;
    });
  }

  attachToFile() {
    const file = new CplFile();
    file.docIds = [this.docResponse.cplDocumentResponseDto.id];
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
      this.setOfCheckedId = new Set<any>();
      this.currentNumOption = null;
      this.currentNum = null;
      this.checkedFileId = null;
      this.checkedFile = null;
      this.isAttachVisible = false;
      this.hide = false;
      this.router.navigate(["business-dashboard/cpl/file-workflow", temp.fileId]);
    });
  }

  createFile() {
    const file = new CplFile();
    file.docIds = [this.docResponse.cplDocumentResponseDto.id];
    let subDocType;
    if (!this.editable) {
      if (this.docResponse.cplDocumentResponseDto.type !== "REPORT") {
        subDocType = this.listofdate.type;
      } else {
        subDocType = this.listofdate.subType;
      }
    }
    file.fileFormDto = {
      currentNumber: this.currentNum,
      assemblyId: this.listofdate.assemblyId,
      assignedTo: 0,
      description: this.fileDesc,
      priority: this.filePriority,
      sectionId: this.cplSectionId,
      sessionId: this.listofdate.sessionId,
      subject: this.fileSub,
      type: "CPL",
      userId: this.user.userId,
      subtype: subDocType,
    };
    const body = {
      docIds: file.docIds,
      fileFormDto: file.fileFormDto,
    };
    this.fileService.createRegistrationList(body).subscribe((Res) => {
      this.setOfCheckedId = new Set<any>();
      this.currentNumOption = null;
      this.currentNum = null;
      this.fileSub = null;
      this.filePriority = null;
      this.fileNumType = "true";
      this.fileDesc = null;
      this.isAttachVisible = false;
      this.hide = false;
      const temp: any = Res;
      this.notification.create(
        "success",
        "Success",
        "File created with file number " + temp.fileNumber,
        { nzDuration: 60000 }
      );
      this.router.navigate(["business-dashboard/cpl/file-workflow", temp.fileId]);
    });
  }

  formValidation(): void {
    this.validateForm = this.fb.group({
      doctype: [null, [Validators.required]],
      assembly: [0],
      session: [0],
      documentname: [null, [Validators.required]],
      documentfileno: [null, [Validators.required]],
      ministerfor: [null],
      ministerdepartmentId: [null],
      deptSubjectId: [null],
      dateOfGazette: [null],
      docNumber: [null],
      docsubtype: [null],
      gono: [null],
      layingprovision: [null],
      insabha: [null],
      docDate: [null],
      goDate: [null],
      nameOfInst: [null],
      sectionName: [null],
      docYear: [null],
      date:[null],
      actType: [null],
      actName: [null],
      asPerRule: [null],
      dateOfOrdinance: [null],
      currentVersion: [null],
      maindocCheck: [false],
      typeReference: [null],
      yearType: ['Financial Year']
    });
  }

  addDynamicValidation() {
    if (this.listofdate.type !== 'ORDINANCE' && this.createOrdinance && !this.user.authorities.includes('assistant')) {
      this.getDeptuser();
      this.listofdate.ministerDepartmentId = null;
      this.listofdate.portfolioId = null;
    }
    this.validateForm.get("doctype").valueChanges.subscribe((type) => {
      if (type === "SRO") {
        if (this.listofdate.subType !== 'REVISED') {
          this.listofdate.subType = 'NEW';
        }
        this.listofdate.subType = 'NEW';
        this.validateForm.get("gono").setValidators([Validators.required]);
        this.validateForm.get("goDate").setValidators([Validators.required]);
        this.validateForm.get("docNumber").setValidators([Validators.required]);
        this.validateForm.get("docDate").setValidators([Validators.required]);
        this.validateForm.get("actType").setValidators([Validators.required]);
        this.validateForm.get("actName").setValidators([Validators.required]);
        this.validateForm
          .get("docsubtype")
          .setValidators([Validators.required]);
        this.validateForm
          .get("layingprovision")
          .setValidators([Validators.required]);
        if (this.cplTabs.department && !this.createOrdinance) {
          // this.validateForm.get("ministerfor").clearValidators();
          // this.validateForm.get("ministerdepartmentId").clearValidators();
          this.validateForm
          .get("ministerfor")
          .setValidators([Validators.required]);
        this.validateForm
          .get("ministerdepartmentId")
          .setValidators([Validators.required]);
        } else {
          this.validateForm
            .get("ministerfor")
            .setValidators([Validators.required]);
          this.validateForm
            .get("ministerdepartmentId")
            .setValidators([Validators.required]);
        }
        this.validateForm
          .get("insabha")
          .setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
        this.validateForm.get("asPerRule").clearValidators();
        this.validateForm.get("sectionName").clearValidators();
        this.validateForm.get("docYear").clearValidators();
        this.validateForm.get("nameOfInst").clearValidators();
        this.validateForm.get("dateOfOrdinance").clearValidators();
        this.validateForm.get("deptSubjectId").setValidators([Validators.required]);
      } else if (type === "ORDINANCE") {
        this.validateForm.get("deptSubjectId").setValidators([Validators.required]);
        this.validateForm.get("docNumber").setValidators([Validators.required]);
        this.validateForm.get("docDate").setValidators([Validators.required]);
        this.validateForm.get("asPerRule").setValidators([Validators.required]);
        this.validateForm.get("gono").setValidators([Validators.required]);
        this.validateForm.get("docYear").setValidators([Validators.required]);
        this.validateForm
          .get("dateOfOrdinance")
          .setValidators([Validators.required]);
        if (this.cplTabs.department&& !this.createOrdinance) {
          // this.validateForm.get("ministerfor").clearValidators();
          // this.validateForm.get("ministerdepartmentId").clearValidators();
          this.validateForm
          .get("ministerfor")
          .setValidators([Validators.required]);
        this.validateForm
          .get("ministerdepartmentId")
          .setValidators([Validators.required]);
          this.validateForm.get("assembly").clearValidators();
          this.validateForm.get("session").clearValidators();
        } else {
          this.validateForm
            .get("ministerfor")
            .setValidators([Validators.required]);
          this.validateForm
            .get("ministerdepartmentId")
            .setValidators([Validators.required]);
        }
        this.validateForm.get("goDate").clearValidators();
        this.validateForm.get("actType").clearValidators();
        this.validateForm.get("actName").clearValidators();
        this.validateForm.get("layingprovision").clearValidators();
        this.validateForm.get("insabha").clearValidators();
        this.validateForm.get("sectionName").clearValidators();
        this.validateForm.get("docsubtype").clearValidators();
        this.validateForm.get("nameOfInst").clearValidators();
      } else if (type === "ACT") {
        this.validateForm.get("deptSubjectId").clearValidators();
        this.validateForm
          .get("sectionName")
          .clearValidators();
        this.validateForm.get("docYear").setValidators([Validators.required]);
        this.validateForm.get("docNumber").setValidators([Validators.required]);
        this.validateForm.get("gono").clearValidators();
        this.validateForm.get("goDate").clearValidators();
        this.validateForm.get("docDate").clearValidators();
        this.validateForm.get("actType").clearValidators();
        this.validateForm.get("actName").clearValidators();
        this.validateForm.get("layingprovision").clearValidators();
        this.validateForm.get("insabha").clearValidators();
        this.validateForm.get("docsubtype").clearValidators();
        this.validateForm.get("nameOfInst").clearValidators();
        this.validateForm.get("asPerRule").clearValidators();
        this.validateForm.get("dateOfOrdinance").setValidators([Validators.required]);
        this.validateForm.get("ministerfor").clearValidators();
        this.validateForm.get("ministerdepartmentId").clearValidators();
      } else if (type === "REPORT") {
        this.validateForm.get("deptSubjectId").setValidators([Validators.required]);
        this.validateForm
          .get("docsubtype")
          .setValidators([Validators.required]);
        this.validateForm
          .get("nameOfInst")
          .setValidators([Validators.required]);
        this.validateForm.get("docYear").setValidators([Validators.required]);
        this.validateForm
          .get("layingprovision")
          .setValidators([Validators.required]);
        if (this.cplTabs.department&& !this.createOrdinance) {
          // this.validateForm.get("ministerfor").clearValidators();
          // this.validateForm.get("ministerdepartmentId").clearValidators();
          this.validateForm
            .get("ministerfor")
            .setValidators([Validators.required]);
          this.validateForm
            .get("ministerdepartmentId")
            .setValidators([Validators.required]);
          this.validateForm.get("assembly").clearValidators();
          this.validateForm.get("session").clearValidators();
        } else {
          this.validateForm
            .get("ministerfor")
            .setValidators([Validators.required]);
          this.validateForm
            .get("ministerdepartmentId")
            .setValidators([Validators.required]);
        }
        this.validateForm.get("gono").clearValidators();
        this.validateForm.get("goDate").clearValidators();
        this.validateForm.get("docNumber").clearValidators();
        this.validateForm.get("actType").clearValidators();
        this.validateForm.get("actName").clearValidators();
        this.validateForm.get("insabha").clearValidators();
        this.validateForm.get("asPerRule").clearValidators();
        this.validateForm.get("sectionName").clearValidators();
        this.validateForm.get("dateOfOrdinance").clearValidators();
        this.validateForm.get("dateOfGazette").clearValidators();
      } else {
        this.validateForm.get("docsubtype").clearValidators();
        this.validateForm.get("nameOfInst").clearValidators();
        this.validateForm.get("docYear").clearValidators();
        this.validateForm.get("layingprovision").clearValidators();
        this.validateForm.get("gono").clearValidators();
        this.validateForm.get("goDate").clearValidators();
        this.validateForm.get("docNumber").clearValidators();
        this.validateForm.get("docDate").clearValidators();
        this.validateForm.get("actType").clearValidators();
        this.validateForm.get("actName").clearValidators();
        this.validateForm.get("insabha").clearValidators();
        this.validateForm.get("asPerRule").clearValidators();
        this.validateForm.get("sectionName").clearValidators();
        this.validateForm.get("dateOfOrdinance").clearValidators();
        this.validateForm.get("ministerfor").clearValidators();
        this.validateForm.get("ministerdepartmentId").clearValidators();
      }
    });
    if (this.cplTabs.department&& !this.createOrdinance) {
      // this.validateForm.get("ministerfor").clearValidators();
      // this.validateForm.get("ministerdepartmentId").clearValidators();
      this.validateForm.get("assembly").clearValidators();
      this.validateForm.get("session").clearValidators();
    }
    if (this.docResponse.cplDocumentResponseDto.status !== "SECTION_SAVED") {
      this.validateForm.get("ministerfor").clearValidators();
      this.validateForm.get("ministerdepartmentId").clearValidators();
    }
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if ((this.validateForm.value.assembly === null && this.validateForm.value.session === null) ||
    (this.validateForm.value.assembly === null && this.validateForm.value.session === 0) ||
    (this.validateForm.value.assembly === 0 && this.validateForm.value.session === null)) {
      this.validateForm.controls.assembly.setValue(0);
      this.validateForm.controls.session.setValue(0);
    } else if ((this.validateForm.value.assembly === 0 || this.validateForm.value.assembly === null) &&
        this.validateForm.value.session !== null
        && this.validateForm.value.session !== 0) {
      this.validateForm.controls.assembly.reset();
      this.validateForm.get('assembly').setValidators([Validators.required]);
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    } else if ((this.validateForm.value.session === 0 ||  this.validateForm.value.session === null)
        && this.validateForm.value.assembly !== null
        && this.validateForm.value.assembly !== 0) {
      this.validateForm.controls.session.reset();
      this.validateForm.get('session').setValidators([Validators.required]);
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    if (this.cplTabs.department&& !this.createOrdinance) {
      this.validateForm.value.ministerdepartmentId = this.deptUser.data.details.departmentId;
      this.validateForm.value.ministerfor = this.deptUser.data.details.portfolioId;
    }

    if (
      this.validateForm.valid &&
      (this.mainDoc.length > 0 || !this.mainDocDeleted)
    ) {
      let rule;
      if (this.validateForm.value.asPerRule === "yes") {
        rule = true;
      } else {
        rule = false;
      }
      if (this.validateForm.value.doctype === "SRO") {
        this.validateForm.value.asPerRule = null;
        this.validateForm.value.sectionName = null;
        this.validateForm.value.docYear = null;
        this.validateForm.value.nameOfInst = null;
        this.validateForm.value.getdateOfOrdinance = null;
        this.ruleDoc = [];
        if (this.isDelayNeeded === false) {
          this.delayDoc = [];
        }
      } else if (this.validateForm.value.doctype === "ORDINANCE") {
        this.validateForm.value.goDate = null;
        this.validateForm.value.actType = null;
        this.validateForm.value.actName = null;
        this.validateForm.value.layingprovision = null;
        this.validateForm.value.insabha = null;
        this.validateForm.value.sectionName = null;
        this.validateForm.value.docsubtype = null;
        this.validateForm.value.nameOfInst = null;
        if (this.isDelayNeeded === false) {
          this.delayDoc = [];
        }
      } else if (this.validateForm.value.doctype === "REPORT") {
        this.validateForm.value.gono = null;
        this.validateForm.value.goDate = null;
        this.validateForm.value.docNumber = null;
        this.validateForm.value.actType = null;
        this.validateForm.value.actName = null;
        this.validateForm.value.insabha = null;
        this.validateForm.value.sectionName = null;
        this.validateForm.value.asPerRule = null;
        this.validateForm.value.dateOfOrdinance = null;
        this.validateForm.value.dateOfGazette = null;
        this.ruleDoc = [];
        if (this.isDelayNeeded === false) {
          this.delayDoc = [];
        }
      }
      if (this.maindocCheck) {
        if (this.mainDoc) {
          this.mainDoc[0].isConfindential = true;
        }
      }
      this.docList = [
        ...this.mainDoc,
        ...this.addDocs,
        ...this.delayDoc,
        ...this.ruleDoc,
        ...this.coveringDoc,
      ];
      let docSubType: any;
      if (
        this.validateForm.value.doctype === "REPORT" ||
        this.validateForm.value.doctype === "SRO"
      ) {
        docSubType = this.validateForm.value.docsubtype;
      } else {
        docSubType = "NO_SUBTYPE";
      }
      if (this.cplTabs.department&& !this.createOrdinance) {
        this.validateForm.value.ministerdepartmentId = this.deptUser.data.details.departmentId;
        this.validateForm.value.ministerfor = this.deptUser.data.details.portfolioId;
      }
      if (
        this.cplTabs.department && 
        ((this.listofdate.delayStatus === 'TO_BE_RECEIVED' && this.isDelayNeeded) ||
        (this.listofdate.delayStatus === 'RECEIVED' &&
        this.delayDeleted  && this.isDelayNeeded) || (this.listofdate.delayStatus === 'NOT_NEEDED' && this.isDelayNeeded)) &&
        this.delayDoc.length === 0 &&
        docSubType !== "COMPTROLLER_AUDITOR_GOI"
      ) {
        this.notification.create(
          "warning",
          "Warning",
          "Please Upload Delay Statement!"
        );
      } else {
      this.docBody = {
        id: this.docResponse.cplDocumentResponseDto.id,
        assemblyId: this.validateForm.value.assembly,
        sessionId: this.validateForm.value.session,
        currentNumber: this.docResponse.cplDocumentResponseDto.currentNumber,
        fileId: this.docResponse.cplDocumentResponseDto.fileId,
        regFileNumber: this.docResponse.cplDocumentResponseDto.regFileNumber,
        attachments: this.docList,
        gazettePublishDate: this.validateForm.value.dateOfGazette,
        goDate: this.validateForm.value.goDate,
        goNumber: this.validateForm.value.gono,
        isDelayed: this.isDelayNeeded,
        ministerDepartmentId: this.validateForm.value.ministerdepartmentId,
        portfolioId: this.validateForm.value.ministerfor,
        subjectId: this.validateForm.value.deptSubjectId,
        typeDate: this.validateForm.value.docDate,
        typeNumber: this.validateForm.value.docNumber,
        subType: docSubType,
        type: this.validateForm.value.doctype,
        typeName: this.validateForm.value.documentname,
        status: this.docResponse.cplDocumentResponseDto.status,
        departmentFileNumber: this.validateForm.value.documentfileno,
        numberOfDaysInSabha: this.validateForm.value.insabha,
        layingProvisionInAct: this.validateForm.value.layingprovision,
        actType: this.validateForm.value.actType,
        actName: this.validateForm.value.actName,
        sectionName: this.validateForm.value.sectionName,
        typeYear: this.validateForm.value.docYear,
        nameOfInstitution: this.validateForm.value.nameOfInst,
        isStatementAsPerRule: rule,
        date: this.validateForm.value.dateOfOrdinance,
        createdBy: this.docResponse.cplDocumentResponseDto.createdby,
        workflowId: this.docResponse.cplDocumentResponseDto.workflowId,
        currentVersion: this.docResponse.cplDocumentResponseDto.currentVersion,
        confindential: this.maindocCheck,
        typeReference: this.validateForm.value.typeReference,
      };
      this.docService.updateDocument(this.docBody).subscribe((Res) => {
        this.saveActAndInstitution();
        this.validateForm.reset();
        this.fileList = [];
        this.docList = [];
        this.getDoCbyId();
        this.editable = false;
        this.mainDoc = [];
        this.addDocs = [];
        this.delayDoc = [];
        this.delayDeleted = false;
        this.coverDocDeleted = false;
        this.mainDocDeleted = false;
        this.ruleDeleted = false;
        this.notification.create(
          "success",
          "Success",
          "Document updated Successfully!"
        );
        this.router.navigate(["business-dashboard/cpl/documents"]);
      });
    }
    } else if (this.fileList.length === 0 && this.mainDocDeleted) {
      this.notification.create(
        "warning",
        "Warning",
        "Please Upload Covering Document!"
      );
    } else {
      this.notification.create("warning", "Warning", "Please fill all fields!");
    }
  }

  handleChange(info: UploadChangeParam): void {
    const fileList = info.fileList;
    this.mainDoc = [];
    if (info.file.response) {
      for (const file of fileList) {
        this.mainDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: false,
          isMainDocument: true,
          isStatementAsPerRule: false,
          currentNumber: this.docResponse.cplDocumentResponseDto.currentNumber,
          isConfindential: false,
          isLetter: false,
        });
      }
    }
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
  //function for upload covering letter
  uploadCovering(info: UploadChangeParam): void {
    const fileList = info.fileList;
    this.coveringDoc = [];
    if (info.file.response) {
      for (const file of fileList) {
        this.mainDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: false,
          isMainDocument: false,
          isStatementAsPerRule: false,
          currentNumber: this.docResponse.cplDocumentResponseDto.currentNumber,
          isConfindential: false,
          isLetter: true,
        });
      }
    }
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and todaya
    return differenceInCalendarDays(current, this.today) < 0;
  };

  docYearChange() {
    if (this.docResponse.cplDocumentResponseDto.type === "REPORT"&& this.validateForm.value.docYear &&
    this.validateForm.value.docsubtype !== 'COMPTROLLER_AUDITOR_GOI') {
      let docYear = this.validateForm.value.docYear;
      let arrDocYear = docYear.split("-");
      let endDate: Date = new Date(arrDocYear[0] + "-12-31 23:59:59");

      const diffInDays = differenceInCalendarDays(this.today, endDate);

      if (diffInDays < 0) {
        this.isDelayNeeded = true;
      } else {
        this.isDelayNeeded = false;
      }
    }

    if ( this.validateForm.value.docsubtype == 'COMPTROLLER_AUDITOR_GOI') {
      this.isDelayNeeded = false;
    }
    // let diffInDays: any;
    // if (this.docResponse.cplDocumentResponseDto.type === "REPORT") {
    //   if (this.yearRadio==='Financial Year') {
    //     let docYear = this.validateForm.value.docYear;
    //     let arrDocYear = docYear.split("-");
    //     let endDate: Date = new Date(arrDocYear[0] + "-12-31 23:59:59");
    //     diffInDays = differenceInCalendarDays(this.today, endDate);
    //   } else {
    //     let currentYear: any;
    //     if (this.listofdate.subType === 'AUDIT' || this.listofdate.subType === 'ANNUAL') {
    //       currentYear = new Date().getFullYear() - 1;
    //     } else {
    //       currentYear = new Date().getFullYear();
    //     }
    //     diffInDays = this.validateForm.value.docYear - currentYear;
    //   }

    //   if (diffInDays < 0) {
    //     this.isDelayNeeded = true;
    //   } else {
    //     this.isDelayNeeded = false;
    //   }
    // }
  }

  dateOfGazetteValidationCheck() {
    // 2 month validation check -> 60 days check changed to 2 months
    if (this.validateForm.value.doctype !== "ORDINANCE") {
      if (this.validateForm.value.dateOfGazette !== null) {
        const twoMonthPrior = parseISO(this.docResponse.cplDocumentResponseDto.createdDate).getMonth() - 2;
        const selectedMonth = this.validateForm.value.dateOfGazette.getMonth();
        const twoMonthPriorDay = parseISO(this.docResponse.cplDocumentResponseDto.createdDate).getDate();
        const selectedMonthDay = this.validateForm.value.dateOfGazette.getDate();
        if (parseISO(this.docResponse.cplDocumentResponseDto.createdDate).getFullYear() -
        this.validateForm.value.dateOfGazette.getFullYear() > 1) {
          this.isDelayNeeded = true;
        } else if (parseISO(this.docResponse.cplDocumentResponseDto.createdDate).getFullYear() -
        this.validateForm.value.dateOfGazette.getFullYear() === 1) {
          if (selectedMonth - this.today.getMonth() < 10 || 
          (selectedMonth - this.today.getMonth() === 10 && selectedMonthDay - twoMonthPriorDay < 0)) {
            this.isDelayNeeded = true;
          } else {
            this.isDelayNeeded = false;
          }
        } else if (parseISO(this.docResponse.cplDocumentResponseDto.createdDate).getFullYear() -
        this.validateForm.value.dateOfGazette.getFullYear() === 0) {
          if (selectedMonth - twoMonthPrior < 0 ||
            (selectedMonth - twoMonthPrior === 0 && selectedMonthDay - twoMonthPriorDay < 0)) {
             this.isDelayNeeded = true;
            } else {
             this.isDelayNeeded = false;
           }
        } else {
          this.isDelayNeeded = false;
        }
      }
    } else {
      this.isDelayNeeded = false;
    }
  }

  handleDelayChange(info: UploadChangeParam): void {
    const delayList = info.fileList;
    this.delayDoc = [];
    if (info.file.response) {
      for (const file of delayList) {
        this.delayDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: true,
          isMainDocument: false,
          isStatementAsPerRule: false,
          currentNumber: this.docResponse.cplDocumentResponseDto.currentNumber,
          isConfindential: false,
          isLetter: false,
        });
      }
    }
    this.delayList = delayList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }

  handleRuleChange(info: UploadChangeParam): void {
    const ruleList = info.fileList;
    this.ruleDoc = [];
    if (info.file.response) {
      for (const file of ruleList) {
        this.ruleDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: false,
          isMainDocument: false,
          isStatementAsPerRule: true,
          currentNumber: this.docResponse.cplDocumentResponseDto.currentNumber,
          isConfindential: false,
          isLetter: false,
        });
      }
    }
    this.ruleList = ruleList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }

  deleteAttachment(aId) {
    this.docService.deleteAttachment(aId, this.id).subscribe((Res) => {
      this.getDoCbyId();
    });
  }

  deleteDocument(id) {
    this.docService.deleteDocumentById(id).subscribe((res: any) => {
      this.notification.success("Success", "Deleted Successfully!");
      this.router.navigate(["business-dashboard/cpl/documents"]);
    });
  }

  getTabs() {
    return {
      documents: false,
      files: false,
      department: false,
      version: false,
      coverLetter: false
    };
  }

  loadCPLTabs() {
    if (this.commonService.doIHaveAnAccess("DOCUMENTS", "READ")) {
      this.cplTabs.documents = true;
    }
    if (this.commonService.doIHaveAnAccess("FILES", "UPDATE")) {
      this.cplTabs.files = true;
    }
    if (this.commonService.doIHaveAnAccess("DEPARTMENT", "CREATE")) {
      this.cplTabs.department = true;
    }
    if (this.commonService.doIHaveAnAccess("ASSEMBLY_SESSION_ADD", "UPDATE")) {
      this.soEdit = true;
    }
    if (this.commonService.doIHaveAnAccess("ACT_REGISTRATION", "CREATE")) {
      this.actRegistration = true;
    }
    if (
      this.commonService.doIHaveAnAccess("DOCUMENT_CONFIDENTIALITY", "CREATE")
    ) {
      this.confidentialityCheck = true;
    }
    if (
      this.commonService.doIHaveAnAccess("ORDINANCE_CREATE", "CREATE")
    ) {
      this.createOrdinance = true;
      this.docType.push('ORDINANCE');
    }
    if (this.commonService.doIHaveAnAccess('VERSION', 'READ')) {
      this.cplTabs.version = true;
    }
    if (this.commonService.doIHaveAnAccess('COVERING_LETTER', 'READ')) {
      this.cplTabs.coverLetter = true;
    }
  }

  submitDoc() {
    if (this.docResponse.cplDocumentResponseDto.attachments.find(x => x.isLetter === true)) {
      const body = {
        id: this.docResponse.cplDocumentResponseDto.id,
      };
      this.docService.submitDeptDoc(body).subscribe((Res) => {
        this.notification.create(
          "success",
          "Success",
          "Document Submitted Successfully!"
        );
        this.router.navigate(["business-dashboard/cpl/documents"]);
      });
    } else {
      this.notification.create(
        "warning",
        "Warning",
        "Please Upload Covering Letter to Continue!"
      );
    }
  }

  cancel() {}

  //function for show coverletter model show
  showCoverLetterModel() {
    this.existingFileSearch = null;
    this.model_ExistFile_cover = true;
    this.getCoverExistingDocuments();
  }
  //function to get existing documents for upload
  getCoverExistingDocuments() {
    const body = {
      assemblyId:
        this.validateForm.value.assembly === 0
          ? null
          : this.validateForm.value.assembly,
      sessionId:
        this.validateForm.value.session === 0
          ? null
          : this.validateForm.value.session,
      sectionId: this.cplSectionId,
      status: 'ASSIGNED',
      type:
        this.validateForm.value.doctype === ''
          ? null
          : this.validateForm.value.doctype,
      userId: this.user.userId,
      portfolioId: this.validateForm.value.ministerfor,
      departmentId: this.validateForm.value.ministerdepartmentId,
    };
    this.docService.getOfficeSectionPendingDocuments(body).subscribe((res: any) => {
      this.listOfExistingDocs = res.filter(doc => doc.subjectId === this.validateForm.value.deptSubjectId);
      this.listOfExistingDocs.forEach((element) => {
        element.checked = false;
      });
      this.tempListOfExistingDocs = this.listOfExistingDocs;
    });
  }

  //function  call when cover existing file document table checkboc check
  coverLetterTableCheckBoxCheck(data) {
    //to uncheck other checked row
    this.listOfExistingDocs.forEach((element) => {
      if (element.id != data.id) {
        element.checked = false;
      }
    });
  }

  //function for upload coverletter from existing documents
  uploadCoverExistingFileDocument() {
    this.existingFileSearch = "";
    const selectedExistingDoc = this.listOfExistingDocs.filter(
      (element) => element.checked == true
    );
    this.setCoveringLetterFileByExistingFile(selectedExistingDoc);
    //set value for other documents
    this.existingOtherDocuments = this.listOfExistingDocs.find(
      (element) => element.checked == true
    );
    this.tempExistingOtherDocuments = { ...this.existingOtherDocuments };
    this.model_ExistFile_cover = false;
  }
  //function for set covering letter from add from list
  setCoveringLetterFileByExistingFile(data) {
    const selectedAttachments = data[0].attachments.filter(
      (element) => element.type == "COVERING_LETTER"
    );
    this.coveringDoc = [];
    selectedAttachments.forEach((element) => {
      this.coveringDoc.push({
        name: element.title,
        attachmentUrl: element.documentUrl,
        isDelayStatement: false,
        isMainDocument: false,
        isStatementAsPerRule: false,
        currentNumber: data[0].currentNumber,
        isConfindential: false,
        isLetter: true,
      });
    });
  }

  //function to search cover letter existing file document table
  searchCoverLetterExistingFile() {
    if (this.existingFileSearch) {
      this.listOfExistingDocs = this.tempListOfExistingDocs.filter(
        (element) =>
          (element.currentNumber &&
            element.currentNumber
              .toString()
              .includes(this.existingFileSearch)) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.existingFileSearch.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.existingFileSearch.toLowerCase()))
      );
    } else {
      this.listOfExistingDocs = this.tempListOfExistingDocs;
    }
  }
  //function for coverletter upload checkbox click
  coverRadioButtonClick() {
    this.coveringDoc = [];
    this.coveringDocFileList = [];
    this.mainDoc = [];
    this.fileList = [];
    this.delayDoc = [];
    this.delayList = [];
    this.addDocs = [];
    this.fileLists = [];
    this.existingOtherDocuments = [];
  }

  //show other existing file document model
  showOtherDocumentModel(type) {
    //remove selected document from existing list
    if (
      this.existingOtherDocuments &&
      this.existingOtherDocuments.attachments
    ) {
      const filteredData = this.existingOtherDocuments.attachments.filter(
        (element) =>
          element.checked != true && element.type != "COVERING_LETTER"
      );
      this.existingOtherDocuments.attachments = filteredData;

      this.existingOtherDocuments.attachments.forEach((element) => {
        element.checked = false;
        element.uploadType = type;
      });
      this.model_ExistFile_other = true;
    } else {
      this.notification.info("Info", "Upload Cover Letter..");
    }
  }
  //other existing document table checkbox check
  otherExistingTableCheckBoxCheck(data) {
    //to uncheck other checked row
    this.tempCheckedDoc = data;
    if (data.uploadType !== "additional") {
      this.existingOtherDocuments.attachments.forEach((element) => {
        if (element.id != data.id) {
          element.checked = false;
        }
      });
    }
  }
  //function to uplaod document by existing file document
  uploadOtherExistingDocument() {
    //find the selected file from existing document select
    this.existingFileSearch = "";
    const selectedOtherExistingDoc = this.existingOtherDocuments.attachments.filter(
      (element) => element.checked == true
    );

    if (selectedOtherExistingDoc) {
      //check whether its maindocument,delaystatement or addtional file upload
      switch (selectedOtherExistingDoc[0].uploadType) {
        case "main": {
          this.setMainDocumentFileByExistingFile(selectedOtherExistingDoc);
          break;
        }
        case "delay": {
          this.setDelaystatementFileByExistingFile(selectedOtherExistingDoc);
          break;
        }
        case 'rule': {
          this.setRuleFileByExistingFile(selectedOtherExistingDoc);
          break;
        }
        case "additional": {
          this.setAdditionalFileByExistingFile(selectedOtherExistingDoc);
          break;
        }
      }
      this.model_ExistFile_other = false;
    } else {
      this.notification.info("Info", "Please select one document..");
    }
  }

  //function for set maindocument from add from list
  setMainDocumentFileByExistingFile(data) {
    this.mainDoc = [];
    data.forEach((element) => {
      this.mainDoc.push({
        name: element.title,
        attachmentUrl: element.documentUrl,
        isDelayStatement: false,
        isMainDocument: true,
        isStatementAsPerRule: false,
        currentNumber: this.existingOtherDocuments.currentNumber,
        isConfindential: false,
        isLetter: false,
      });
    });
  }

  //function for set delaystatement from add from list
  setDelaystatementFileByExistingFile(data) {
    this.delayDoc = [];
    data.forEach((element) => {
      this.delayDoc.push({
        name: element.title,
        attachmentUrl: element.documentUrl,
        isDelayStatement: true,
        isMainDocument: false,
        isStatementAsPerRule: false,
        currentNumber: this.existingOtherDocuments.currentNumber,
        isConfindential: false,
        isLetter: false,
      });
    });
  }

  setRuleFileByExistingFile(data) {
    this.ruleDoc = [];
    data.forEach((element) => {
      this.ruleDoc.push({
        name: element.title,
        attachmentUrl: element.documentUrl,
        isDelayStatement: false,
        isMainDocument: false,
        isStatementAsPerRule: true,
        currentNumber: this.existingOtherDocuments.currentNumber,
        isConfindential: false,
        isLetter: false,
      });
    });
  }

  //function for set additional file from add from list
  setAdditionalFileByExistingFile(data) {
    data.forEach((element) => {
      this.addDocs.push({
        name: element.title,
        attachmentUrl: element.documentUrl,
        isDelayStatement: false,
        isMainDocument: false,
        isStatementAsPerRule: false,
        currentNumber: this.existingOtherDocuments.currentNumber,
        isConfindential: false,
        isLetter: false,
      });
    });
  }

  otherRadioButtonClick(type, url, radioValue) {
    //change status for checked document
    if (
      this.existingOtherDocuments &&
      this.existingOtherDocuments.attachments &&
      url != "" && radioValue === 'browse'
    ) {
      this.tempExistingOtherDocuments.attachments.find(
        (element) => element.documentUrl == url
      ).checked = false;

      this.existingOtherDocuments.attachments = this.tempExistingOtherDocuments.attachments.filter(
        (element) =>
          (this.mainDoc.length > 0 ||
            this.delayDoc.length > 0 ||
            this.ruleDoc.length > 0 ||
            this.addDocs.length > 0) &&
          element.checked != true
      );
    }

    switch (type) {
      case "main": {
        this.mainDoc = [];
        this.fileList = [];
        break;
      }
      case "delay": {
        this.delayDoc = [];
        this.delayList = [];
        break;
      }
      case 'rule': {
        this.ruleDoc = [];
        this.ruleList = [];
        break;
      }
      case "additional": {
        this.addDocs = this.addDocs.filter(
          (element) => element.attachmentUrl != url
        );
        this.fileLists = [];
        break;
      }
    }
  }

  additonalFileRadioClick(data) {
    if (
      this.existingOtherDocuments &&
      this.existingOtherDocuments.attachments &&
      data.length > 0 &&
      this.additionalDocument_radioButtonValue === 'browse'
    ) {
      for (const doc of data) {
      this.tempExistingOtherDocuments.attachments.find(
        (element) => element.documentUrl === doc.attachmentUrl
      ).checked = false;

      this.existingOtherDocuments.attachments = this.tempExistingOtherDocuments.attachments.filter(
        (element) =>
          (this.mainDoc.length > 0 ||
            this.delayDoc.length > 0 ||
            this.addDocs.length > 0) &&
          element.checked !== true
      );
      }
    }
    if (data.length > 0) {
      this.addDocs = [];
      this.fileLists = [];
    }
    if (data.length > 0) {
      this.addDocs = [];
      this.fileLists = [];
    }
  }

  //hide exisitng file document model
  hideExistingFileModel(type) {
    if (type == "cover") {
      this.model_ExistFile_cover = false;
    } else {
      this.model_ExistFile_other = false;
      this.existingOtherDocuments.attachments.forEach((element) => {
        if (element.id === this.tempCheckedDoc.id) {
          element.checked = false;
        }
      });
    }
  }

  showCOveringLetterFilePreview(data) {
    const filterData = data.find(
      (element) => element.type == "COVERING_LETTER"
    );
    this.previewVisible = true;
    this.showForm = false;
    this.docUrl = filterData.documentUrl;
  }

  showExistingFilePreview(url) {
    // window.open(url, "_blank");
    this.previewVisible = true;
    this.docUrl = url;
    this.showForm = false;
  }

  onActNameChange(value: string): void {
    if (value) {
    this.listOfActName = this.actNameOptions.filter((option) =>
      option.name && option.name.toLowerCase().includes(value.toLowerCase()) &&
      option.type && option.type.toLowerCase().includes(this.listofdate.actType.toLowerCase())
    );
    const temp = this.actNameOptions.find(
      (element) => element.name && (element.name.toLowerCase() == value.toLowerCase()) &&
      element.type && (element.type.toLowerCase() == this.listofdate.actType.toLowerCase())
    );

    if (temp) {
      this.addAct = false;
    } else {
      this.addAct = true;
    }
   } else {
    this.listOfActName = this.actNameOptions;
   }
  }

  getActName() {
    this.docService.getActName().subscribe((Res) => {
      this.listOfActName = Res;
      this.actNameOptions = this.listOfActName;
    });
  }

  onInstChange(value: string): void {
    if (value) {
    this.listOfInstName = this.InstNameOptions.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
    const temp = [];
    for (const inst of this.InstNameOptions) {
      temp.push(inst.name.toLowerCase());
    }

    if (temp.includes(value.toLowerCase())) {
      this.addInst = false;
    } else {
      this.addInst = true;
    }
   } else {
    this.listOfInstName = this.InstNameOptions;
   }
  }

  getInstName() {
    this.docService.getInstitution().subscribe((Res) => {
      this.listOfInstName = Res;
      this.InstNameOptions = this.listOfInstName;
    });
  }

  saveActAndInstitution() {
    if (this.addAct) {
      const body = {
        name: this.validateForm.value.actName,
        type: this.validateForm.value.actType,
        date: this.validateForm.value.date,
      };
      this.docService.saveActName(body).subscribe();
    }
    if (this.addInst) {
      const body = {
        name: this.validateForm.value.nameOfInst,
      };
      this.docService.saveInstitution(body).subscribe();
    }
  }

  getVersion(version) {
    this.listofdate = this.docResponse.versionMap[version];
  }

  getReferenceDocuments() {
    this.docService.getApprovedAmendments().subscribe((Response) => {
      this.listOfReferenceDoc = Response;
    });
  }

  addReferenceValidation() {
    if (this.docResponse.cplDocumentResponseDto.subType === "REVISED") {
      this.validateForm
        .get("typeReference")
        .setValidators([Validators.required]);
    } else {
      this.validateForm.get("typeReference").clearValidators();
    }
  }
  showConfidental(isViewable, url) {
    if (isViewable) {
      this.previewVisible = true;
      this.docUrl = url;
      this.showForm = true;
    } else {
      this.isconfidential = true;
    }
  }
  Closemodel() {
    this.isconfidential = false;
  }

  withdrawDoc() {
    this.docService
      .departmentWithdraw(this.id, this.reason)
      .subscribe((Res) => {
        this.notification.create(
          "success",
          "Success",
          "Document Withdrawal Request Successfull"
        );
        this.router.navigate(["business-dashboard/cpl/documents"]);
      });
  }

  showWithdrawModal() {
    this.withdrawModal = true;
  }

  // currentAssemblyAndSession() {
  //   this.commonService.getCurrentAssemblyAndSession().subscribe(Res => {
  //     this.activeSession = Res;
  //     this.getAllAssemblyAndSession();
  //     // this.getAssemblyList();
  //     // this.getSessionList();
  //   });
  // }

  getAllAssemblyAndSession() {
    this.docService.getAllAssemblyAndSession().subscribe((Response: any) => {
      this.assemblySession = Response.assemblySession;
      this.activeSession  = Response.activeAssemblySession;
      this.assemblyList = Response.assembly.filter(x => x.assemblyId >= this.activeSession.assemblyValue);
      this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
      this.getSessionForAssembly();
    });
  }

  getSessionForAssembly() {
    this.sessionList = [];
    this.validateForm.controls.session.reset();
    if (this.validateForm.value.assembly === 0) {
      this.validateForm.controls.session.reset();
      this.validateForm.patchValue({
        session: 0
      });
      this.sessionList = [{
              id: 0,
              sessionId: 'No Session',
            }];
    } else {
      if (this.assemblySession.find(x => x.id === this.validateForm.value.assembly)) {
        this.validateForm.controls.session.reset();
        this.sessionList = this.assemblySession.find(x => x.id === this.validateForm.value.assembly).session;
      }
    }
    if (this.validateForm.value.assembly === this.activeSession.assemblyId) {
      this.sessionList = this.sessionList.filter(x => x.sessionId >= this.activeSession.sessionValue);
    }
  }

  // getAssemblyList() {
  //   this.docService.getAllAssembly().subscribe((Response) => {
  //     const tempList: any = Response;
  //     this.assemblyList = tempList.filter(
  //       (x) => x.id >= this.activeSession.assemblyId
  //     );
  //     this.assemblyList.push({
  //       id: 0,
  //       assemblyId: "No Assembly",
  //     });
  //   });
  // }

  // getSessionList() {
  //   this.docService.getAllSession().subscribe((Response) => {
  //     const tempList: any = Response;
  //     this.sessionList = tempList.filter(
  //       (x) => x.id >= this.activeSession.sessionId
  //     );
  //     this.sessionList.push({
  //       id: 0,
  //       sessionId: "No Session",
  //     });
  //   });
  // }

  tempDataAdd() {
    this.tempData = {
    actName: this.listofdate.actName,
    actType: this.listofdate.actType,
    assembly: this.listofdate.assembly,
    assemblyId: this.listofdate.assemblyId,
    attachments: this.listofdate.attachments,
    confindential: this.listofdate.confindential,
    createdDate: this.listofdate.createdDate,
    createdby: this.listofdate.createdby,
    currentNumber: this.listofdate.currentNumber,
    currentVersion: this.listofdate.currentVersion,
    date: this.listofdate.date,
    delayStatus: this.listofdate.delayStatus,
    departmentFileNumber: this.listofdate.departmentFileNumber,
    fileId: this.listofdate.fileId,
    gazettePublishDate: this.listofdate.gazettePublishDate,
    goDate: this.listofdate.goDate,
    goNumber: this.listofdate.goNumber,
    id: this.listofdate.id,
    isDelayed: this.listofdate.isDelayed,
    isStatementAsPerRule: this.listofdate.isStatementAsPerRule,
    layingDate: this.listofdate.layingDate,
    layingProvisionInAct: this.listofdate.layingProvisionInAct,
    listFileId: this.listofdate.listFileId,
    listFileNumber: this.listofdate.listFileNumber,
    ministerDepartmentId: this.listofdate.ministerDepartmentId,
    ministerDepartmentName: this.listofdate.ministerDepartmentName,
    ministerName: this.listofdate.ministerName,
    nameOfInstitution: this.listofdate.nameOfInstitution,
    numberOfDaysInSabha: this.listofdate.numberOfDaysInSabha,
    portfolioId: this.listofdate.portfolioId,
    portfolioName: this.listofdate.portfolioName,
    referenceFileId: this.listofdate.referenceFileId,
    referenceFileNumber: this.listofdate.referenceFileNumber,
    regFileNumber: this.listofdate.regFileNumber,
    sectionName: this.listofdate.sectionName,
    session: this.listofdate.session,
    sessionId: this.listofdate.sessionId,
    status: this.listofdate.status,
    subType: this.listofdate.subType,
    title: this.listofdate.title,
    type: this.listofdate.type,
    typeDate: this.listofdate.typeDate,
    typeName: this.listofdate.typeName,
    typeNumber: this.listofdate.typeNumber,
    typeReference: this.listofdate.typeReference,
    typeYear: this.listofdate.typeYear,
    updatedDate: this.listofdate.updatedDate,
    withdrawalFileId: this.listofdate.withdrawalFileId,
    withdrawalFileNumber: this.listofdate.withdrawalFileNumber,
    withdrawalId: this.listofdate.withdrawalId,
    withdrawalReason: this.listofdate.withdrawalReason,
    workflowId: this.listofdate.workflowId,
    subjectId: this.listofdate.subjectId,
    ministerSubjectName: this.listofdate.ministerSubjectName
    };
  }

  viewFile(fileId) {
    this.router.navigate(["business-dashboard/cpl/file-workflow", fileId]);
  }

  viewDocument(id) {
    this.router.navigate(["business-dashboard/cpl/cpl-view", "view", id]);
  }

  requestCorrection() {
    this.router.navigate(['business-dashboard/correspondence/select-template'], {
      state: {
        business: 'CORRECTION_STATEMENT_REQUEST',
        type: this.user.correspondenceCode.code,
        fileId: this.docResponse.cplDocumentResponseDto.fileId,
        businessReferId: this.docResponse.cplDocumentResponseDto.id,
        businessReferType: this.docResponse.cplDocumentResponseDto.type,
        businessReferSubType: this.docResponse.cplDocumentResponseDto.subType,
        businessReferNumber: this.docResponse.cplDocumentResponseDto.typeNumber,
        fileNumber: this.docResponse.cplDocumentResponseDto.regFileNumber,
        departmentId: this.docResponse.cplDocumentResponseDto.ministerDepartmentId,
        masterLetter: null,
        refrenceLetter: null,
        toCode: 'CPL_SECTION',
        toDisplayName: 'CPL'
      },
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

  hidePreview() {
    this.previewVisible = false;
  }

  handlePreview = async (file: UploadFile) => {
    this.previewVisible = true;
    this.docUrl = file.response.body;
    this.showForm = true;
  }

  yearValidation() {
    if (this.listofdate.subType === 'AUDIT' || this.listofdate.subType === 'ANNUAL') {
      this.getYearList(false);
    } else {
      this.getYearList(true);
    }
  }

   getYearList(uptoCurrentYear) {
    this.yearList = [];
    this.rangeList = [];
    let currentYear: any;
    if (uptoCurrentYear) {
      currentYear = new Date().getFullYear();
      let startYear = currentYear - 50;
      while (startYear <= currentYear) {
      const previousYear = startYear;
      this.rangeList.push(previousYear + '-' + (previousYear + 1));
      this.yearList.push(startYear++);
      }
    } else {
       // currentYear = new Date().getFullYear() - 1;
       currentYear = new Date().getFullYear();
       let startYear = currentYear - 20;
       // while (startYear < currentYear)
       while (startYear <= currentYear) { 
      const previousYear = startYear;
      this.rangeList.push(previousYear + '-' + (previousYear + 1));
      this.yearList.push(startYear++);
    } 
    }
    currentYear = new Date().getFullYear();
    let startYear = currentYear - 20;
    while (startYear <= currentYear) {
      this.ordYearList.push(startYear++);
    }
  }

  _clearVariables() {
    this.validateForm.controls.documentname.reset();
    this.validateForm.controls.documentfileno.reset();
    this.validateForm.controls.docNumber.reset();
    this.validateForm.controls.docDate.reset();
    this.validateForm.controls.nameOfInst.reset();
    this.validateForm.controls.docYear.reset();
    this.validateForm.controls.gono.reset();
    this.validateForm.controls.goDate.reset();
    this.validateForm.controls.actType.reset();
    this.validateForm.controls.actName.reset();
    this.validateForm.controls.dateOfGazette.reset();
    this.validateForm.controls.layingprovision.reset();
    this.validateForm.controls.insabha.reset();
    this.validateForm.controls.asPerRule.reset();
    this.validateForm.controls.dateOfOrdinance.reset();
    this.validateForm.controls.docsubtype.reset();
    this.isDelayNeeded = false;

    // if (this.cplTabs.department == false) {
    //   this.validateForm.controls.ministerfor.reset();
    //   this.validateForm.controls.ministerdepartmentId.reset();
    // }
    this.validateForm.controls.ministerfor.reset();
    this.validateForm.controls.ministerdepartmentId.reset();
  }

  returnGO() {
    if (this.listofdate.type === 'SRO') {
      return 'cpl.documents.gonumber';
    } else {
      return 'cpl.docpreparion.notificationnumber';
    }
  }

  returnLetter() {
    if (this.listofdate.type === 'SRO' || this.listofdate.type === 'ORDINANCE') {
    return 'cpl.registration.letter';
    } else {
      return this.listofdate.type;
    }
  }

  returnVersion() {
    return 'cpl.filelistflow.version';
  }
}
