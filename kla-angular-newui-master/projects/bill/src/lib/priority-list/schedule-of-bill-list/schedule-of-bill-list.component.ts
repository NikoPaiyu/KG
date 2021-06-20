import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { ProrityListService } from '../../shared/services/prority-list.service';

@Component({
  selector: 'lib-schedule-of-bill-list',
  templateUrl: './schedule-of-bill-list.component.html',
  styleUrls: ['./schedule-of-bill-list.component.scss']
})
export class ScheduleOfBillListComponent implements OnInit {
  filtrParams: any = {};
  searchParam = '';
  result: any;
  allResult: any;
  colCheckboxes = [
    { id: 1, label: 'Session', check: true, disable: false },
    { id: 2, label: 'Assembly', check: true, disable: false },
    { id: 3, label: 'Date', check: true, disable: false },
    { id: 4, label: 'FileNo', check: true, disable: false },
    // { id: 5, label: 'Correspondence', check: true, disable: false },
    // { id: 6, label: 'COS', check: true, disable: false },
    { id: 7, label: 'Status', check: true, disable: false },
  ];
  checkbxParams: any = { numberOfChecked: 0 };
  mapOfCheckedId: { [key: string]: boolean } = {};
  tableParams: any = { colSpan: false };
  paginationParams: any = {
    numberOfItem: 10,
    total: 0,
    pageIndex: 1,
  };
  user: any;

  constructor(private common: BillcommonService,
              @Inject('authService') private AuthService,
              private priorityListService: ProrityListService,
              private router: Router,
              private route: ActivatedRoute) {
    this.user = AuthService.getCurrentUser();
    this.common.setBillPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.setFilter();
    this.getData();
    this.checkColumnDisable();
  }

  showFilter(type) {
    // this.filtrParams.colFilter = type === "column" ? true : false;
    this.filtrParams.rowFilter = type === 'row' ? true : false;
  }

  clearFilter() {
    this.setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }

  setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [];

    const sectionFields = [
      { label: 'Session', key: 'sessionValue' },
      { label: 'Assembly', key: 'assemblyValue' },
      { label: 'Status', key: 'status' },
    ];
    sectionFields.forEach((element) => {
      tableDataMdl.push(element);
    });
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

  _loadSelectedfilterData() {
    let count = 0;
    this.filtrParams.tableDto.forEach((element) => {
      count++;
      if (element.filtersel) {
        switch (element.key) {
          case 'sessionValue':
            this.allResult.forEach((value) => {
              element.data.push(value.sessionValue);
            });
            break;
          case 'assemblyValue':
            this.allResult.forEach((value) => {
              element.data.push(value.assemblyValue);
            });
            break;
          case 'date':
            this.allResult.forEach((value) => {
              element.data.push(value.createdDate);
            });
            break;
          case 'fileNo':
            this.allResult.forEach((value) => {
              element.data.push(value.fileNo);
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

  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
  }

  disableFilter(filter) {
    filter.filtersel = false;
    filter.checked = false;
    filter.data = [];
    filter.selValue = null;
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

  showLinks(id) {
    this.result.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
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

  pageSizeChange(numberOfItem) {
    this.paginationParams.pageIndex = 1;
    this.paginationParams.numberOfItem = numberOfItem;
    this.loadNext(this.paginationParams.pageIndex);
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
  }

  _filterRows() {
    this.filtrParams.rowFilter = false;
    this.filtrParams.tableDto.forEach((element) => {
      element.filtersel = element.checked;
    });
    this._loadSelectedfilterData();
  }

  _chooseFilter(box) {
    box.checked = !box.checked;
  }

  checkColumnDisable() {
    this.colCheckboxes = [
      { id: 1, label: 'Session', check: true, disable: false },
      { id: 2, label: 'Assembly', check: true, disable: false },
      { id: 3, label: 'Date', check: true, disable: false },
      { id: 4, label: 'FileNo', check: true, disable: false },
      { id: 5, label: 'Correspondence', check: true, disable: false },
      { id: 6, label: 'COS', check: true, disable: false },
      { id: 7, label: 'Status', check: true, disable: false },
    ];
    if (!this.common.doIHaveAnAccess('FILE', 'READ')) {
      this.colCheckboxes[3].disable = true;
      this.colCheckboxes[3].check = false;
    }

  }

  getData() {
    this.priorityListService.getScheduleList().subscribe(Res => {
           this.result = this.allResult = Res;
           console.log(this.result);
        });
  }

  viewSchedule(id) {
    this.router.navigate(['schedule-for-bill', id], {
      relativeTo: this.route.parent
    });
  }
  viewPriorityList(id) {
    this.router.navigate(['view-priority-list', id], {
      relativeTo: this.route.parent
    });
  }


}
