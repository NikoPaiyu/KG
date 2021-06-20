import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProrityListService } from '../../../shared/services/prority-list.service';
import { BillcommonService } from '../../../shared/services/billcommon.service';
import { BillManagementService } from '../../../shared/services/bill-management.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { BillBulletinService } from '../../../shared/services/bill-bulletin.service';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { CosViewComponent } from '../../../files/cos-view/cos-view.component';

@Component({
  selector: 'lib-priority-list-requests',
  templateUrl: './priority-list-requests.component.html',
  styleUrls: ['./priority-list-requests.component.css']
})
export class PriorityListRequestsComponent implements OnInit {
  @Input() isCreator;
  bulletinData;
  buttonControls = {
    send: false,
    createFile: false
  }
  user;
  result: any = [];
  allResult: any = [];
  paginationParams: any = {
    numberOfItem: 10,
    total: 0,
    pageIndex: 1,
  };
  showBulletinPart2Popup = false;
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "Session", check: true, disable: false },
    { id: 2, label: "Assembly", check: true, disable: false },
    { id: 3, label: "Date", check: true, disable: false },
    { id: 4, label: "FileNo", check: true, disable: false },
    { id: 5, label: 'Correspondence', check: true, disable: false },
    { id: 6, label: 'COS', check: true, disable: false },
    { id: 7, label: "Status", check: true, disable: false },
  ];
  fileCreateModel = false;
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  priorityMaster;
  permission = {
    createBulletin: false,
    correspondence: false,
    cos: false
  };
  reportParams = {
    showPdf : false,
    finalUrl : null
  }
  initialDaysMaster: any = null;
  disableDates: any = null;
  initialDaysModal = false;
  withCurrentUser = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private priorityListService: ProrityListService,
    private common: BillcommonService,
    private billService: BillManagementService,
    private bulletinService: BillBulletinService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    @Inject("authService") private AuthService,
    private fileService: FileServiceService, ) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }
  ngOnInit() {

    this.setFilter();
    this.getData();
    this.checkColumnDisable();
    this.setRBSPermisson();
  }
  setRBSPermisson() {

    if (this.common.doIHaveAnAccess("PRIORITY_LIST_REQUEST", "APPROVE"))
      this.buttonControls.send = true;
    if (this.common.doIHaveAnAccess("PRIORITY_LIST_REQUEST", "CREATE"))
      this.buttonControls.createFile = true;
    if (this.common.doIHaveAnAccess("BULLETIN", "CREATE")) {
      this.permission.createBulletin = true;
    }
    if (this.common.doIHaveAnAccess('ATTACH_CORRESPONDENCE', 'CREATE')) {
      this.permission.correspondence = true;
    }
    if (this.common.doIHaveAnAccess('ATTACH_COS', 'CREATE')) {
      this.permission.cos = true;
    }
  }
  pageSizeChange(numberOfItem) {
    this.paginationParams.pageIndex = 1;
    this.paginationParams.numberOfItem = numberOfItem;
    this.loadNext(this.paginationParams.pageIndex);
  }
  pageIndexChange(index) {
    this.paginationParams.pageIndex = index;
    this.loadNext(this.paginationParams.pageIndex);
  }
  loadNext(index) {
    const newIndex = index * 10;
    this.result = this.allResult.slice(
      index - 1,
      newIndex + this.paginationParams.numberOfItem
    );
  }
  setFilter() {
    this.filtrParams.tableDto = [];
    let tableDataMdl = [];

    let sectionFields = [
      { label: "Session", key: "sessionValue" },
      { label: "Assembly", key: "assemblyValue" },
      { label: "Status", key: "status" },
    ];
    sectionFields.forEach((element) => {
      tableDataMdl.push(element);
    });
    for (let i = 0; i < tableDataMdl.length; i++) {
      const row = {
        key: tableDataMdl[i].key,
        label: tableDataMdl[i].label,
        checked: false,
        filtersel: false,
        data: [],
        selValue: null,
        disableCol: false,
      };
      this.filtrParams.tableDto.push(row);
    }
    this.filtrParams.colFilter = false;
    this.filtrParams.rowFilter = false;

  }
  showFilter(type) {
    // this.filtrParams.colFilter = type === "column" ? true : false;
    this.filtrParams.rowFilter = type === "row" ? true : false;

  }
  _confrmFilter(): void {
    if (this.filtrParams.colFilter) {
      this._filterCols();
    } else {
      this._filterRows();
    }
  }
  _filterCols() {
    this.filtrParams.colFilter = false;
    // this.filtrParams.tableDto.forEach((element) => {
    //   if (element.checked) {
    //     element.disableCol = true;
    //   }
    // });
  }
  _filterRows() {
    this.filtrParams.rowFilter = false;
    this.filtrParams.tableDto.forEach((element) => {
      element.filtersel = element.checked;
    });
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    let count = 0;
    this.filtrParams.tableDto.forEach((element) => {
      count++;
      if (element.filtersel) {
        switch (element.key) {
          case "sessionValue":
            this.allResult.forEach((value) => {
              element.data.push(value.sessionValue);
            });
            break;
          case "assemblyValue":
            this.allResult.forEach((value) => {
              element.data.push(value.assemblyValue);
            });
            break;
          case "date":
            this.allResult.forEach((value) => {
              element.data.push(value.createdDate);
            });
            break;
          case "fileNo":
            this.allResult.forEach((value) => {
              element.data.push(value.fileNo);
            });
            break;
          case "status":
            this.allResult.forEach((value) => {
              element.data.push(value.status);
            });
            break;
          default:
            break;
        }
      }
    });
    if (count === this.filtrParams.tableDto.length) {
      this.filtrParams.tableDto.forEach((element) => {
        element.data = element.data.filter((v, i, a) => a.indexOf(v) === i);
      });
    }
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  searchOnList() {
    this.result = this.allResult;
    if (this.searchParam) {

      this.result = this.allResult.filter(
        (element) =>
          (element.sessionValue && element.sessionValue.toString()
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.assemblyValue && element.assemblyValue.toString()
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          (element.date && element.date.toLowerCase().includes(this.searchParam.toLowerCase())) ||
          (element.fileNo && element.fileNo
            .toLowerCase()
            .includes(this.searchParam.toLowerCase())) ||
          element.status.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.result = this.allResult;
    } else {
      this.result = this.allResult.filter((item: any) =>
        this.applyFilter(item, this.filtrParams.tableDto)
      );
    }
  }
  applyFilter(element: any, filter: any) {
    for (const field in filter) {
      if (filter[field].selValue) {
        if (typeof filter[field].selValue === "string") {
          if (
            !element[filter[field].key] ||
            element[filter[field].key].toLowerCase() !==
            filter[field].selValue.toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field].selValue === "number") {
          if (
            !element[filter[field].key] ||
            element[filter[field].key] !== filter[field].selValue
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
  _checkAllRows(value: boolean): void {
    this.allResult.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    if (list) {
      list.viewLinks = false;
      if (this.mapOfCheckedId[list.id]) {
        list.viewLinks = true;
      }
    }
    this.checkbxParams.numberOfChecked = this.allResult.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.allResult.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
  }
  disableFilter(filter) {
    filter.filtersel = false;
    filter.checked = false;
    filter.data = [];
    filter.selValue = null;
    this.searchCol();
    this._loadSelectedfilterData();
  }
  clearFilter() {
    this.setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }

  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
  }

  sort(sort: { key: string; value: string }): void {
    const data = this.allResult.filter((item) => item);
    if (sort.key && sort.value) {
      this.result = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.result = data;
    }
  }
  getData() {

    this.priorityListService.getAllPriorityListRequests().subscribe((res: any) => {
      if (this.buttonControls.send) {
        this.result = this.allResult = res.filter(element => element.status === 'RESPONSE_PENDING' ||
          element.status === 'RESPONDED');
      } else {
        this.result = this.allResult = res;
      }
    })
    this.paginationParams.total = this.result.length;
  }


  viewPrioritylist(request) {
    let path = "../bill/view-priority-list";
    this.router.navigate([path, request.priorityMaster.id], {
      relativeTo: this.route.parent,
    });
  }
  requestPriorityList() {
    this.router.navigate([""]);
  }

  createBulletinPart2(priorityMaster) {
    this.bulletinData = {
      "businessId": priorityMaster.id,
      "businessType": "PRIORITY_LIST",
      "description": "",
      "fileId": priorityMaster.fileId,
      "part": "2",
      "title": "",
      "type": "PRIORITY_LIST",
      "userId": this.user.userId,
      assemblyId: null,
      sessionId: null
    };
    this.fileService.getFileById(priorityMaster.fileId, this.user.userId).subscribe((res: any) => {
      const fileStatus = res.fileResponse.status;
      if (fileStatus === 'APPROVED') {
        this.showBulletinPart2Popup = true;
      } else {
        this.modal.create({
          nzTitle: 'Create Bulletin Part 2',
          nzWidth: '500',
          nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot create bulletin now... </b>',
          nzOkText: 'OK',
          nzOnOk: () => { },
        });
      }
    });
    this.priorityMaster = priorityMaster;
  }
  cancelBulletin() {
    this.showBulletinPart2Popup = false;
    this.bulletinData = {};
  }
  afterCreateBulletin(event) {
    if (event) {
      this.getData();
      this.notification.success("Success", "Bulletin Created.")
      this.resubmitFile(this.priorityMaster, 'BULLETIN', 'bulletins');
    }
    this.cancelBulletin();
  }

  showLinks(id) {
    this.result.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else {
        element.viewLinks = false;
      }
    });
  }
  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 8) {
      for (const box of this.colCheckboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colCheckboxes) {
        box.disable = false;
      }
    }
  }
  checkColumnDisable() {
    this.colCheckboxes = [
      { id: 1, label: "Session", check: true, disable: false },
      { id: 2, label: "Assembly", check: true, disable: false },
      { id: 3, label: "Date", check: true, disable: false },
      { id: 4, label: "FileNo", check: true, disable: false },
      { id: 5, label: 'Correspondence', check: true, disable: false },
      { id: 6, label: 'COS', check: true, disable: false },
      { id: 7, label: "Status", check: true, disable: false },
    ];
    if (!this.common.doIHaveAnAccess("FILE", "READ")) {
      this.colCheckboxes[3].disable = true;
      this.colCheckboxes[3].check = false;
    }

  }

  sendPriorityList(request) {

    this.priorityListService.getPriorityListByAssemblySession(request.assemblyId, request.sessionId).subscribe((res: any) => {
      if (res && res.id) {
        let path = "../bill/view-priority-list";
        this.router.navigate([path, res.id, request.id], {
          relativeTo: this.route.parent,
        });
      }
      else {
        this.notification.error("Alert", "Priority List Not Available.")
      }

    })
  }

  //function to show file model
  showcreateFileModal(priorityMaster) {
    this.priorityMaster = priorityMaster;
    this.fileCreateModel = true;
  }

  hidecreateFileModal() {
    this.fileCreateModel = false;
    this.priorityMaster = {};
    this.file = {
      subject: "",
      priority: null,
      description: "",
    };
  }
  //create File
  createFile() {
    const body = {
      billId: 0,
      fileForm: {
        assemblyId: this.priorityMaster.assemblyId,
        currentNumber: null,
        description: this.file.description,
        sessionId: this.priorityMaster.sessionId,
        status: "saved",
        subject: this.file.subject,
        activeSubTypes: ["BILL_PRIORITY_LIST_FILE"],
        subtype: "BILL_PRIORITY_LIST_FILE",
        type: "BILL",
        userId: this.user.userId,
        priority: this.file.priority,
      },
      priorityMasterId: this.priorityMaster.id
    };
    this.billService.createFile(body).subscribe((Res: any) => {
      this.hidecreateFileModal();
      this.getData();
      this.notification.success(
        "Success",
        "File Created. No : " + Res.fileResponse.fileNumber
      );
      this.router.navigate(['business-dashboard/bill/file-view/', 'priorityList',  Res.fileResponse.fileId]);
    });
  }

  viewFile(fileId) {
    if (fileId) {
      this.router.navigate([
        "../bill/file-view",
        fileId
      ], {
        relativeTo: this.route.parent,
      });
    }

  }

  resubmitFile(list, type, business) {
    let body;
    if (type === 'BULLETIN') {
      body = {
        fileForm: {
          fileId: list.fileId,
          activeSubTypes: [type],
          type: 'BILL',
          userId: this.user.userId,
          subtype: 'BILL_PRIORITY_LIST_FILE'
        }
      };
    } else if (type === 'BILL_PRIORITY_LIST_INITAL_DATES') {
      body = {
        fileForm: {
          fileId: list.fileId,
          activeSubTypes: [type],
          type: 'BILL',
          userId: this.user.userId,
          subtype: 'BILL_PRIORITY_LIST_FILE'
        },
        priorityMasterId: list.priorityMaster.id
      };
    } else {
      body = {
        fileForm: {
          fileId: list.fileId,
          activeSubTypes: [type],
          type: 'BILL',
          userId: this.user.userId,
          subtype: 'BILL_PRIORITY_LIST_FILE'
        },
        priorityMasterId: list.priorityMaster.id
      };
    }
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
      this.notification.success(
        'Success',
        'File resubmitted successfully.'
      );
      this.router.navigate(['business-dashboard/bill/file-view/', business, list.fileId]);
    });
  }

  showCorrespondence(corespondenceId) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      corespondenceId,
    ], {
      state: {
        returnUrl: 'business-dashboard/bill/list-priority-list'
      }
    });
  }

  draftCorrespondence(list) {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "REQUEST_PRIORITY_LIST",
          type: "LEGISLATION_SECTION",
          fileId: list.fileId,
          businessReferId: list.id,
          businessReferType: "BILL",
          businessReferSubType: "PRIORITY_LIST_REQUEST",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: list.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: "LAW",
          toDisplayName: "Law",
          onSuccess: "business-dashboard/bill/list-priority-list",
        },
      }
    );
  }

  showCOS(list) {
    // this.modal.create({
    //   nzTitle: 'COS Preview',
    //   nzContent: CosViewComponent,
    //   nzClosable: true,
    //   nzFooter: null,
    //   nzMaskClosable: false,
    //   nzComponentParams: {
    //     calendarSittingId: cosId,
    //   }
    // });
    this.priorityListService.getCOSId(list.assemblyId, list.sessionId).subscribe((res: any) => {
        if (res) {
          res.assemblyId = list.assemblyValue
          res.sessionId =  list.sessionValue
          res.reportType = "COSReport";
          res.location = "report.pdf";
          if (res.calendarOfDaysList) {
            this.getPDF(res);
          } else {
            this.reportParams.showPdf = false;
            this.notification.warning("Sorry Report is not Available","");
          }
        }
      });
  }
  getPDF(body){
    var mediaType = "application/pdf";
    this.reportParams.finalUrl = null;
    this.priorityListService.getReport(body).subscribe((response) => {
      if (response) {
        var blob = new Blob([response], { type: mediaType });
        this.reportParams.finalUrl = URL.createObjectURL(blob);
        this.reportParams.showPdf = true;
      } else {
        this.reportParams.showPdf = false;
        this.notification.warning("Sorry Report is not Available","");
      }
    });
  }
  cancelCos(){
    this.reportParams.finalUrl = null;
    this.reportParams.showPdf = null;
  }
  attachCOS(body, fileId) {
    this.priorityListService.attachCOS(body).subscribe((res: any) => {
      this.notification.warning('Success.', 'COS Attached Successfully!');
      this.getData();
      this.router.navigate(['file-view/', fileId], {
        relativeTo: this.route.parent
      });
    });
  }

  getCOS(list) {
    this.priorityListService.getCOSId(list.assemblyId, list.sessionId).subscribe((res: any) => {
      if (res.calendarofSittingId === 0) {
        this.notification.warning('Warning.', 'No COS found. Please create COS!');
      } else {
        const body = {
          assemblyId: list.assemblyId,
          cosId: res.calendarofSittingId,
          sessionId: list.sessionId
        };
        this.attachCOS(body, list.fileId);
      }
    });
  }

  isAssistant() {
    return (this.user.authorities.includes('assistant'));
  }

  showInitialDaysModal(disableDates, priorityMaster, fileId) {
    this.disableDates = disableDates;
    this.initialDaysMaster = priorityMaster;
    this.initialDaysModal = true;
  }

  closeInitialDaysModal() {
    this.initialDaysMaster = null;
    this.initialDaysModal = false;
    this.getData();
  }

}
