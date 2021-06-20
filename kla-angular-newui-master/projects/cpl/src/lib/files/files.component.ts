import { Component, OnInit, Inject } from '@angular/core';
import { DocumentsService } from '../shared/services/documents.service';
import { FilesService } from '../shared/services/files.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router, Data, ActivatedRoute } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import { forkJoin } from 'rxjs';
import { CplFile } from '../shared/models/create-file';
import * as jsPdf from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'cpl-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  tabIndex = 0;
  approvedFileList;
  temp_approvedFileList;
  approvedFileStatusType;
  printable = false;
  FileList: any = [];
  FileAllList: any = [];
  status: any;
  searchFile: any;
  listOfFile: any;
  listOfFiles: any;
  sortName: string;
  sortValue: string;
  assemblyList = [];
  sessionList = [];
  statusType = ['APPROVED', 'SUBMITTED', 'CLOSURE_PENDING', 'CLOSED'];
  priroties = ['ALL', 'URGENT', 'NORMAL', 'ACTION_TODAY', 'ASSEMBLY_URGENT'];
  statusDocType = 'ALL';
  fileStatusType = null;
  assemblyId = null;
  sessionId = null;
  fileDesc = null;
  fileSub = '';
  filePriority = null;
  fileNumType: any = 'true';
  currentNumOption: any = [];
  fileNumber: any;
  currentNum: any = null;
  user: any;
  pendingFiles: any = [];
  searchPending: any;
  searchfilesubject: any;
  searchAllFiles: any;
  listOfPending: any;
  searchFileNum: any;
  searchFileSub: any;
  checkedType = null;
  isTypeNull = false;
  disableCheck = false;
  filterStatus = [
    { text: 'SAVED', value: 'SAVED' },
    { text: 'SUBMITTED', value: 'SUBMITTED' },
    { text: 'LAYING_APPROVED', value: 'LAYING_APPROVED' },
  ];
  public priorities = [
    { label: 'Urgent', value: 'URGENT' },
    { label: 'Normal', value: 'NORMAL' },
    { label: 'Action Today', value: 'ACTION_TODAY' },
    { label: 'Assembly Urgent', value: 'ASSEMBLY_URGENT' },
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
  isViewVisible = false;
  isEditVisible = false;
  fileEdited: any = [];
  filterCheckboxes = [
    { label: 'File Number', checked: false },
    { label: 'File Subject', checked: false },
    { label: 'Priority', checked: false },
    { label: 'File Type', checked: false }
  ];
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
    subject: '',
    fileNumber: '',
    priority: '',
  };
  fileForPortfolio: any = [];
  fileAllFiltered: any;
  fileListAllFiltered: any;
  searchMyFile: any;
  myfileFiltered: any;
  myfileListFiltered: any;
  listOfAssistants: any = [];
  cplSectionId;
  ratificationList: any;
  tempRatificationList: any;
  ratification = false;
  searchRatificationFile: any;
  dashPriority: any;
  assemblySession: any = null;

  constructor(
    private docService: DocumentsService,
    private fileService: FilesService,
    private notification: NzNotificationService,
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute,
    @Inject('authService') private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    const urlParams = this.router.getCurrentNavigation().extras.state;
    if (urlParams) {
      if (urlParams.Index) {
        this.tabIndex = urlParams.Index;
      } else {
        this.dashPriority = urlParams.priority;
      }
    }
    this.cplSectionId = this.commonService.getSectionId();
  }

  ngOnInit() {
    // tslint:disable-next-line: deprecation
      this.docService.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblySession = Res.assemblySession;
      this.assemblyList = Res.assembly;
      this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
      this.assemblyId = null;
      this.sessionId = null;
      this.tabShow = false;
      this.getPendingFiles();
      setTimeout(() => {
        this.loadCPLTabs();
      }, 500);
    });
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

  getAllFileList() {
    this.searchAllFiles = null;
    const body = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      status: this.fileStatusType,
      subtype: null,
      type: 'CPL',
      userId: this.user.userId,
      portfolioId: null,
      cplType: null,
      cplSubType: null,
    };
    this.fileService.getAllFileList(body).subscribe((Response) => {
      const tempList: any = Response;
      this.FileAllList = tempList;
      this.listOfFiles = this.FileAllList;
      this.searchAllCol(this.filterSelected);
    });
  }

  onSearch() {
    if (this.searchFile) {
      this.fileForPortfolio = this.FileList.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchFile.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchFile.toLowerCase()))
      );
    } else {
      this.listOfFile = this.FileList;
    }
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.fileAllFiltered = this.listOfFiles;
      this.fileListAllFiltered = this.listOfFiles;
    }
    if (this.searchAllFiles) {
      this.FileAllList = this.fileAllFiltered.filter(
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
      this.FileAllList = this.fileListAllFiltered;
    }
  }

  sortFile(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    const data = this.FileList.filter((item) => item);
    if (this.sortName && this.sortValue) {
      this.listOfFile = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName].toLowerCase() > b[this.sortName].toLowerCase()
            ? 1
            : -1
          : b[this.sortName].toLowerCase() > a[this.sortName].toLowerCase()
          ? 1
          : -1
      );
    } else {
      this.listOfFile = data;
    }
  }

  viewFile(id, tabIndex) {
    this.router.navigate(['business-dashboard/cpl/file-workflow', id], {
      state: {
        Index: tabIndex
      },
    });
  }

  getPendingFiles() {
    this.searchPending = null;
    const body = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      status: this.fileStatusType,
      subtype: null,
      type: 'CPL',
      userId: this.user.userId,
      portfolioId: null,
      cplType: null,
      cplSubType: null,
    };
    this.fileService.getPendingFiles(body).subscribe((Res) => {
      this.pendingFiles = Res;
      this.listOfPending = this.pendingFiles;
      if (this.dashPriority) {
        if (this.dashPriority) {
          this.pendingFiles = this.listOfPending.filter(
            (element) =>
              element.priority.toLowerCase() ==
              this.dashPriority
          );
        } else {
          this.pendingFiles = this.listOfPending;
        }
      } else {
        this.pendingFiles = this.listOfPending;
        if (this.pendingType !== null) {
          this.pendingFiles = this.listOfPending.filter(
            (element) =>
              element.subtype &&
              element.subtype.includes(this.pendingType) &&
              element.status &&
              element.status !== 'APPROVED'
          );
        } else {
          this.searchCol(this.filterSelected);
        }
      }
      this.dashPriority = null;
    });
  }

  getApprovedFiles() {
    this.fileService
      .aaprovedByHigherOfficial(this.user.userId)
      .subscribe((res: any) => {
        this.approvedFileList = res.filter(file => file.type === 'CPL');
        this.temp_approvedFileList = this.approvedFileList;
        this.searchMyFileCol(this.filterSelected);
      });
  }

  getTabs() {
    return {
      files: false,
      myFiles: false,
      allFiles: false,
    };
  }

  loadCPLTabs() {
    if (this.commonService.doIHaveAnAccess('FILES', 'UPDATE')) {
      this.cplTabs.files = true;
    }
    if (this.commonService.doIHaveAnAccess('MY FILES', 'READ')) {
      this.cplTabs.myFiles = true;
      this.getApprovedFiles();
    }
    if (this.commonService.doIHaveAnAccess('ALL FILES', 'READ')) {
      this.cplTabs.allFiles = true;
      this.getAllFileList();
    }
    if (this.commonService.doIHaveAnAccess('FILE_RATIFICATION', 'READ')) {
      this.ratification = true;
      this.getPendingRatification();
    }
    this.tabShow = true;
  }

  showEditModal(value): void {
    this.fileEdited = value;
    this.tempFile = {
      subject: this.fileEdited.subject,
      fileNumber: this.fileEdited.fileNumber,
      priority: this.fileEdited.priority,
    };
    this.isEditVisible = true;
  }

  handleEditOk(): void {
    this.isEditVisible = false;
    const body = {
      assemblyId: this.assemblyId,
      assigedTo: 0,
      createdDate: this.fileEdited.createdDate,
      currentNumber: this.currentNum,
      description: this.fileDesc,
      fileId: this.fileEdited.fileId,
      fileNumber: this.tempFile.fileNumber,
      priority: this.tempFile.priority,
      sectionId: this.cplSectionId,
      sessionId: this.sessionId,
      status: this.fileEdited.status,
      subject: this.tempFile.subject,
      subType: this.fileEdited.subType,
      type: this.fileEdited.type,
      userId: this.user.userId,
      workflowId: this.fileEdited.workflowId,
    };
    this.fileService
      .updateFile(body, this.fileEdited.fileId)
      .subscribe((Res) => {
        this.getPendingFiles();
      });
  }

  handleEditCancel(): void {
    this.isEditVisible = false;
    this.tempFile = this.fileEdited;
  }

  captureScreen() {
    let doc = new jsPdf('p', 'pt');

    doc.autoTable({ html: '#mladata' });

    let blob = doc.output('blob');

    let w = window.open(URL.createObjectURL(blob));
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
  }

  _showFilter(): void {
    this.isVisibleFilter = false;
    this.filenodisable = this.filterCheckboxes.find(
      (element) => element.label === 'File Number'
    ).checked;
    this.filesubjectdisable = this.filterCheckboxes.find(
      (element) => element.label === 'File Subject'
    ).checked;
    this.prioritydisable = this.filterCheckboxes.find(
      (element) => element.label === 'Priority'
    ).checked;
    this.subtypeDisable = this.filterCheckboxes.find(
      (element) => element.label === 'File Type'
    ).checked;
    this._loadSelectedfilterData();
    this._loadMyFilterData();
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
      : '';

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
      : '';

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
      : '';

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
      : '';

    this.regdatedisable
      ? Object.keys(self.listOfPending).forEach(function (key) {
          counter5++;
          self.regDate.push(self.listOfPending[key].createdDate);
          if (counter5 == self.listOfPending.length) {
            self.regDate = self.regDate.filter((v, i, a) => a.indexOf(v) === i);
            self.regDate.sort();
          }
        })
      : '';
  }

  searchCol(filter: any) {
    if (!filter) {
      this.pendingFiles = this.listOfPending;
    } else {
      this.pendingFiles = this.listOfPending.filter((item: any) =>
        this.applyFilter(item, filter)
      );
      this.fileFiltered = this.pendingFiles;
      this.fileListFiltered = this.pendingFiles;
    }
  }

  _loadAllFilesfilterData() {
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;

    this.filenodisable
      ? Object.keys(self.listOfFiles).forEach(function (key) {
          counter1++;
          self.fileno.push(self.listOfFiles[key].fileNumber);
          if (counter1 == self.listOfFiles.length) {
            self.fileno = self.fileno.filter((v, i, a) => a.indexOf(v) === i);
          }
        })
      : '';

    this.filesubjectdisable
      ? Object.keys(self.listOfFiles).forEach(function (key) {
          counter2++;
          self.filesubject.push(self.listOfFiles[key].subject);
          if (counter2 == self.listOfFiles.length) {
            self.filesubject = self.filesubject.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : '';

    this.prioritydisable
      ? Object.keys(self.listOfFiles).forEach(function (key) {
          counter3++;
          self.priority.push(self.listOfFiles[key].priority);
          if (counter3 == self.listOfFiles.length) {
            self.priority = self.priority.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : '';

    this.subtypeDisable
      ? Object.keys(self.listOfFiles).forEach(function (key) {
          counter4++;
          self.filesubtype.push(self.listOfFiles[key].subtype);
          if (counter4 == self.listOfFiles.length) {
            self.filesubtype = self.filesubtype.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : '';

    this.regdatedisable
      ? Object.keys(self.listOfFiles).forEach(function (key) {
          counter5++;
          self.regDate.push(self.listOfFiles[key].createdDate);
          if (counter5 == self.listOfFiles.length) {
            self.regDate = self.regDate.filter((v, i, a) => a.indexOf(v) === i);
            self.regDate.sort();
          }
        })
      : '';
  }

  searchAllCol(filter: any) {
    if (!filter) {
      this.FileAllList = this.listOfFiles;
    } else {
      this.FileAllList = this.listOfFiles.filter((item: any) =>
        this.applyFilter(item, filter)
      );
      this.fileAllFiltered = this.FileAllList;
      this.fileListAllFiltered = this.FileAllList;
    }
  }

  applyFilter(element: any, filter: any): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (!element[field] || element[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  filtering() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.fileFiltered = this.listOfPending;
      this.fileListFiltered = this.listOfPending;
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
              .includes(this.searchPending.toLowerCase()))
      );
    } else {
      this.pendingFiles = this.fileListFiltered;
    }
  }

  clearFilter() {
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
    this.filterCheckboxes.forEach((element) => {
      {
        element.checked = false;
      }
    });
    this.searchCol(this.filterSelected);
    this.searchMyFileCol(this.filterSelected);
    this._loadSelectedfilterData();
    this._loadMyFilterData();
  }

  doNothing() {
    return false;
  }

  disableFilter(value) {
    switch (value) {
      case 1:
        this.filenodisable = false;
        this.filterSelected.fileNumber = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == 'File Number') {
            element.checked = false;
          }
        });
        break;
      case 2:
        this.filesubjectdisable = false;
        this.filterSelected.subject = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == 'File Subject') {
            element.checked = false;
          }
        });
        break;
      case 3:
        this.prioritydisable = false;
        this.filterSelected.priority = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == 'Priority') {
            element.checked = false;
          }
        });
        break;
      case 4:
        this.subtypeDisable = false;
        this.filterSelected.subtype = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == 'File Type') {
            element.checked = false;
          }
        });
        break;
      default:
        break;
    }
    this.searchCol(this.filterSelected);
    this.searchMyFileCol(this.filterSelected);
    this._loadSelectedfilterData();
    this._loadMyFilterData();
  }

  cancel() {}

  searchMyFiles() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.myfileFiltered = this.temp_approvedFileList;
      this.myfileListFiltered = this.temp_approvedFileList;
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

  searchMyFileCol(filter: any) {
    if (!filter) {
      this.approvedFileList = this.temp_approvedFileList;
    } else {
      if (this.approvedFileList) {
        this.approvedFileList = this.temp_approvedFileList.filter((item: any) =>
          this.applyFilter(item, filter)
        );
      }
      this.myfileFiltered = this.approvedFileList;
      this.myfileListFiltered = this.approvedFileList;
    }
  }

  _loadMyFilterData() {
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;

    this.filenodisable
      ? Object.keys(self.temp_approvedFileList).forEach(function (key) {
          counter1++;
          self.fileno.push(self.temp_approvedFileList[key].fileNumber);
          if (counter1 == self.temp_approvedFileList.length) {
            self.fileno = self.fileno.filter((v, i, a) => a.indexOf(v) === i);
          }
        })
      : '';

    this.filesubjectdisable
      ? Object.keys(self.temp_approvedFileList).forEach(function (key) {
          counter2++;
          self.filesubject.push(self.temp_approvedFileList[key].subject);
          if (counter2 == self.temp_approvedFileList.length) {
            self.filesubject = self.filesubject.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : '';

    this.prioritydisable
      ? Object.keys(self.temp_approvedFileList).forEach(function (key) {
          counter3++;
          self.priority.push(self.temp_approvedFileList[key].priority);
          if (counter3 == self.temp_approvedFileList.length) {
            self.priority = self.priority.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : '';

    this.subtypeDisable
      ? Object.keys(self.temp_approvedFileList).forEach(function (key) {
          counter4++;
          self.filesubtype.push(self.temp_approvedFileList[key].subtype);
          if (counter4 == self.temp_approvedFileList.length) {
            self.filesubtype = self.filesubtype.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : '';

    this.regdatedisable
      ? Object.keys(self.temp_approvedFileList).forEach(function (key) {
          counter5++;
          self.regDate.push(self.temp_approvedFileList[key].createdDate);
          if (counter5 == self.temp_approvedFileList.length) {
            self.regDate = self.regDate.filter((v, i, a) => a.indexOf(v) === i);
            self.regDate.sort();
          }
        })
      : '';
  }

  clearSearch() {
    this.searchPending = '';
    this.searchMyFile = '';
    this.searchAllFiles = '';
    this.searchMyFile = '';
  }

  getPendingRatification() {
    const body = {
      type: null,
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      userId: this.user.userId,
      subtype: null,
      status: null,
      portfolioId: null,
      cplType: null,
      cplSubType: null,
    };
    this.fileService.getPendingRatification(body).subscribe((Res) => {
      this.ratificationList = Res;
      this.tempRatificationList = this.ratificationList;
    });
  }

  searchRatification() {
    if (this.searchRatificationFile) {
      this.ratificationList = this.tempRatificationList.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchRatificationFile.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchRatificationFile.toLowerCase())) ||
          (element.priority &&
            element.priority
              .toLowerCase()
              .includes(this.searchRatificationFile.toLowerCase())) ||
          (element.subtype &&
            element.subtype
              .toLowerCase()
              .includes(this.searchRatificationFile.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchRatificationFile.toLowerCase()))
      );
    } else {
      this.ratificationList = this.tempRatificationList;
    }
  }
}
