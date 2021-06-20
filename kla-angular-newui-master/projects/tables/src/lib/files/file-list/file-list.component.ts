import { Component, OnInit, Inject } from '@angular/core';
import { FileServiceService } from '../../shared/services/file-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'lib-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  assemblyId = null;
  sessionId = null;
  assembly = null;
  session = null;
  type = 'TABLE';
  fileStatusType = null;
  user: any;
  pendingFiles: any = [];
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
  tableType: any;
  subType = null;
  filterSelected = {
    fileNumber: null,
    priority: null,
    subject: null,
    subtype: null,
    regDate: null,
  };
  files: any = [];
  fileType = 'PRO_TEM_SPEAKER';
  fileTypes = ['PRO_TEM_SPEAKER', 'SPEAKER_ELECTION', 'DEPUTY_SPEAKER_ELECTION','PANEL_OF_CHAIRMAN'];
  params = false;
  tableFileType;
  myFiles = null;
  approvedFileList: any = [];
  tempApprovedFileList: any = [];
  myfileFiltered;
  myfileListFiltered;
  approvedFileStatusType;
  searchMyFile: any;
  ratification = false;
  ratificationList: any;
  tempRatificationList: any;
  urlParams: any;
  isPriorityFile = null;
  fileHeading;
  assemblySession: any;
  constructor(
    private file: FileServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private common: TablescommonService,
    @Inject('authService') private AuthService) {
    this.user = AuthService.getCurrentUser();
    if (this.user.authorities[0] === 'assistant') {
      this.myFiles = true;
    }
    this.common.setTablePermissions(this.user.rbsPermissions);
    this.urlParams = this.router.getCurrentNavigation().extras.state;
    if(this.router.url.includes('tables/obituary-files')){
      this.fileHeading="Obituary Files";
      this.subType= "TABLE_OBITUARY";
    } else if(this.router.url.includes('tables/election-files')) {
      this.fileHeading="Election Files";
      this.subType= null;
    }
    else if(this.router.url.includes('tables/seat-files')) {
      this.fileHeading="Seat Files";
      this.subType= "TABLE_SEAT_ALLOCATION";
    } 
    else if(this.router.url.includes('tables/resume-files')){
      this.fileHeading="resume files";
      this.subType= "TABLE_RESUME";
    }
    else if(this.router.url.includes('tables/bulletinpart1-files')){
      this.fileHeading="bulletin part1 files";
      this.subType= "TABLE_BULLETIN_ONE";
    } 
    else if(this.router.url.includes('tables/time-allocation-files')){
      this.fileHeading="Time Allocation Files";
      this.subType= "TABLE_BUSINESS_TIME_ALLOCATION_FLOW";
    }
    else{
      this.fileHeading="Governor's Address Files";
      this.subType= "TABLE_GOVERNORS_ADDRESS";
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tableType = params.type;
    });
    this.tableFileType = 'Table Files';
    this.getAssemblySession();
  }

  // getAssemblySession() {
  //   forkJoin(
  //     this.common.getAllAssembly(),
  //     this.common.getAllSession()
  //   ).subscribe(([assembly, session]) => {
  //     this.assemblyList = assembly as Array<any>;
  //     this.assemblyList.unshift({
  //       id: 0,
  //       assemblyId: 'No Session',
  //     });
  //     const res = this.assemblyList.map((x) => x.id);
  //     // this.assemblyId = Math.max.apply(null, res);
  //     // this.assembly = Math.max.apply(null, res);
  //     this.sessionList = session as Array<any>;
  //     this.sessionList.unshift({
  //       id: 0,
  //       sessionId: 'No Session',
  //     });
  //     const response = this.sessionList.map((x) => x.id);
  //     // this.sessionId = Math.max.apply(null, response);
  //     // this.session = Math.max.apply(null, response);
  //     this.getPendingFiles();
  //     this.getAllFiles();
  //     if (this.common.doIHaveAnAccess('FILE_RATIFICATION', 'APPROVE')) {
  //       this.ratification = true;
  //       this.getPendingRatification();
  //     }
  //   });
  // }

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
        this.assemblySession.forEach((x) => {
          x.session.push({id:0, sessionId: 'No Session'}) 
          }) ;
        this.getSessionList();
        this.getPendingFiles();
        this.getAllFiles();
        if (this.common.doIHaveAnAccess('FILE_RATIFICATION', 'APPROVE')) {
          this.ratification = true;
          this.getPendingRatification();
        }
      }
    });
  }

  // get session for assembly
  getSessionList() {
    // this.sessionId = null;
    // if (this.assemblyId === 0 || !(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId))) {
    //   this.sessionList = [{
    //           id: 0,
    //           sessionId: 'No Session',
    //         }];
    // } else {
    //   if(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId)){
    //     this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
    //   }
    // }
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
        // this.sessionList.push({
        //   id: 0,
        //   sessionId: 'No Session',
        // });
      }
    }
  }

  getPendingFiles() {
    this.file.getPendingFiles(this.user.userId, this.assemblyId, this.sessionId, this.type).subscribe((Res) => {
      this.files =  Res;
      if (this.fileHeading === 'Election Files' && this.subType === null) {
        this.listOfPendingFiles = this.pendingFiles = this.files.filter(element => element.subTypes.indexOf('PRO_TEM_SPEAKER') !== -1 ||
        element.subTypes.indexOf('SPEAKER_ELECTION') !== -1 || element.subTypes.indexOf('DEPUTY_SPEAKER_ELECTION') !== -1
        || element.subTypes.indexOf('PANEL_OF_CHAIRMAN') !== -1);
      } else {
        this.listOfPendingFiles = this.pendingFiles = this.files.filter(element => element.subTypes.indexOf(this.subType) !== -1);
      }
    });
  }
  getAllFiles() {
    const body = {
      assemblyId: this.assembly,
      sessionId: this.session,
      status: this.fileStatusType,
      subtype: this.subType,
      type: 'TABLE',
      userId: this.user.userId
    };
    this.file.getAllFiles(body).subscribe((Response: any) => {
      if (this.fileHeading === 'Election Files' && this.subType === null) {
        this.allFiles = this.listOfAllFiles = Response.filter(element => element.subTypes && (element.subTypes.indexOf('PRO_TEM_SPEAKER') !== -1 ||
        element.subTypes.indexOf('SPEAKER_ELECTION') !== -1 || element.subTypes.indexOf('DEPUTY_SPEAKER_ELECTION') !== -1
        || element.subTypes.indexOf('PANEL_OF_CHAIRMAN') !== -1));
      } else {
        this.allFiles = Response;
        this.listOfAllFiles = Response;
      }
    });
  }
  getPendingRatification() {
    const body = {
      type: this.type,
      assemblyId: this.assembly,
      sessionId: this.session,
      userId: this.user.userId
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
  viewFile(id, type) {
    if (type === 'PRO_TEM_SPEAKER') {
      this.router.navigate(['business-dashboard/tables/file-view/', 'pro-tem-speaker' , id]);
    } else if (type === 'SPEAKER_ELECTION' || type === 'DEPUTY_SPEAKER_ELECTION' || type === 'PANEL_OF_CHAIRMAN') {
      this.router.navigate(['business-dashboard/tables/file-view/', 'election' , id]);
    }  
    else if (type === 'TABLE_RESUME' || type === 'TABLE_BULLETIN_ONE') {
      this.router.navigate(['business-dashboard/tables/file-view/', 'table-diary' , id]);}
    else {
      this.router.navigate(['business-dashboard/tables/file-view/', id]);
    }
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
    this.file.approvedByHigherOfficial(this.user.userId).subscribe((res: any) => {
      const tempData = res;
      if (this.fileHeading === 'Election Files' && this.subType === null) {
        this.approvedFileList = this.tempApprovedFileList = tempData.filter(element => element.subTypes && (element.subTypes.indexOf('PRO_TEM_SPEAKER') !== -1 ||
        element.subTypes.indexOf('SPEAKER_ELECTION') !== -1 || element.subTypes.indexOf('DEPUTY_SPEAKER_ELECTION') !== -1
        || element.subTypes.indexOf('PANEL_OF_CHAIRMAN') !== -1)
        );
      } else {
        this.approvedFileList = this.tempApprovedFileList = tempData.filter(element => 
              element.subTypes && element.subTypes.includes(this.subType)
            );
      }
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
}
