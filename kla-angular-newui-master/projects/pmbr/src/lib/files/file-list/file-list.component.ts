import { Component, OnInit, Inject } from '@angular/core';
import { FileServiceService } from '../../shared/services/file-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';



@Component({
  selector: 'pmbr-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  lawDeptFiles: any = [];
  isRequestModalVisible = false;
  assemblyId = null;
  billid;
  maxNumber: any;
  sessionId = null;
  assembly = null;
  session = null;
  type = 'PMBR';
  fileStatusType = null;
  user: any;
  pendingFiles: any = [];
  pendingFile: any = [];
  listOfPendingFiles: any = [];
  listOfAllFiles: any = [];
  allFiles: any = [];
  assemblyList = [];
  sessionList = [];
  isVisibleFilter = false;
  showDocFilterModal = false;
  filterCheckboxes = [
    { label: 'File Number', checked: false },
    { label: 'File Subject', checked: false },
    { label: 'Priority', checked: false },
    { label: 'File Type', checked: false },
    // { label: 'Registration Date', checked: false}
  ];
  searchPending: any;
  statusType = ['APPROVED', 'SUBMITTED'];
  searchAllFiles: any;
  fileFiltered;
  fileListFiltered;
  fileAllFiltered;
  fileListAllFiltered;
  filenodisable = false;
  regdatedisable = false;
  prioritydisable = false;
  filesubjectdisable = false;
  subtypeDisable = false;
  fileno = [];
  filesubject = [];
  priority = [];
  filesubtype = [];
  regDate = [];
  billType: any;
  subType = null;
  subTypes = null;
  filterSelected = {
    fileNumber: null,
    priority: null,
    subject: null,
    subtype: null,
    regDate: null,
  };
  files: any = [];
  fileType = 'Priority List Empty Files';
  fileTypes = ['Priority List Empty Files', 'Priority List Files'];
  params = false;
  billFileType;
  myFiles;
  lawFiles;
  approvedFileList: any = [];
  tempApprovedFileList: any = [];
  myfileFiltered;
  myfileListFiltered;
  approvedFileStatusType;
  searchMyFile: any;
  ratification = false;
  ratificationList: any;
  tempRatificationList: any;
  fileForm = this.fb.group({
    id: [null],
    assemblyId: [null, Validators.required],
    sessionId: [null, Validators.required]
  });
  cosId: any = 0;
  file1 = {
    subject: '',
    priority: null,
    description: '',
  };
  createFilePermission = false;
  BallotFiles: any = [];
  BallotPendingFiles: any = [];
  listOfBallotPendingFiles: any = [];
  assemblySession: any = null;
  constructor(
    private file: FileServiceService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private common: PmbrCommonService,
    @Inject('authService') private AuthService) {
    this.user = AuthService.getCurrentUser();
    if (this.user.authorities[0] === 'assistant') {
      this.myFiles = true;
    }
    if (this.user.authorities[0] === 'Department') {
      this.lawFiles = true;
    }
    this.common.setPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.billType = params.type;
    });
      if (this.router.url.includes('files/priority-list-files')) {
      this.billFileType = 'Priority List Files';
      this.subType = 'PMBR_SCHEDULE_PRIORITY_LIST_FILE';
      this.params = true;
    } else if(this.router.url.includes('/pmbr/file-list/schedule-files')){
      this.subType = 'PMBR_SCHEDULE';
      this.billFileType = 'Schedule Files';
      this.type = 'PMBR_SCHEDULE';
    }
    else if(this.router.url.includes('/pmbr/file-list/resolution-files')){
      this.subType = 'PM_RESOLUTION';
      this.billFileType = 'Resolution Files';
      this.type = 'PM_RESOLUTION';
    } 
    else if(this.router.url.includes('/pmbr/file-list')){
      this.subType = 'PMBR';
      this.billFileType = 'Bill Files';
      this.type='PMBR';
    }
    else{
      this.subType = 'PM_BILL';
      this.billFileType = 'PM BILLS ';
    }
    this.getAssemblySession();
    if (this.common.doIHaveAnAccess('FILE', 'CREATE')) {
      this.createFilePermission = true;
    }
    this.getLawDeptFiles();
  }

  getAssemblySession() {
       this.common.getAllAssemblyAndSession().subscribe((Res: any) => {
      this.assemblyList = Res.assembly;
      this.assemblySession = Res.assemblySession;
      // this.assemblyId = Res.activeAssemblySession.assemblyId;
      this.getSessionForAssembly();
      // this.sessionId = Res.activeAssemblySession.sessionId;
      this.getPendingFiles();
      this.getAllFiles();
      if (this.common.doIHaveAnAccess('FILE_RATIFICATION', 'APPROVE')) {
        this.ratification = true;
        this.getPendingRatification();
      }
    });
  }
  getSessionForAssembly() {
    this.sessionList = []; 
    if (this.assemblyId === 0) {
      this.sessionId = 0;
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    } else {
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
      
    }
  }
  getPendingFiles() {
    if (this.params) {
      if (this.fileType === 'Priority List Empty Files') {
        this.subType = 'PMBR_SCHEDULE_PRIORITY_LIST_FILE';
      } else if (this.fileType === 'Priority List Files') {
        this.subType = 'PRIORITY_LIST_REQUEST';
      }
    }
    this.file.getPendingFiles(this.user.userId, this.assemblyId, this.sessionId, this.type).subscribe((Res) => {
      this.files = Res;
      if (this.subType === 'PMBR_SCHEDULE') {
        this.pendingFiles = this.files;
      } else if (this.type === 'PMBR'){
        this.pendingFiles = this.files;
      } if (this.type === 'PM_RESOLUTION'){
        this.pendingFiles = this.files;
      } else {
        this.pendingFiles = this.files.filter(element => element.subtype === this.subType);
      }
      this.listOfPendingFiles = this.pendingFiles;
    });
  }
  // getPendingFile() {
  //   this.subTypes = 'PMBR_SCHEDULE_LOTTING_RESULT';
  //   this.file.getPendingFiles(this.user.userId, this.assemblyId, this.sessionId, this.type).subscribe((Res) => {
  //     this.BallotFiles = Res;
  //     this.BallotPendingFiles = this.BallotFiles.filter(element => element.subtype === this.subTypes);
  //     this.listOfBallotPendingFiles = this.BallotPendingFiles;
  //   });
  // }
  getAllFiles() {
    if (this.params) {
      if (this.fileType === 'Priority List Empty Files') {
        this.subType = 'PMBR_SCHEDULE_PRIORITY_LIST_FILE';
      } else if (this.fileType === 'Priority List Files') {
        this.subType = 'PRIORITY_LIST_REQUEST';
      }
    }
    const body = {
      assemblyId: this.assembly,
      sessionId: this.session,
      status: this.fileStatusType,
      subtype: null,
      type: this.type,
      userId: this.user.userId,
    };
    this.file.getAllFiles(body).subscribe((Response) => {
      this.allFiles = Response;
      this.listOfAllFiles = Response;
    });
  }
  getPendingRatification() {
    const body = {
      type: this.type,
      assemblyId: this.assembly,
      sessionId: this.session,
      userId: this.user.userId,
      // subtype: this.subType,
      // status: 'APPROVED',
    };
    this.file.getPendingRatification(body).subscribe((Res) => {
      this.ratificationList = Res;
      this.tempRatificationList = this.ratificationList;
    });
  }
  showModal(): void {
    this.isVisibleFilter = true;
  }
  _hideFilter(): void {
    this.isVisibleFilter = false;
    this.showDocFilterModal = false;
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
      : '';
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
      : '';

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
      : '';

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
      : '';

    this.regdatedisable
      ? Object.keys(self.listOfAllFiles).forEach(function (key) {
        counter5++;
        self.regDate.push(self.listOfAllFiles[key].createdDate);
        if (counter5 === self.listOfAllFiles.length) {
          self.regDate = self.regDate.filter((v, i, a) => a.indexOf(v) === i);
          self.regDate.sort();
        }
      })
      : '';
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  clearFilter() {
    this.pendingFiles = this.listOfPendingFiles;
    this.allFiles = this.listOfAllFiles;
    this.approvedFileList = this.tempApprovedFileList;
  }
  clearSearch() {
    this.searchPending = '';
    this.searchAllFiles = '';
    this.searchMyFile = '';
  }
  doNothing() {
  }
  filtering() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.fileFiltered = this.listOfPendingFiles;
      this.fileListFiltered = this.listOfPendingFiles;
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
  viewFile(id) {
    this.router.navigate(['business-dashboard/pmbr/file-view/', id]);
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
  disableFilter(value) {
    switch (value) {
      case 1:
        this.filenodisable = false;
        this.filterSelected.fileNumber = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'File Number') {
            element.checked = false;
          }
        });
        break;
      case 2:
        this.filesubjectdisable = false;
        this.filterSelected.subject = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'File Subject') {
            element.checked = false;
          }
        });
        break;
      case 3:
        this.prioritydisable = false;
        this.filterSelected.priority = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'Priority') {
            element.checked = false;
          }
        });
        break;
      case 4:
        this.subtypeDisable = false;
        this.filterSelected.subtype = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'File Type') {
            element.checked = false;
          }
        });
        break;
    }
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
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
  getMyFiles() {
    if (this.params) {
      if (this.fileType === 'Priority List Empty Files') {
        this.subType = 'PMBR_SCHEDULE_LIST_FILE';
      } else if (this.fileType === 'Priority List Files') {
        this.subType = 'PRIORITY_LIST_REQUEST';
      }
    }
    this.file.approvedByHigherOfficial(this.user.userId).subscribe((res: any) => {
        this.approvedFileList = res.filter(element => element.type === this.type);
        this.tempApprovedFileList = res.filter(element => element.type === this.type);
        this.searchMyFileCol(this.filterSelected);
      });
  }
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
  showRequestModal(): void {
    this.getAssemblySession();
    this.isRequestModalVisible = true;
  }

  handleCancel(): void {
    this.isRequestModalVisible = false;
  }
  createFile() {
    if(this.fileForm.valid){
      const body = {
         pmbrScheduleId: 28,
        fileForm: {
          assemblyId: this.fileForm.value.assemblyId,
          currentNumber: null,
          description: this.file1.description,
          sessionId: this.fileForm.value.sessionId,
          status: "saved",
          subject: this.file1.subject,
          activeSubTypes: ["PMBR_SCHEDULE"],
          subtype: "PMBR_SCHEDULE",
          type: "PMBR",
          userId: this.user.userId,
          priority: this.file1.priority,
        },
      };
      this.file.createFile(body).subscribe((res: any) => {
        this.notify.success(  "Success",
        "File Created with file number :" + res.fileResponse.fileNumber );
        this.isRequestModalVisible = false;
        this.viewFile(res.fileResponse.fileId);
      });
    } else {
      for (const i in this.fileForm.controls) {
        this.fileForm.controls[i].markAsDirty();
        this.fileForm.controls[i].updateValueAndValidity();
      }
    }
  }
  getLawDeptFiles() {
    this.common.getBillsForVetting().subscribe((Res) => {
      this.lawDeptFiles = Res;
    });
  }
 
  viewBile(id){
    this.router.navigate(['business-dashboard/pmbr/bill-view/', id]);
  }
 
} 	
