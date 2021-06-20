import { Component, OnInit, Inject } from '@angular/core';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-translated-bills',
  templateUrl: './translated-bills.component.html',
  styleUrls: ['./translated-bills.component.css']
})
export class TranslatedBillsComponent implements OnInit {
  translatedList: any = [];
  allTranslatedList: any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "Title Of Bill", check: true, disable: false },
    { id: 2, label: "Type Of Bill", check: true, disable: false },
    { id: 3, label: "Date of Erratum", check: true, disable: false },
    { id: 4, label: "No of Erratums", check: true, disable: false },
    { id: 5, label: "Status", check: true, disable: false },
  ];
  billId;
  user: any;
  permissions = {
    publish: false,
    viewPublished: false
  };
  translation = {
    showpopUp: false,
    transData: ''
  }
  billDetails;
  constructor(
    private billService: BillManagementService,
    private notification: NzNotificationService,
    private commonService: BillcommonService,
    private fileService: FileServiceService,
    public modalService: NzModalService,  private router: Router,
    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setBillPermissions(this.user.rbsPermissions);
    this._setFilter();
  }
  ngOnInit() {
    this.getRbsPermissions();
    this.getList();
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Title Of Bill", key: "billTitle" },
      { label: "Original Language", key: "billOriginalLanguage" },
      { label: "Bill Title in Translated Language", key: "title" },
      { label: "Translated Language ", key: "language" },
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
          case "billTitle":
            this.allTranslatedList.forEach((value) => {
              element.data.push(value.billTitle);
            });
            break;
          case "billOriginalLanguage":
            this.allTranslatedList.forEach((value) => {
              element.data.push(value.billOriginalLanguage);
            });
            break;
          case "title":
            this.allTranslatedList.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case "language":
            this.allTranslatedList.forEach((value) => {
              element.data.push(value.language);
            });
            break;
          case "status":
            this.allTranslatedList.forEach((value) => {
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
    this.translatedList = this.allTranslatedList;
    if (this.searchParam) {
      this.translatedList = this.allTranslatedList.filter(
        (element) =>
          (element.billTitle &&
            element.billTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billOriginalLanguage &&
            element.billOriginalLanguage
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.language &&
            element.language ==
              this.searchParam) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.translatedList = this.allTranslatedList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.translatedList = this.allTranslatedList;
    } else {
      this.translatedList = this.allTranslatedList.filter((item: any) =>
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
    this.allTranslatedList.forEach((item) => (this.mapOfCheckedId[item.billId] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allTranslatedList.filter(
      (item) => this.mapOfCheckedId[item.billId]
    ).length;
    this.checkbxParams.allDtCheckd = this.allTranslatedList.every(
      (item) => this.mapOfCheckedId[item.billId]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.translatedList.forEach((element) => {
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
    const data = this.allTranslatedList.filter((item) => item);
    if (sort.key && sort.value) {
      this.translatedList = data.sort((a, b) =>
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
      this.translatedList = data;
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

  getList() {
    this.billService.getAllTranslatedBills().subscribe((arg: any) => {
      if (this.permissions.viewPublished) {
        this.translatedList = this.allTranslatedList = arg.filter(b => b.status === 'PUBLISHED');
      } else {
        this.translatedList = this.allTranslatedList = arg;
      }
    });
    this.translatedList.forEach((element) => {
      element.viewLinks = false;
    });
  }
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.translatedList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else{
        element.viewLinks = false;
      }
    });
  }
  resubmittoFile(list){
    if(!list.billFileId){
      this.notification.warning("Warning","Can't do it now...Bill is not attached to file!!");
      return;
    }else{
      const body = {
        translationId: list.id,
        fileForm: {
          fileId: list.billFileId,
          activeSubTypes: ["BILL_TRANSLATION"],
          type: "BILL",
          userId: this.user.userId,
        },
        priorityMasterId: 0,
      };
      this.fileService
      .getFileById(list.billFileId, this.user.userId)
      .subscribe((res: any) => {
        const fileStatus = res.fileResponse.status;
        if (fileStatus === "APPROVED") {
          this.billService.attachErrataToFile(body).subscribe((Res: any) => {
            this.notification.success("Success", "Resubmitted Successfully");
            this.router.navigate([
              "business-dashboard/bill/file-view",
              Res.fileResponse.fileId,
            ]);
          });
        } else {
          this.notification.warning("Warning","Currently bill file is under approval flow..Cannot resubmit now...");
           return;
        }
      });
    }

  }
  downloadTranlatedBill(url){
    window.open(url,'_blank');
  }

  publishTranslatedBill(id) {
    this.billService.publishTranslatedBills(id).subscribe((arg: any) => {
      this.notification.success('Success', 'Published Successfully');
      this.getList();
    });
  }

  getRbsPermissions() {
    if (this.commonService.doIHaveAnAccess('BILL_TRANSLATION_PUBLISH', 'CREATE')) {
      this.permissions.publish = true;
    }
    if (this.commonService.doIHaveAnAccess('BILL_TRANSLATION_PUBLISH', 'READ')) {
      this.permissions.viewPublished = true;
    }
  }
  cancelTranslation(cancelled) {
    this.translation.showpopUp = false;
    if (!cancelled) {
      this.getList();
    }
  }
  editTranslatedBillDetails(item){
    this.translation.showpopUp = true;
    this.billDetails = {};
    this.billDetails.id = item.billId;
    this.billDetails.language = item.billOriginalLanguage;
    this.translation.transData = item;
  }

}
