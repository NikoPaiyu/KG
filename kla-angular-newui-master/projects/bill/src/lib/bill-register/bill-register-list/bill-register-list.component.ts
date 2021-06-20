import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillManagementService } from '../../shared/services/bill-management.service';

@Component({
  selector: 'lib-bill-register-list',
  templateUrl: './bill-register-list.component.html',
  styleUrls: ['./bill-register-list.component.css']
})
export class BillRegisterListComponent implements OnInit {
  showBulletinPart2Popup = false;
  showRemoveWithdrawWithheldPopup = false;
  result: any = [];
  allResult: any = [];
  paginationParams: any = {
    numberOfItem: 5,
    total: 0,
    pageIndex: 1,
  };
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = '';
  mapOfCheckedId: { [key: string]: boolean } = {};
  allFilteredBills: any;
  filteredBills: any;
  colCheckboxes = [
    { id: 1, label: 'listNo', check: true, disable: false },
    { id: 2, label: 'title', check: true, disable: false },
    { id: 3, label: 'type', check: true, disable: false },
    { id: 4, label: 'lang', check: true, disable: false },
    { id: 5, label: 'minister', check: true, disable: false },
    { id: 6, label: 'dept', check: true, disable: false },
    { id: 8, label: 'subject', check: true, disable: false },
    { id: 7, label: 'status', check: true, disable: false },

  ];
  constructor(
    private billService: BillManagementService,
    private router: Router
  ) {
    this._setFilter();
  }
  ngOnInit() {
    this._loadMockData();
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
      newIndex,
      newIndex + this.paginationParams.numberOfItem
    );
  }
  createBulletinPart2() {
    this.showBulletinPart2Popup = true;
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: 'Title Of Bill', key: 'title' },
      { label: 'Type Of Bill', key: 'type' },
      { label: 'Language', key: 'lang' },
      { label: 'Hon\'ble Minister', key: 'minister' },
      { label: 'Department', key: 'dept' },
      { label: 'Status', key: 'status' },
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
    this.filtrParams.colFilter = false;
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  showFilter(type) {
    // this.filtrParams.colFilter = type === "column" ? true : false;
    this.filtrParams.rowFilter = type === 'row' ? true : false;
    this.filtrParams.showPriorityPopup = false;
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
          case 'title':
            this.allResult.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case 'type':
            this.allResult.forEach((value) => {
              element.data.push(value.type);
            });
            break;
          case 'lang':
            this.allResult.forEach((value) => {
              element.data.push(value.lang);
            });
            break;
          case 'minister':
            this.allResult.forEach((value) => {
              element.data.push(value.minister);
            });
            break;
          case 'dept':
            this.allResult.forEach((value) => {
              element.data.push(value.dept);
            });
            break;
          case 'status':
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
  searchBill() {
    const checkArray: any = [];
    for (const check of this.filtrParams.tableDto) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.filteredBills = this.allResult;
      this.allFilteredBills = this.allResult;
    }
    this.result = this.allResult;
    if (this.searchParam) {
      this.result = this.filteredBills.filter(
        (element) =>
          element.title.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          element.type.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          element.language.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          element.minister.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          element.department.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          element.subject.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    } else {
      this.result = this.allFilteredBills;
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
        if (typeof filter[field].selValue === 'string') {
          if (
            !element[filter[field].key] ||
            element[filter[field].key].toLowerCase() !==
              filter[field].selValue.toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field].selValue === 'number') {
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
    console.log(this.mapOfCheckedId[list.id], this.checkbxParams.allDtCheckd );
    if (list) {
      list.viewLinks = false;
      if (this.mapOfCheckedId[list.id]) {
        // list.viewLinks = true;
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
    this._setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.allResult.filter((item) => item);
    if (sort.key && sort.value) {
      this.result = data.sort((a, b) =>
        sort.value === 'ascend'
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
  _loadMockData() {
   // this.service.getBillList().subscribe((Response) => {
      // this.result = this.allResult = new Array(5).fill(0).map((_, index) => {
      //   if (index < 6) {
      //     return {
      //       no: 332,
      //       id: index++,
      //       title: "The Kerala Appropriation(No.2) Bill, 2020",
      //       type: "Type of Bill",
      //       lang: "malayalam",
      //       minister: "Dn. T M Thomas Isaac",
      //       dept: "Finance",
      //       status: "Status",
      //       test: "test" + index++,
      //       viewLinks: false,
      //     };
      //   }
      // });
      this.result = this.allResult =[];
      const body = {
        departmentId: null,
        isGovernerRecommendation: null,
        isOrdinance: null,
        status: null,
        type: null,
      };
      this.billService.getAllRegisterBills(body).subscribe((arg: any) => {
        if(arg){
          arg.forEach((element) => {
            if (element.status) {
              if (element.status == "ADMIT") {
                element.status = "SENT TO LEGISLATION"; //ADMIT stauts showing as SENT TO LEGISLATION in front end.
              } 
            }
          });
        }
        this.result = this.allResult = arg;
      });
      this.paginationParams.total = this.result.length;
   // });
  }

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
  }

  createBulletin() {
  }

  removeWithdrawWithheldPopup() {
    this.showRemoveWithdrawWithheldPopup = true;
  }

  cancelRemoveWithdrawWithheld() {
    this.showRemoveWithdrawWithheldPopup = false;
  }

  createRemoveWithdrawWithheld() {
    alert('hi all');
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
  showLinks(Id) {
    this.result.forEach((element) => {
      if (element.id === Id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  viewRegister(billId, type) {
    this.router.navigate([
      'business-dashboard/bill/registered-bill-view',
      billId, type,
    ]);
  }
}
