import { Component, OnInit } from '@angular/core';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-general-amendment',
  templateUrl: './general-amendment.component.html',
  styleUrls: ['./general-amendment.component.scss']
})
export class GeneralAmendmentComponent implements OnInit {
  showCreateBill = false;
  generalAmendmentList: any = [];
  allGeneralAmendmentList: any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = '';
  mapOfCheckedId: { [key: string]: boolean } = {};
  priorityList = {
    assembly: null,
    session: null,
    categoryTitle: null,
  };

  colCheckboxes = [
    { id: 0, label: 'Bill No', check: true, disable: false },
    { id: 1, label: 'Title Of Bill', check: true, disable: false },
    { id: 2, label: 'Type Of Bill', check: true, disable: false },
    { id: 3, label: 'fileNumber', check: true, disable: false },
    { id: 4, label: 'No of Amendments', check: true, disable: false },
    { id: 5, label: 'Responded Members', check: true, disable: false },
  ];
  constructor(private billService: BillManagementService,
    private router: Router) {
    this._setFilter();
  }

  ngOnInit() {
    this.getBillsList();
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: 'Bill No', key: 'billNumber' },
      { label: 'Title Of Bill', key: 'billTitle' },
      { label: 'Type Of Bill', key: 'billType' },
      { label: 'File Number', key: 'fileNumber' },
      { label: 'No of Amendments', key: 'numberOfAmendments' },
      { label: 'Responded Members', key: 'numberOfAmendments' }
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
    this.filtrParams.showPriorityPopup = false;
  }
  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
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
          case 'billNumber':
            this.allGeneralAmendmentList.forEach((value) => {
              element.data.push(value.billNumber);
            });
            break;
          case 'billTitle':
            this.allGeneralAmendmentList.forEach((value) => {
              element.data.push(value.billTitle);
            });
            break;
          case 'billType':
            this.allGeneralAmendmentList.forEach((value) => {
              element.data.push(value.billType);
            });
            break;
          case 'fileNumber':
            this.allGeneralAmendmentList.forEach((value) => {
              element.data.push(value.fileNumber);
            });
            break;
          case 'numberOfAmendments':
            this.allGeneralAmendmentList.forEach((value) => {
              element.data.push(value.numberOfAmendments);
            });
            break;
          case 'numberOfAmendments':
            this.allGeneralAmendmentList.forEach((value) => {
              element.data.push(value.numberOfAmendments);
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
    this.generalAmendmentList = this.allGeneralAmendmentList;
    if (this.searchParam) {
      this.generalAmendmentList = this.allGeneralAmendmentList.filter(
        (element) =>
          (element.billNumber &&
            element.billNumber.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billTitle &&
            element.billTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billType &&
            element.billType
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.numberOfAmendments &&
            element.numberOfAmendments.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.generalAmendmentList = this.allGeneralAmendmentList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.generalAmendmentList = this.allGeneralAmendmentList;
    } else {
      this.generalAmendmentList = this.allGeneralAmendmentList.filter((item: any) =>
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
    this.allGeneralAmendmentList.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allGeneralAmendmentList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.allGeneralAmendmentList.every(
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
    const data = this.allGeneralAmendmentList.filter((item) => item);
    if (sort.key && sort.value) {
      this.generalAmendmentList = data.sort((a, b) =>
        sort.value === 'ascend'
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
      this.generalAmendmentList = data;
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

  getBillsList() {
    this.billService.getGeneralAmendmentList()
      .subscribe((Res: any) => this.generalAmendmentList = this.allGeneralAmendmentList = Res);
    this.generalAmendmentList.forEach((element) => {
      element.viewLinks = false;
    });
  }

  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.generalAmendmentList.forEach((element) => {
      if (element.billId === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.generalAmendmentList.forEach((element) => {
      if (element.billId === id) {
        element.viewLinks = false;
      }
    });
  }

  viewAmendmentList(billId) {
    this.router.navigate([
      'business-dashboard/bill/general-amendment-list',
      billId
    ]);
  }


}
