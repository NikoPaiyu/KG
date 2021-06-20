import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { CplDocs } from "../shared/models/registration";
import { DocumentsService } from "../shared/services/documents.service";
import {
  NzMessageService,
  UploadChangeParam,
  NzNotificationService,
} from "ng-zorro-antd";
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import { CplFile } from "../shared/models/create-file";
import { FilesService } from "../shared/services/files.service";
import { CommonService } from "../shared/services/common.service";
import { element } from "protractor";
import { UploadFile } from 'ng-zorro-antd/upload';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: "cpl-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"],
})
export class RegistrationComponent implements OnInit {
  id;
  date: string = "dd-MM-yyyy";
  dateOfGazette: any;
  sroDate: any;
  goDate: any;
  today: any = new Date();
  validateForm: FormGroup;
  ministerDept: any = null;
  minPortfolios: any = [];
  docList: any = [];
  documentname;
  disableFields = true;
  docType = ["SRO", "REPORT"];
  docBody: any = {};
  ministerdepartmentId;
  docsubtype = "NEW";
  user;
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
  doctype = "";
  fileList = [];
  fileLists = [];
  delayList = [];
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
  uploadURL = this.docService.uploadUrl();
  assemblyList = [];
  sessionList = [];
  uploadURL1 = this.docService.uploadUrl();
  isDelayNeeded: boolean;
  delayStatement: {
    name: string;
    attachmentUrl: any;
    isDelayStatement: boolean;
    isMainDocument: boolean;
    isStatementAsPerRule: boolean;
    isConfindential: boolean;
  };
  isAttachVisible = false;
  searchPending: any;
  hide = false;
  searchFileNum: any;
  searchFileSub: any;
  pendingFiles: any = [];
  checkedFileId = null;
  fileNumType: any = "false";
  currentNum: any = null;
  currentNumOption: any = [];
  fileSub = null;
  filePriority = null;
  fileDesc = null;
  listOfPending: any;
  checkedFile = null;
  setOfCheckedId = new Set<any>();
  fileNumber: any;
  assemblyId: any;
  sessionId: any;
  notify: any;
  mainDoc: any = [];
  addDocs: any = [];
  delayDoc: any = [];
  arisingNum: any;
  currentUser;
  deptUser;
  actType: any;
  actName: any;
  asPerRule: any;
  year: any;
  layingprovision: any;
  fileForPortfolio: any;
  ruleDoc: any = [];
  ruleList: any = [];
  documentfileno;
  docNumber;
  sectionName;
  docDate;
  nameOfInst;
  docYear;
  ministerfor;
  subId;
  gono;
  delatstatment;
  insabha;
  dateOfOrdinance;
  cplPermission = this.getPermission();
  coveringDocument_radioButtonValue = "browse";
  mainDocument_radioButtonValue = "browse";
  additionalDocument_radioButtonValue = "browse";
  delaystatement_radioButtonValue = "browse";
  ruleRadioButtonValue = 'browse';
  listOfExistingDocs: any = [];
  tempListOfExistingDocs;
  model_ExistFile_cover = false;
  model_ExistFile_other = false;
  existingFileSearch;
  radioValue = null;
  listOfActName: any = [];
  actNameOptions: any = [];
  index = 0;
  currentNumber: any = [];
  tempFileForPortfolio: any = [];
  cplSectionId: any;
  addAct: any = false;
  addInstitution: any = false;
  InstNameOptions: any = [];
  listOfInstName: any = [];
  confidentialityCheck = false;
  maindocCheck = false;
  typeReference: any;
  listOfReferenceDoc: any = [];
  coveringDoc: any = [];
  coveringDocFileList = [];
  existingOtherDocuments: any = [];
  tempExistingOtherDocuments: any = [];
  activeSession: any = [];
  showButton = false;
  osId = null;
  osResponse: any = null;
  osDisable = false;
  previewVisible = false;
  docUrl: any = null;
  tempCheckedDoc: any;
  showForm = false;
  yearList: any = [];
  rangeList: any = [];
  yearRadio = 'Financial Year';
  deptSubjects: any = [];
  ordYearList: any = [];
  assemblySession: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private docService: DocumentsService,
    private msg: NzMessageService,
    private fileService: FilesService,
    private notification: NzNotificationService,
    private commonService: CommonService,
    public translate: TranslateService,
    @Inject("notify") notify,
    @Inject("authService") private AuthService
  ) {
    this.notify = notify;
    this.user = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    this.cplSectionId = this.commonService.getSectionId();
  }

  ngOnInit() {
    this.getYearList(true);
    this.formValidation();
    // this.currentAssemblyAndSession();
    this.getAllAssemblyAndSession();
    this.getAllPortfolios();
    if (this.route.snapshot.params.id) {
      this.osId = this.route.snapshot.params.id;
      this.setValueForRegister(this.osId);
      this.osDisable = true;
    }
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    this.cplPermission.department = false;
    setTimeout(() => {
      this.loadCPLTabs();
      this.assemblyId = 0;
      this.sessionId = 0;
      this.validateForm.patchValue({
        assembly: 0,
        session: 0,
      });
      if (this.cplPermission.department) {
        this.getDeptuser();
      }
    }, 500);
    this.getInstName();
    this.getActName();
    this.getReferenceDocuments();
  }

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
    this.validateForm.controls.session.reset();
    this.sessionList = [];
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

  getAllPortfolios() {
    this.docService.getAllPortfolios().subscribe((Res) => {
      this.minPortfolios = Res;
    });
  }

  getMinisterDepartments(portfolioId) {
    this.docService.getMinisterDepartments(portfolioId).subscribe((Res) => {
      this.ministerDept = Res;
      if (this.osId) {
        this.ministerdepartmentId = this.osResponse.departmentId;
      }
    });
  }

  getAllSubjects(deptId) {
    if (deptId) {
      this.docService.getAllSubjectsByDepartmentId(deptId).subscribe((Res: any) => {
        this.deptSubjects = Res;
        if (this.osId) {
            this.subId = this.osResponse.subjectId;
        }
      });
    }
  }

  onMinisterChange(event) {
    if (this.validateForm.value.ministerfor) {
      if (event !== null) {
        this.getMinisterDepartments(event);
      }
    }
    if (!this.osDisable) {
      this.coveringDoc = [];
      this.coveringDocFileList = [];
    }
    this.ministerdepartmentId = null;
    this.subId = null;
    this.ministerDept = null;
  }
  onDepartmentChange(event) {
    if (this.validateForm.value.ministerdepartmentId) {
      if (!this.osDisable) {
        this.coveringDoc = [];
        this.coveringDocFileList = [];
      }
    }
    this.subId = null;
  }
  handleChange(info: UploadChangeParam): void {
    const fileList = info.fileList;
    this.mainDoc = [];
    if (info.file.response) {
      for (const file of fileList) {
        file.url = file.response.body;
        this.mainDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: false,
          isMainDocument: true,
          isStatementAsPerRule: false,
          currentNumber: null,
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
  handleChange1(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.addDocs = [];
    if (info.file.response) {
      for (const file of fileLists) {
        if (file.response) {
          file.url = file.response.body;
          this.addDocs.push({
          name: file.name,
          attachmentUrl: file.response.body,
          isDelayStatement: false,
          isMainDocument: false,
          isStatementAsPerRule: false,
          currentNumber: null,
          isConfindential: false,
          isLetter: false,
        });
       }
      }
    }
    this.fileLists = fileLists.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }

  handleDelayChange(info: UploadChangeParam): void {
    const delayList = info.fileList;
    this.delayDoc = [];
    if (info.file.response) {
      for (const file of delayList) {
        file.url = file.response.body;
        this.delayDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: true,
          isMainDocument: false,
          isStatementAsPerRule: false,
          currentNumber: null,
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
        file.url = file.response.body;
        this.ruleDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: false,
          isMainDocument: false,
          isStatementAsPerRule: true,
          currentNumber: null,
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
      actType: [null],
      actName: [null],
      asPerRule: [null],
      dateOfOrdinance: [null],
      maindocCheck: [false],
      add_docCheck: [false],
      typeReference: [null],
      yearType: [null]
    });
  }

  addDynamicValidation() {
    this.isDelayNeeded = false;
    if (this.doctype !== 'ORDINANCE' && this.cplPermission.createOrdinance && !this.user.authorities.includes('assistant')) {
      this.getDeptuser();
      this.validateForm.value.ministerdepartmentId = null;
      this.validateForm.value.ministerfor = null;
    }
    this._clearVariables();
    this.validateForm.get("doctype").valueChanges.subscribe((type) => {
      if (type === "SRO") {
        if (this.docsubtype !== 'REVISED') {
           this.docsubtype = 'NEW';
        }
        this.validateForm.get("gono").setValidators([Validators.required]);
        this.validateForm.get("goDate").setValidators([Validators.required]);
        this.validateForm.get("docNumber").setValidators([Validators.required]);
        this.validateForm.get("docDate").setValidators([Validators.required]);
        this.validateForm.get("actType").setValidators([Validators.required]);
        this.validateForm.get("actName").setValidators([Validators.required]);
        this.validateForm.get("deptSubjectId").setValidators([Validators.required]);
        this.validateForm
          .get("docsubtype")
          .setValidators([Validators.required]);
        this.validateForm
          .get("dateOfGazette")
          .setValidators([Validators.required]);
        this.validateForm
          .get("layingprovision")
          .setValidators([Validators.required]);
        if (this.cplPermission.department) {
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
      } else if (type === "ORDINANCE") {
        this.validateForm.get("docNumber").setValidators([Validators.required]);
        this.validateForm.get("docDate").setValidators([Validators.required]);
        this.validateForm.get("asPerRule").setValidators([Validators.required]);
        this.validateForm.get("gono").setValidators([Validators.required]);
        this.validateForm.get("deptSubjectId").setValidators([Validators.required]);
        this.validateForm.get("docYear").setValidators([Validators.required]);
        this.validateForm
          .get("dateOfGazette")
          .setValidators([Validators.required]);
        this.validateForm
          .get("dateOfOrdinance")
          .setValidators([Validators.required]);
        if (this.cplPermission.department) {
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
        this.validateForm.get("goDate").clearValidators();
        this.validateForm.get("actType").clearValidators();
        this.validateForm.get("actName").clearValidators();
        this.validateForm.get("layingprovision").clearValidators();
        this.validateForm.get("insabha").clearValidators();
        this.validateForm.get("sectionName").clearValidators();
        this.validateForm.get("docsubtype").clearValidators();
        this.validateForm.get("nameOfInst").clearValidators();
      } else if (type === "ACT") {
        this.validateForm
          .get("sectionName")
          .setValidators([Validators.required]);
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
        this.validateForm.get("dateOfGazette").clearValidators();
        this.validateForm.get("dateOfOrdinance").clearValidators();
        this.validateForm.get("ministerfor").clearValidators();
        this.validateForm.get("ministerdepartmentId").clearValidators();
        this.validateForm.get("deptSubjectId").clearValidators();
      } else if (type === "REPORT") {
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
        this.validateForm.get("deptSubjectId").setValidators([Validators.required]);
        this.validateForm.get("docDate").setValidators([Validators.required]);
        this.validateForm.get("gono").clearValidators();
        this.validateForm.get("goDate").clearValidators();
        this.validateForm.get("docNumber").clearValidators();
        if (this.cplPermission.department) {
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
        this.validateForm.get("actType").clearValidators();
        this.validateForm.get("actName").clearValidators();
        this.validateForm.get("insabha").clearValidators();
        this.validateForm.get("asPerRule").clearValidators();
        this.validateForm.get("sectionName").clearValidators();
        this.validateForm.get("dateOfGazette").clearValidators();
        this.validateForm.get("dateOfOrdinance").clearValidators();
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
        this.validateForm.get("dateOfGazette").clearValidators();
        this.validateForm.get("dateOfOrdinance").clearValidators();
        this.validateForm.get("ministerfor").clearValidators();
        this.validateForm.get("ministerdepartmentId").clearValidators();
      }
    });
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  submitForm(isSave): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let tempStatus;
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
      this.mainDoc[0].isConfindential = true;
    }
    this.docList = [
      ...this.mainDoc,
      ...this.addDocs,
      ...this.delayDoc,
      ...this.ruleDoc,
      ...this.coveringDoc,
    ];
    let docSubType: any;
    if (this.cplPermission.department) {
      this.validateForm.value.ministerdepartmentId = this.deptUser.data.details.departmentId;
      this.validateForm.value.ministerfor = this.deptUser.data.details.portfolioId;
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
    if (this.validateForm.valid && this.mainDoc.length > 0) {
      let rule;
      if (this.validateForm.value.asPerRule === "yes") {
        rule = true;
      } else {
        rule = false;
      }
      if (
        this.validateForm.value.doctype === "REPORT" ||
        this.validateForm.value.doctype === "SRO"
      ) {
        docSubType = this.validateForm.value.docsubtype;
      } else {
        docSubType = "NO_SUBTYPE";
      }
      this.docBody = {
        assemblyId: this.validateForm.value.assembly,
        sessionId: this.validateForm.value.session,
        currentNumber: this.mainDoc[0].currentNumber
          ? this.mainDoc[0].currentNumber
          : 0,
        attachments: this.docList,
        gazettePublishDate: this.validateForm.value.dateOfGazette,
        goDate: this.validateForm.value.goDate,
        goNumber: this.validateForm.value.gono,
        isDelayed: this.isDelayNeeded,
        isStatementAsPerRule: rule,
        date: this.validateForm.value.dateOfOrdinance,
        ministerDepartmentId: this.validateForm.value.ministerdepartmentId,
        portfolioId: this.validateForm.value.ministerfor,
        subjectId: this.validateForm.value.deptSubjectId,
        typeDate: this.validateForm.value.docDate,
        typeNumber: this.validateForm.value.docNumber,
        subType: docSubType,
        type: this.validateForm.value.doctype,
        typeName: this.validateForm.value.documentname,
        status: "SAVED",
        departmentFileNumber: this.validateForm.value.documentfileno,
        numberOfDaysInSabha: this.validateForm.value.insabha,
        layingProvisionInAct: this.validateForm.value.layingprovision,
        actType: this.validateForm.value.actType,
        actName: this.validateForm.value.actName,
        sectionName: this.validateForm.value.sectionName,
        typeYear: this.validateForm.value.docYear,
        nameOfInstitution: this.validateForm.value.nameOfInst,
        createdBy: this.user.userId,
        confindential: this.maindocCheck,
        typeReference: this.validateForm.value.typeReference,
      };
      if (this.cplPermission.department) {
        if (
          this.isDelayNeeded &&
          this.delayDoc.length === 0 &&
          docSubType !== "COMPTROLLER_AUDITOR_GOI"
        ) {
          this.notification.create(
            "warning",
            "Warning",
            "Please Upload Delay Statement!"
          );
          
        } else {
          if (isSave) {
            this.saveDeptDoc(true);
          } else {
            if (this.docList.find(x => x.isLetter === true)) {
              this.saveDeptDoc(false);
            } else {
              this.notification.create(
                "warning",
                "Warning",
                "Please Upload Covering Letter to Continue!"
              );
            }
          }
        }
      } else {
        if (isSave) {
          this.saveDoc();
        } else {
          this.registerAndAttach();
        }
      }
    } else if (this.mainDoc.length === 0) {
      this.notification.create(
        "warning",
        "Warning",
        "Please Upload Main Document!"
      );
    } else {
      this.notification.create(
        "error",
        "Error",
        "Fill in the required fields!"
      );
    }
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  dateOfGazetteValidationCheck() {
    // 2 month validation check -> 60 days check changed to 2 months
    if (this.validateForm.value.doctype !== 'ORDINANCE' && this.validateForm.value.dateOfGazette) {
      const twoMonthPrior = this.today.getMonth() - 2;
      const selectedMonth = this.validateForm.value.dateOfGazette.getMonth();
      const twoMonthPriorDay = this.today.getDate();
      const selectedMonthDay = this.validateForm.value.dateOfGazette.getDate();
      if (this.today.getFullYear() - this.validateForm.value.dateOfGazette.getFullYear() > 1) {
        this.isDelayNeeded = true;
      } else  if (this.today.getFullYear() - this.validateForm.value.dateOfGazette.getFullYear() === 1) {
        if (selectedMonth - this.today.getMonth() < 10 ||
        (selectedMonth - this.today.getMonth() === 10 && selectedMonthDay - twoMonthPriorDay < 0)) {
          this.isDelayNeeded = true;
        } else {
          this.isDelayNeeded = false;
        }
      } else if (this.today.getFullYear() - this.validateForm.value.dateOfGazette.getFullYear() === 0) {
        if (selectedMonth - twoMonthPrior < 0 ||
          (selectedMonth - twoMonthPrior === 0 && selectedMonthDay - twoMonthPriorDay < 0)) {
            this.isDelayNeeded = true;
          } else {
            this.isDelayNeeded = false;
          }
      } else {
        this.isDelayNeeded = false;
      }
    } else {
      this.isDelayNeeded = false;
    }
}

treatAsUTC(date): any {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

  docYearChange() {
    let docYear = this.validateForm.value.docYear;
    if (this.validateForm.value.docYear && 
      this.validateForm.value.docsubtype !== 'COMPTROLLER_AUDITOR_GOI') {
      let arrDocYear = docYear.split("-");
      let endDate: Date = new Date(arrDocYear[1] + "-12-31 23:59:59");
      const diffInDays = differenceInCalendarDays(this.today, endDate);
      if (diffInDays < 0) {
        this.isDelayNeeded = true;
      } else {
        this.isDelayNeeded = false;
      }
    } else {
      this.isDelayNeeded = false;
    }
    // let diffInDays
    // let docYear = this.validateForm.value.docYear;
    // if (this.validateForm.value.docYear) {
    //   if (this.yearRadio==='Financial Year') {
    //     let arrDocYear = docYear.split('-');
    //     let endDate: Date = new Date(arrDocYear[1] + "-12-31 23:59:59");
    //     diffInDays = differenceInCalendarDays(this.today, endDate);
    //   } else {
    //     const currentYear = new Date().getFullYear() - 1;
    //     diffInDays = docYear - currentYear;
    //   }
    //   if (diffInDays < 0) {
    //     this.isDelayNeeded = true;
    //   } else {
    //     this.isDelayNeeded = false;
    //   }
    // }
  }

  showAttachModal(): void {
    if ((this.validateForm.value.assembly === null && this.validateForm.value.session === null) ||
    (this.validateForm.value.assembly === null && this.validateForm.value.session === 0) ||
    (this.validateForm.value.assembly === 0 && this.validateForm.value.session === null)) {
      this.validateForm.controls.assembly.setValue(0);
      this.validateForm.controls.session.setValue(0);
      this.hide = false;
      this.isAttachVisible = true;
      this.getFileForPortfolio();
    } else if ((this.validateForm.value.assembly === 0 || this.validateForm.value.assembly === null) &&
        this.validateForm.value.session !== null
        && this.validateForm.value.session !== 0) {
      this.validateForm.controls.assembly.reset();
      this.validateForm.get('assembly').setValidators([Validators.required]);
      // tslint:disable-next-line:forin
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    } else if ((this.validateForm.value.session === 0 ||  this.validateForm.value.session === null)
        && this.validateForm.value.assembly !== null
        && this.validateForm.value.assembly !== 0) {
      this.validateForm.controls.session.reset();
      this.validateForm.get('session').setValidators([Validators.required]);
      // tslint:disable-next-line:forin
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    } else {
      this.hide = false;
      this.isAttachVisible = true;
      this.getFileForPortfolio();
    }
  }

  getFileForPortfolio() {
    let subType;
    if (
      this.validateForm.value.doctype !== "REPORT" &&
      this.validateForm.value.doctype !== "SRO"
    ) {
      subType = "NO_SUBTYPE";
    } else {
      subType = this.validateForm.value.docsubtype;
    }
    const body = {
      assemblyId: this.validateForm.value.assembly,
      sessionId: this.validateForm.value.session,
      portfolioId: this.validateForm.value.ministerfor,
      cplType: this.validateForm.value.doctype,
      cplSubType: subType,
      userId: this.user.userId,
      departmentId: this.validateForm.value.ministerdepartmentId
    };
    this.fileService.getFileForPortfolio(body).subscribe((Res: any) => {
      this.fileForPortfolio = Res.filter(file => file.status !== 'CLOSURE_PENDING');
      this.tempFileForPortfolio = this.fileForPortfolio;
    });
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
    this.radioValue = null;
    this.fileNumType = "false";
    this.currentNum = null;
    this.searchFileSub = null;
    this.searchFileNum = null;
    this.searchPending = null;
    this.fileSub = null;
    this.fileDesc = null;
    this.filePriority = null;
  }

  fileNum() {
    this.currentNumOption = [];
    this.currentNumOption = [this.arisingNum.body];
    this.currentNum = this.arisingNum.body;
  }

  closeadvancefilter() {
    this.hide = false;
    this.searchFileSub = null;
    this.searchFileNum = null;
    this.fileNumType = "false";
  }

  saveDoc() {
    this.docService.registerDocument(this.docBody).subscribe((Res) => {
      this.saveActAndInstitution();
      const temp: any = Res;
      this.validateForm.reset();
      this.fileList = [];
      this.fileLists = [];
      this.showUploadList = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.showUploadList1 = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.showDelayList = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.showRuleList = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.docList = [];
      this.notification.create(
        "success",
        "Success",
        "Document Saved Successfully!"
      );
      this.router.navigate([
        "business-dashboard/cpl/cpl-view",
        "view",
        temp.cplDocumentResponseDto.id,
      ]);
    });
  }

  registerAndAttach() {
    const file = new CplFile();
    let subDocType;
    if (this.validateForm.value.doctype === "REPORT") {
      subDocType = this.validateForm.value.docsubtype;
    } else {
      subDocType = this.validateForm.value.doctype;
    }

    if (this.checkedFileId === null) {
      file.fileFormDto = {
        currentNumber: this.currentNum,
        assemblyId: this.validateForm.value.assembly,
        assignedTo: 0,
        description: this.fileDesc,
        priority: this.filePriority,
        sectionId: this.cplSectionId,
        sessionId: this.validateForm.value.session,
        subject: this.fileSub,
        subtype: subDocType,
        type: "CPL",
        userId: this.user.userId,
      };
    } else {
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
    }
    const body = {
      document: this.docBody,
      fileFormDto: file.fileFormDto,
    };
    this.docService.registerAndAttachDoc(body).subscribe((Res) => {
      this.saveActAndInstitution();
      const temp: any = Res;
      if (this.checkedFileId === null) {
        this.notification.create(
          "success",
          "Success",
          "File created with file number " +
            temp.cplDocumentResponseDto.regFileNumber,
          { nzDuration: 5000 }
        );
      } else {
        this.notification.create(
          "success",
          "Success",
          "Document attached to file with file number " +
            temp.cplDocumentResponseDto.regFileNumber,
          { nzDuration: 5000 }
        );
      }
      this.validateForm.reset();
      this.fileList = [];
      this.fileLists = [];
      this.showUploadList = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.showUploadList1 = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.showDelayList = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.showRuleList = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.radioValue = null;
      this.docList = [];
      this.hide = false;
      this.isAttachVisible = false;
      this.router.navigate([
        "business-dashboard/cpl/cpl-view",
        "view",
        temp.cplDocumentResponseDto.id,
      ]);
    });
  }

  saveDeptDoc(isSave) {
    this.docService.saveDeptDoc(this.docBody).subscribe((Res) => {
      this.saveActAndInstitution();
      if (!isSave) {
        const temp: any = Res;
        const id = temp.cplDocumentResponseDto.id;
        this.submitDeptDoc(id);
      }
      if (isSave) {
        const temp: any = Res;
        this.validateForm.reset();
        this.fileList = [];
        this.fileLists = [];
        this.showUploadList = {
          showPreviewIcon: false,
          showRemoveIcon: false,
          hidePreviewIconInNonImage: false,
        };
        this.showUploadList1 = {
          showPreviewIcon: false,
          showRemoveIcon: false,
          hidePreviewIconInNonImage: false,
        };
        this.showDelayList = {
          showPreviewIcon: false,
          showRemoveIcon: false,
          hidePreviewIconInNonImage: false,
        };
        this.showRuleList = {
          showPreviewIcon: false,
          showRemoveIcon: false,
          hidePreviewIconInNonImage: false,
        };
        this.docList = [];
        this.notification.create(
          "success",
          "Success",
          "Document Saved Successfully!"
        );
        this.router.navigate([
          "business-dashboard/cpl/cpl-view",
          "view",
          temp.cplDocumentResponseDto.id,
        ]);
      }
    });
  }

  submitDeptDoc(DocId) {
    const body = {
      id: DocId,
    };
    this.docService.submitDeptDoc(body).subscribe((Res) => {
      const temp: any = Res;
      this.validateForm.reset();
      this.fileList = [];
      this.fileLists = [];
      this.showUploadList = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.showUploadList1 = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.showDelayList = {
        showPreviewIcon: false,
        showRemoveIcon: false,
        hidePreviewIconInNonImage: false,
      };
      this.docList = [];
      this.notification.create(
        "success",
        "Success",
        "Document Submitted Successfully!"
      );
      this.router.navigate([
        "business-dashboard/cpl/cpl-view",
        "view",
        temp.cplDocumentResponseDto.id,
      ]);
    });
  }

  getPermission() {
    return {
      department: false,
      createOrdinance: false
    };
  }

  loadCPLTabs() {
    if (this.commonService.doIHaveAnAccess("DEPARTMENT", "CREATE")) {
      this.cplPermission.department = true;
    }
    if (
      this.commonService.doIHaveAnAccess("DOCUMENT_CONFIDENTIALITY", "CREATE")
    ) {
      this.confidentialityCheck = true;
    }
    if (
      this.commonService.doIHaveAnAccess("ORDINANCE_CREATE", "CREATE")
    ) {
      this.cplPermission.createOrdinance = true;
      this.docType.push('ORDINANCE');
    }
    this.showButton = true;
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

    // if (this.cplPermission.department == false) {
    //   this.validateForm.controls.ministerfor.reset();
    //   this.validateForm.controls.ministerdepartmentId.reset();
    // }
    this.validateForm.controls.ministerfor.reset();
    this.validateForm.controls.ministerdepartmentId.reset();
  }

  //function for show coverletter model show
  showCoverLetterModel() {
    this.existingFileSearch = null;
    this.model_ExistFile_cover = true;
    this.getCoverExistingDocuments();
  }
  //function to get existing documents for upload
  getCoverExistingDocuments() {
    let body = {
      assemblyId:
        this.validateForm.value.assembly == 0
          ? null
          : this.validateForm.value.assembly,
      sessionId:
        this.validateForm.value.session == 0
          ? null
          : this.validateForm.value.session,
      sectionId: this.cplSectionId,
      status: "ASSIGNED",
      type:
        this.validateForm.value.doctype == ""
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
    if (selectedExistingDoc.length > 0) {
      this.setCoveringLetterFileByExistingFile(selectedExistingDoc);
      //set value for other documents
      this.existingOtherDocuments = this.listOfExistingDocs.find(
        (element) => element.checked == true
      );
      this.tempExistingOtherDocuments = { ...this.existingOtherDocuments };
      this.model_ExistFile_cover = false;
    } else {
      this.notification.info("Info", "Please select one document...");
    }
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
      this.currentNumber = [];
      if (!this.currentNumber.includes(data[0].currentNumber)) {
        this.currentNumber.push(data[0].currentNumber);
      }
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
    this.currentNumber = [];
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

    if (selectedOtherExistingDoc.length > 0) {
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
        case "additional": {
          this.setAdditionalFileByExistingFile(selectedOtherExistingDoc);
          break;
        }
        case 'rule': {
          this.setRuleFileByExistingFile(selectedOtherExistingDoc);
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
    if (this.mainDoc.length > 0) {
    this.otherRadioButtonClick(
      'main',
      this.mainDoc[0].attachmentUrl,
      'browse'
    );
    }
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
    if (this.delayDoc.length > 0) {
    this.otherRadioButtonClick(
      'delay',
      this.delayDoc[0].attachmentUrl,
      'browse'
    );
    }
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
    if (this.ruleDoc.length > 0) {
      this.otherRadioButtonClick(
        'delay',
        this.ruleDoc[0].attachmentUrl,
        'browse'
      );
      }
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

  //show existing file document preview next tab
  showExistingFilePreview(url, formShow) {
    // window.open(url, "_blank");
    this.previewVisible = true;
    this.docUrl = url;
    this.showForm = formShow;
  }

  //show covering letter
  showCOveringLetterFilePreview(data) {
    const filterData = data.find(
      (element) => element.type == "COVERING_LETTER"
    );
    this.previewVisible = true;
    this.docUrl = filterData.documentUrl;
    this.showForm = false;
  }
  getDeptuser() {
    this.docService.getDeptUser(this.user.userId).subscribe((Res) => {
      this.deptUser = Res;
      this.getMinisterDepartments(this.deptUser.data.details.portfolioId);
    });
  }

  cancel() {}

  onActNameChange(value: string): void {
    if (value) {
    this.listOfActName = this.actNameOptions.filter((option) =>
      option.name && option.name.toLowerCase().includes(value.toLowerCase()) &&
      option.type && option.type.toLowerCase().includes(this.actType.toLowerCase())
    );
    const temp = this.actNameOptions.find(
      (element) => (element.name && (element.name.toLowerCase() == value.toLowerCase())) &&
      (element.type && (element.type.toLowerCase() == this.actType.toLowerCase()))
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
    this.actName = null;
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
      this.addInstitution = false;
    } else {
      this.addInstitution = true;
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
      };
      this.docService.saveActName(body).subscribe();
    }
    if (this.addInstitution) {
      const body = {
        name: this.validateForm.value.nameOfInst,
      };
      this.docService.saveInstitution(body).subscribe();
    }
  }

  getReferenceDocuments() {
    this.docService.getApprovedAmendments().subscribe((Response) => {
      this.listOfReferenceDoc = Response;
    });
  }

  addReferenceValidation() {
    if (this.docsubtype === "REVISED") {
      this.validateForm
        .get("typeReference")
        .setValidators([Validators.required]);
    } else {
      this.validateForm.get("typeReference").clearValidators();
    }
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
  //function for upload covering letter
  uploadCoveringLetter(info: UploadChangeParam): void {
    const coveringDoc = info.fileList;
    this.coveringDoc = [];
    if (info.file.response) {
      for (const file of coveringDoc) {
        file.url = file.response.body;
        this.coveringDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: false,
          isMainDocument: false,
          isStatementAsPerRule: false,
          currentNumber: null,
          isConfindential: false,
          isLetter: true,
        });
      }
      this.currentNumber = [];
    }
  }

  // currentAssemblyAndSession() {
  //   this.commonService.getCurrentAssemblyAndSession().subscribe((Res) => {
  //     this.activeSession = Res;
  //     this.getAssemblyList();
  //     this.getSessionList();
  //   });
  // }

  setValueForRegister(id) {
    this.docService.getDocumentDetailsById(id).subscribe((res: any) => {
      if (res) {
        this.osResponse = res;
        this.osResponse.checked = true;
        this.ministerfor = res.portfolioId;
        this.validateForm.patchValue({
            assembly: res.assemblyId,
            session: res.sessionId,
            doctype: res.type,
            documentname: res.title,
            ministerfor: res.portfolioId,
            ministerdepartmentId: res.departmentId,
            deptSubjectId: res.subjectId
          });
        this.coveringDocument_radioButtonValue = 'existing';
        const tempArray: any = [];
        tempArray.push(this.osResponse);
        this.setCoveringLetterFileByExistingFile(tempArray);
        this.existingOtherDocuments = this.osResponse;
        this.tempExistingOtherDocuments = { ...this.existingOtherDocuments };
        this.existingOtherDocuments.attachments.forEach((element) => {
          element.checked = false;
        });
      }
    });
  }

  handlePreview = async (file: UploadFile) => {
    this.previewVisible = true;
    this.docUrl = file.url;
    this.showForm = true;
  }

  hidePreview() {
    this.previewVisible = false;
  }

  goBack() {
    this.router.navigate([
      'business-dashboard/cpl/uploaded-list'
    ]);
  }

  yearValidation() {
    if (this.docsubtype === 'AUDIT' || this.docsubtype === 'ANNUAL') {
      this.getYearList(false);
    } else {
      this.getYearList(true);
    }
    this.docYear = null;
    this.isDelayNeeded = false;
  }

   getYearList(uptoCurrentYear) {
    this.yearList = [];
    this.rangeList = [];
    let currentYear: any;
    if (uptoCurrentYear) {
      currentYear = new Date().getFullYear();
      let startYear = currentYear - 20;
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

  returnGO() {
    if (this.doctype === 'SRO') {
      return 'cpl.documents.gonumber';
    } else {
      return 'cpl.docpreparion.notificationnumber';
    }
  }

  returnLetter() {
    if (this.doctype === 'SRO' || this.doctype === 'ORDINANCE') {
    return 'cpl.registration.letter';
    } else {
      return this.doctype;
    }
  }

  onDeptMinisterChange(event) {
    if (event === null) {
      this.deptUser.data.details.departmentId = null;
    } else {
      this.getMinisterDepartments(event);
    }
  }
}
