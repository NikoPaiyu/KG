import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { forkJoin } from "rxjs";
import { GenericfileService } from "../shared/services/genericfile.service";
import { GenericfilesCommonService } from "../shared/services/genericfiles-common.service";

@Component({
  selector: "genericfile-files",
  templateUrl: "./files.component.html",
  styleUrls: ["./files.component.scss"],
})
export class FilesComponent implements OnInit {
  modalVisible: boolean = false;
  createFilePermission: boolean = true;
  assemblyId = null;
  assembly = null;
  sessionId = null;
  session = null;
  fileNumber = null;
  fileType = null;
  fileSubType = null;
  fileTypes = null;
  searchPending = null;
  fileStatusType = null;
  subType = null;
  assemblyList = [];
  sessionList = [];
  type = "GENERIC";
  isVisibleFilter = false;
  isRequestModalVisible = false;
  filenodisable = false;
  regdatedisable = false;
  prioritydisable = false;
  filesubjectdisable = false;
  subtypeDisable = false;
  user: any;
  myFiles;
  searchAllFiles: any;
  searchMyFile: any;
  fileFiltered;
  fileListFiltered;
  myfileFiltered;
  myfileListFiltered;
  fileAllFiltered;
  fileListAllFiltered;
  approvedFileStatusType;
  listOfPendingFiles: any = [];
  listOfAllFiles: any = [];
  allFiles: any = [];
  statusType = ["APPROVED", "SUBMITTED"];
  approvedFileList: any = [];
  tempApprovedFileList: any = [];
  filterCheckboxes = [
    { label: "File Number", checked: false },
    { label: "File Subject", checked: false },
    { label: "Priority", checked: false },
    { label: "File Type", checked: false },
  ];
  filterSelected = {
    fileNumber: null,
    priority: null,
    subject: null,
    subtype: null,
    regDate: null,
  };
  fileno = [];
  filesubject = [];
  priority = [];
  filesubtype = [];
  regDate = [];
  pendingFiles: any = [];
  fileForm = this.fb.group({
    id: [null],
    assemblyId: [null, Validators.required],
    sessionId: [null, Validators.required],
    subtype: [null, Validators.required],
    fileId: [null],
    isConfidential: [false],
    nature: ["MASTER", Validators.required],
    sectionId: [null],
    seatNumber: [null],
  });
  files = {
    subject: "",
    priority: null,
    description: "",
    nature: "MASTER",
  };
  fileSubTypes: any = [];
  currentAssemblySession: any = null;
  formAssemblyList: any = null;
  formSessionList: any = null;
  masterFileList: any = null;
  sectionList: any = null;
  seatList: any = null;
  permissions = {
    showSections: false,
    showSeats: false,
  };
  assemblySession: any;

  constructor(
    private router: Router,
    private common: GenericfilesCommonService,
    private file: GenericfileService,
    @Inject("authService") private AuthService,
    private fb: FormBuilder,
    private notify: NzNotificationService
  ) {
    this.user = AuthService.getCurrentUser();
    this.common.setPermissions(this.user.rbsPermissions);
    console.log(this.user.rbsPermissions);
    this.getPendingFiles();
  }

  ngOnInit() {
    this.getRbsPermissions();
    this.getAssemblySession();
    this.getAllSubTypes();
  }

// get assembly and session
getAssemblySession() {
  this.common.getAllAssemblyandSession().subscribe((Response:any)=> {
    if(Response){
      this.assemblySession = Response.assemblySession;
      this.assemblyList = Response.assembly;
      this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
      if(this.isRequestModalVisible) {
        this.formAssemblyList = this.assemblyList;
        this.fileForm.get('assemblyId').setValue(this.assemblyId);
        this.fileForm.get("sessionId").setValue(this.sessionId);
      }
      this.getSessionList();
      this.getPendingFiles();
      this.getAllFiles();
    }
  });
}

// get session for assembly
getSessionList() {
  if(this.isRequestModalVisible) {
    if(this.fileForm.value.assemblyId === 0 || !(this.assemblySession.find(x=> x.id === this.fileForm.value.assemblyId))) {
      this.fileForm.controls.sessionId.reset();
      this.formSessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    } else if(this.fileForm.value.assemblyId && this.assemblySession.find(x=> x.id === this.fileForm.value.assemblyId)){
      this.fileForm.controls.sessionId.reset();
      this.formSessionList = this.assemblySession.find(x => x.id === this.fileForm.value.assemblyId).session;
    } 
  }
  this.sessionId = null;
  if (this.assemblyId === 0 || !(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId))) {
    this.sessionList = [{
      id: 0,
      sessionId: 'No Session',
    }];
  } else if(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId)) {
    this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
  }
}

  showRequestModal(): void {
    this.getAllSubTypes();
    this.fileForm.patchValue({
      subtype: "MISCELLANEOUS",
    });
    this.isRequestModalVisible = true;
    this.getAllMasterFiles();
    this.getAssemblySession();
  }


  handleCancel(): void {
    this.isRequestModalVisible = false;
  }
  getPendingFiles() {
    if(this.fileType){
      this.subType = this.fileType;
    }
    else {
      this.subType = null;
    }
    const body= {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      userId: this.user.userId,
      type: this.type,
      subType: this.subType
    }
    this.file
      .getPendingFiles(body)
      .subscribe((Res) => {
        this.pendingFiles = this.listOfPendingFiles = Res;
      });
  }
  getAllSubTypes() {
    this.file.getAllSubTypes("GENERIC").subscribe((res) => {
      this.fileSubTypes = res;
    });
  }
  getMyFiles() {
    if (this.fileSubType){
      this.subType = this.fileSubType;
    }
    else {
      this.subType = null;
    }
    const body = {
      assemblyId: this.assemblyId,
      nature: null,
      sessionId: this.sessionId,
      status: null,
      subtype: this.subType,
      type: "GENERIC",
      userId: this.user.userId,
    };
    this.file.approvedByHigherOfficial(body).subscribe((res: any) => {
      this.approvedFileList = res.filter(
        (element) => element.type === this.type
      );
      this.tempApprovedFileList = res.filter(
        (element) => element.type === this.type
      );
      this.searchMyFileCol(this.filterSelected);
    });
  }
  getAllFiles() {
    if (this.fileTypes){
      this.subType= this.fileTypes;
    }
    else {
      this.subType = null;
    }
    const body = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      status: this.fileStatusType,
      subtype: this.subType,
      type: "GENERIC",
      userId: this.user.userId,
    };
    this.file.getAllFiles(body).subscribe((Response) => {
      this.allFiles = Response;
      this.listOfAllFiles = Response;
    });
  }
  searchMyFileCol(filter: any) {
    if (!filter) {
      this.approvedFileList = this.tempApprovedFileList;
    } else {
      if (this.approvedFileList) {
        this.approvedFileList = this.tempApprovedFileList.filter((item: any) =>
          this.applyFilter(item, filter)
        );
      }
      this.myfileFiltered = this.approvedFileList;
      this.myfileListFiltered = this.approvedFileList;
    }
  }

  // searchMyFileCol(filter: any) {
  //   if (!filter) {
  //     this.approvedFileList = this.tempApprovedFileList;
  //   } else {
  //     if (this.approvedFileList) {
  //       this.approvedFileList = this.tempApprovedFileList.filter((item: any) =>
  //         this.applyFilter(item, filter)
  //       );
  //     }
  //     this.myfileFiltered = this.approvedFileList;
  //     this.myfileListFiltered = this.approvedFileList;
  //   }
  // }
  searchMyFiles() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
    }
    if (!checkArray.includes(true)) {
      this.myfileFiltered = this.tempApprovedFileList;
      this.myfileListFiltered = this.tempApprovedFileList;
    }
    if (this.approvedFileStatusType && this.searchMyFile) {
      this.approvedFileList = this.myfileFiltered.filter(
        (element) =>
          element.status === this.approvedFileStatusType &&
          ((element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchMyFile.toLowerCase())) ||
            (element.subject &&
              element.subject
                .toLowerCase()
                .includes(this.searchMyFile.toLowerCase())))
      );
    } else if (this.approvedFileStatusType) {
      this.approvedFileList = this.myfileFiltered.filter(
        (element) => element.status === this.approvedFileStatusType
      );
    } else if (this.searchMyFile) {
      this.approvedFileList = this.myfileFiltered.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchMyFile.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchMyFile.toLowerCase()))
      );
    } else {
      this.approvedFileList = this.myfileListFiltered;
    }
  }

  onSearch() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.fileAllFiltered = this.allFiles;
      this.fileListAllFiltered = this.allFiles;
    }
    if (this.searchAllFiles) {
      this.allFiles = this.fileAllFiltered.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchAllFiles.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchAllFiles.toLowerCase()))
      );
    } else {
      this.allFiles = this.fileListAllFiltered;
    }
  }
  // getAssemblySession() {
  //   forkJoin(
  //     this.common.getAllAssembly(),
  //     this.common.getAllSession()
  //   ).subscribe(([assembly, session]) => {
  //     this.assemblyList = assembly as Array<any>;
  //     const res = this.assemblyList.map((x) => x.id);
  //     this.formAssemblyList = this.assemblyList.filter(
  //       (a) => a.id >= this.currentAssemblySession.assemblyId
  //     );
  //     this.sessionList = session as Array<any>;
  //     this.sessionList.unshift({
  //       id: 0,
  //       sessionId: "No Session",
  //     });
  //     const response = this.sessionList.map((x) => x.id);
  //     this.formSessionList = this.sessionList.filter(
  //       (s) => s.id >= this.currentAssemblySession.sessionId
  //     );
  //     this.formSessionList.unshift({
  //       id: 0,
  //       sessionId: "No Session",
  //     });
  //     this.getPendingFiles();
  //     this.getAllFiles();
  //   });
  // }

  clearFilter() {
    this.pendingFiles = this.listOfPendingFiles;
    this.allFiles = this.listOfAllFiles;
    this.approvedFileList = this.tempApprovedFileList;
  }
  clearSearch() {
    this.searchPending = "";
    this.searchAllFiles = "";
    this.searchMyFile = "";
  }
  showModal(): void {
    this.isVisibleFilter = true;
  }
  _hideFilter(): void {
    this.isVisibleFilter = false;
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  doNothing() {}
  filtering() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.fileFiltered = this.pendingFiles;
      this.fileListFiltered = this.pendingFiles;
    }
    if (this.searchPending) {
      this.pendingFiles = this.fileFiltered.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchPending.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchPending.toLowerCase())) ||
          (element.priority &&
            element.priority
              .toLowerCase()
              .includes(this.searchPending.toLowerCase())) ||
          (element.type &&
            element.type
              .toLowerCase()
              .includes(this.searchPending.toLowerCase())) ||
          (element.createdDate &&
            element.createdDate
              .toLowerCase()
              .includes(this.searchPending.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchPending.toLowerCase()))
      );
    } else {
      this.pendingFiles = this.fileListFiltered;
    }
  }
  viewFile(fileId) {
    this.router.navigate(["business-dashboard/generic-file/view/", fileId]);
  }
  fileSelection() {
    this.fileNumber
      ? (this.files.nature = "CHILD")
      : (this.files.nature = "MASTER");
  }
  createFile() {
    if (this.fileForm.valid) {
      let section = null;
      if (this.permissions.showSections) {
        section = this.fileForm.value.sectionId;
      } else {
        section = this.user.correspondenceCode.id;
      }
      const body = {
        assemblyId: this.fileForm.value.assemblyId,
        currentNumber: null,
        description: this.files.description,
        sessionId: this.fileForm.value.sessionId,
        status: "saved",
        subject: this.files.subject,
        subtype: this.fileForm.value.subtype,
        type: "GENERIC",
        userId: this.user.userId,
        priority: this.files.priority,
        parentFileId: this.fileForm.value.fileId,
        nature: this.fileForm.value.nature,
        confidential: this.fileForm.value.isConfidential,
        sectionId: section,
        seatNumber: this.fileForm.value.seatNumber,
      };

      this.file.createFile(body).subscribe((res: any) => {
        this.notify.success(
          "Success",
          "File Created with file number :" + res.fileNumber
        );
        this.viewFile(res.fileId);
        this.isRequestModalVisible = false;
      });
    } else {
      for (const i in this.fileForm.controls) {
        this.fileForm.controls[i].markAsDirty();
        this.fileForm.controls[i].updateValueAndValidity();
      }
    }
  }
  searchFileForActionCol(filter: any) {
    if (!filter) {
      this.pendingFiles = this.listOfPendingFiles;
    } else {
      if (this.pendingFiles) {
        this.pendingFiles = this.listOfPendingFiles.filter((item: any) =>
          this.applyFilter(item, filter)
        );
      }
      this.fileFiltered = this.pendingFiles;
      this.fileListFiltered = this.pendingFiles;
    }
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
  disableFilter(value) {
    switch (value) {
      case 1:
        this.filenodisable = false;
        this.filterSelected.fileNumber = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "File Number") {
            element.checked = false;
          }
        });
        break;
      case 2:
        this.filesubjectdisable = false;
        this.filterSelected.subject = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "File Subject") {
            element.checked = false;
          }
        });
        break;
      case 3:
        this.prioritydisable = false;
        this.filterSelected.priority = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Priority") {
            element.checked = false;
          }
        });
        break;
      case 4:
        this.subtypeDisable = false;
        this.filterSelected.subtype = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "File Type") {
            element.checked = false;
          }
        });
        break;
    }
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  searchCol(filter: any) {
    if (!filter) {
      this.allFiles = this.listOfAllFiles;
    } else {
      this.allFiles = this.listOfAllFiles.filter((item: any) =>
        this.applyFilter(item, filter)
      );
      this.fileAllFiltered = this.allFiles;
      this.fileListAllFiltered = this.allFiles;
    }
  }
  _showFilter(): void {
    this.isVisibleFilter = false;
    this.filenodisable = this.filterCheckboxes.find(
      (element) => element.label === "File Number"
    ).checked;
    this.filesubjectdisable = this.filterCheckboxes.find(
      (element) => element.label === "File Subject"
    ).checked;
    this.prioritydisable = this.filterCheckboxes.find(
      (element) => element.label === "Priority"
    ).checked;
    this.subtypeDisable = this.filterCheckboxes.find(
      (element) => element.label === "File Type"
    ).checked;
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;
    this.filenodisable
      ? Object.keys(self.listOfAllFiles).forEach(function (key) {
          counter1++;
          self.fileno.push(self.listOfAllFiles[key].fileNumber);
          if (counter1 === self.listOfAllFiles.length) {
            self.fileno = self.fileno.filter((v, i, a) => a.indexOf(v) === i);
          }
        })
      : "";
    this.filesubjectdisable
      ? Object.keys(self.listOfAllFiles).forEach(function (key) {
          counter2++;
          self.filesubject.push(self.listOfAllFiles[key].subject);
          if (counter2 === self.listOfAllFiles.length) {
            self.filesubject = self.filesubject.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.prioritydisable
      ? Object.keys(self.listOfAllFiles).forEach(function (key) {
          counter3++;
          self.priority.push(self.listOfAllFiles[key].priority);
          if (counter3 === self.listOfAllFiles.length) {
            self.priority = self.priority.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.subtypeDisable
      ? Object.keys(self.listOfAllFiles).forEach(function (key) {
          counter4++;
          self.filesubtype.push(self.listOfAllFiles[key].subtype);
          if (counter4 === self.listOfAllFiles.length) {
            self.filesubtype = self.filesubtype.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";

    this.regdatedisable
      ? Object.keys(self.listOfAllFiles).forEach(function (key) {
          counter5++;
          self.regDate.push(self.listOfAllFiles[key].createdDate);
          if (counter5 === self.listOfAllFiles.length) {
            self.regDate = self.regDate.filter((v, i, a) => a.indexOf(v) === i);
            self.regDate.sort();
          }
        })
      : "";
  }

  setNature(event) {
    if (event) {
      this.fileForm.patchValue({
        nature: "MASTER",
        fileId: null,
      });
    }
  }

  dynamicValidation(nature) {
    if (nature === "CHILD") {
      this.fileForm.get("fileId").setValidators([Validators.required]);
    } else {
      this.fileForm.patchValue({
        fileId: null,
      });
      this.fileForm.get("fileId").clearValidators();
    }
    this.fileForm.get("fileId").updateValueAndValidity();
  }

  // getCurrentAssemblySession() {
  //   this.common.getCurrentAssemblySession().subscribe((res) => {
  //     this.currentAssemblySession = res;
  //     this.fileForm.patchValue({
  //       assemblyId: this.currentAssemblySession.assemblyId,
  //       sessionId: this.currentAssemblySession.sessionId,
  //     });
  //     this.getAssemblySession();
  //   });
  // }

  getAllMasterFiles() {
    const body = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      status: null,
      subtype: null,
      type: null,
      userId: this.user.userId,
      nature: "MASTER",
    };

    this.file.getAllMasterFiles(body).subscribe((Response) => {
      this.masterFileList = Response;
    });
  }

  getSectionList() {
    this.common.getKlaSections().subscribe((res) => {
      this.sectionList = res;
    });
  }

  getSeatList(sectionId) {
    this.seatList = [];
    this.common.getassignseat(sectionId).subscribe((res) => {
      this.seatList = res;
    });
  }

  getRbsPermissions() {
    if (this.common.doIHaveAnAccess("CHOOSE_SEAT_NUMBER", "READ")) {
      this.permissions.showSeats = true;
      this.getSeatList(this.user.correspondenceCode.id);
      this.fileForm.get("seatNumber").setValidators([Validators.required]);
      this.fileForm.get("seatNumber").updateValueAndValidity();
    }
    if (this.common.doIHaveAnAccess("CHOOSE_SECTION_SEAT", "READ")) {
      this.permissions.showSections = true;
      this.getSectionList();
      this.fileForm.get("sectionId").setValidators([Validators.required]);
      this.fileForm.get("sectionId").updateValueAndValidity();
    }
  }
}
