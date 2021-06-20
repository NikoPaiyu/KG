import { Component, Inject, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { DocumentServiceService } from '../shared/services/document-service.service';

@Component({
  selector: 'tables-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.css']
})
export class ListDocumentsComponent implements OnInit {
  documentsList: any = [];
  allDocumentsList: any = [];
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
  constructor(
    private billService: DocumentServiceService,
    private notification: NzNotificationService,
    private commonService: TablescommonService,
    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    // this.commonService.setTablePermissions(this.user.userId);
    this._setFilter();
  }
  ngOnInit() {
    this.getDocumentList();
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Title Of Bill", key: "billTitle" },
      { label: "Type Of Bill", key: "billType" },
      { label: "Date of Erratum", key: "date" },
      { label: "No of Erratums", key: "errataCount" },
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
            this.allDocumentsList.forEach((value) => {
              element.data.push(value.billTitle);
            });
            break;
          case "billType":
            this.allDocumentsList.forEach((value) => {
              element.data.push(value.billType);
            });
            break;
          case "date":
            this.allDocumentsList.forEach((value) => {
              element.data.push(value.date);
            });
            break;
          case "numberOfErrata":
            this.allDocumentsList.forEach((value) => {
              element.data.push(value.numberOfErrata);
            });
            break;
          case "status":
            this.allDocumentsList.forEach((value) => {
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
  search() {
    this.documentsList = this.allDocumentsList;
    if (this.searchParam) {
      this.documentsList = this.allDocumentsList.filter(
        (element) =>
          (element.billTitle &&
            element.billTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billType &&
            element.billType
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.date &&
            element.date
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.numberOfErrata &&
            element.numberOfErrata ==
              this.searchParam) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.documentsList = this.allDocumentsList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.documentsList = this.allDocumentsList;
    } else {
      this.documentsList = this.allDocumentsList.filter((item: any) =>
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
    this.allDocumentsList.forEach((item) => (this.mapOfCheckedId[item.billId] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allDocumentsList.filter(
      (item) => this.mapOfCheckedId[item.billId]
    ).length;
    this.checkbxParams.allDtCheckd = this.allDocumentsList.every(
      (item) => this.mapOfCheckedId[item.billId]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.documentsList.forEach((element) => {
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
    const data = this.allDocumentsList.filter((item) => item);
    if (sort.key && sort.value) {
      this.documentsList = data.sort((a, b) =>
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
      this.documentsList = data;
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

  getDocumentList() {
    this.billService.getDocumentList(null).subscribe((arg: any) => {
      this.documentsList = this.allDocumentsList = arg;
    });
    this.documentsList.forEach((element) => {
      element.viewLinks = false;
    });
  }
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.documentsList.forEach((element) => {
      if (element.billId === id) {
        element.viewLinks = true;
      }
      else{
        element.viewLinks = false;
      }
    });
  }
  create(){
    
  }
}
