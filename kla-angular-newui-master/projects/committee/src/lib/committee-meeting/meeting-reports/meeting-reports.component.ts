import { Component, Inject, OnInit } from '@angular/core';
import { CommitteeService } from '../../shared/services/committee.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'committee-meeting-reports',
  templateUrl: './meeting-reports.component.html',
  styleUrls: ['./meeting-reports.component.css']
})
export class MeetingReportsComponent implements OnInit {
reportList: any = [];
  allreportList: any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "Title Of Bill", check: true, disable: false },
    { id: 2, label: "Type Of Bill", check: true, disable: false },
    { id: 3, label: "File Number", check: true, disable: false },
    { id: 4, label: "Preview", check: true, disable: false },
    { id: 5, label: "Status", check: true, disable: false },
  ];
  billId;
  reportContent = null;
  showPreviewPopUp = false;
  user: any;
  rbsPermission={
    sentToLegislation : false
  }
  constructor(
    private route: ActivatedRoute,
    private committeeService: CommitteeService, private router: Router,
    private notification: NzNotificationService, private activeRoute: ActivatedRoute,
    @Inject('authService') private AuthService, public common: CommitteecommonService,
    private notify: NzNotificationService,
  ) {
    this.user = AuthService.getCurrentUser();
    this.common.setCommitteePermissions(this.user.rbsPermissions);
    this._setFilter();
  }
  ngOnInit() {
    this.getreportList();
    this.getRbsPermissionsinList();
  }
  getRbsPermissionsinList(){
    if (this.common.doIHaveAnAccess('SENT_REPORT_TO_LEG', 'CREATE')) {
      this.rbsPermission.sentToLegislation = true;
    }
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Title Of Bill", key: "businessTitle" },
      { label: "File Number", key: "fileNumber" },
      { label: "Status", key: "status" },
    ];
    // tslint:disable-next-line: prefer-for-of
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
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  showFilter(type) {
    this.filtrParams.rowFilter = type === "row" ? true : false;
  }
  _confrmFilter(): void {
    if (this.filtrParams.rowFilter) {
      this._filterRows();
    }
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
          case "businessTitle":
            this.allreportList.forEach((value) => {
              element.data.push(value.businessTitle);
            });
            break;
          case "fileNumber":
            this.allreportList.forEach((value) => {
              element.data.push(value.fileNumber);
            });
            break;
          case "status":
            this.allreportList.forEach((value) => {
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
  searchonErrata() {
    this.reportList = this.allreportList;
    if (this.searchParam) {
      this.reportList = this.allreportList.filter(
        (element) =>
          (element.businessTitle &&
            element.businessTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.reportList = this.allreportList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.reportList = this.allreportList;
    } else {
      this.reportList = this.allreportList.filter((item: any) =>
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
    this.allreportList.forEach((item) => (this.mapOfCheckedId[item.billId] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allreportList.filter(
      (item) => this.mapOfCheckedId[item.billId]
    ).length;
    this.checkbxParams.allDtCheckd = this.allreportList.every(
      (item) => this.mapOfCheckedId[item.billId]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.reportList.forEach((element) => {
        element.viewLinks = false;
      });
    }
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
    this._setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }
  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.allreportList.filter((item) => item);
    if (sort.key && sort.value) {
      this.reportList = data.sort((a, b) =>
        sort.value === "ascend"
          ? (a[sort.key!] && a[sort.key!].toLowerCase()) >
            (b[sort.key!] && b[sort.key!].toLowerCase())
            ? 1
            : -1
          : (b[sort.key!] && b[sort.key!].toLowerCase()) >
            (a[sort.key!] && a[sort.key!].toLowerCase())
          ? 1
          : -1
      );
    } else {
      this.reportList = data;
    }
  }

  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 6) {
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

  getreportList() {
    this.committeeService.getAllApprovedReports(null).subscribe((arg: any) => {
      this.reportList = this.allreportList = arg;
    });
    this.reportList.forEach((element) => {
      element.viewLinks = false;
    });
  }
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.reportList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else{
        element.viewLinks = false;
      }
    });
  }
  sentReport(id){
    this.committeeService.sentReporttoLegislation(id).subscribe((arg: any) => {
     this.notification.success("Success","Success");
     this.getreportList();
    });
  }
  gotoFileView(fileId){
    this.router.navigate([
      'business-dashboard/committee/file-view/',
      fileId,
    ]);
  }
  showPreview(reportContent){
    this.reportContent = reportContent;
    this.showPreviewPopUp= true;
  }
  cancelPreview(event){
    this.reportContent = null;
    this.showPreviewPopUp= event;
  }
}
