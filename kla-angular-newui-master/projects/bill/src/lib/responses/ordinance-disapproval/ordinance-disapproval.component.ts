import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-ordinance-disapproval',
  templateUrl: './ordinance-disapproval.component.html',
  styleUrls: ['./ordinance-disapproval.component.css']
})
export class OrdinanceDisapprovalComponent implements OnInit {
  billList: any = [];
  allbillList: any = [];
  paginationParams: any = {
    numberOfItem: 10,
    total: 0,
    pageIndex: 1,
  };
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "billNo", check: true, disable: false },
    { id: 2, label: "billTitle", check: true, disable: false },
    { id: 3, label: "billType", check: true, disable: false },
    { id: 4, label: "ministerName", check: true, disable: false },
    { id: 5, label: "memberName", check: true, disable: false },
    { id: 6, label: "subDate", check: true, disable: false },
    { id: 7, label: "status", check: true, disable: false }, 
  ];
  constructor() {
  }
  ngOnInit() {
    this._setFilter();
    this.getData();
  }
  pageSizeChange(numberOfItem) {
    this.paginationParams.pageIndex = 1;
    this.paginationParams.numberOfItem = numberOfItem;
    this.billList = this.allbillList.slice(
      0,
      this.paginationParams.numberOfItem
    );
  }
  pageIndexChange(index) {
    this.paginationParams.pageIndex = index;
    this.loadNext(this.paginationParams.pageIndex);
  }
  loadNext(index) {
    const newIndex = index * 10;
    this.billList = this.allbillList.slice(
      newIndex,
      newIndex + this.paginationParams.numberOfItem
    );
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Bill No", key: "billNo" },
      { label: "Title Of Bill", key: "billTitle" },
      { label: "Type Of Bill", key: "billType" },
      { label: "Hon'ble Minister", key: "ministerName" },
      { label: "Member Name", key: "memberName" },
      { label: "Submitted Date", key: "subDate" },
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
    this.filtrParams.colFilter = false;
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  showFilter(type) {
    // this.filtrParams.colFilter = type === "column" ? true : false;
    this.filtrParams.rowFilter = type === "row" ? true : false;
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
          case "billNo":
            this.allbillList.forEach((value) => {
              element.data.push(value.billNo);
            });
            break; 
          case "billTitle":
            this.allbillList.forEach((value) => {
              element.data.push(value.billTitle);
            });
            break;
          case "billType":
            this.allbillList.forEach((value) => {
              element.data.push(value.billType);
            });
            break;
          case "ministerName":
            this.allbillList.forEach((value) => {
              element.data.push(value.ministerName);
            });
            break;
          case "memberName":
            this.allbillList.forEach((value) => {
              element.data.push(value.memberName);
            });
            break;
          case "subDate":
              this.allbillList.forEach((value) => {
                element.data.push(value.subDate);
              });
              break;  
          case "status":
            this.allbillList.forEach((value) => {
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
    this.billList = this.allbillList;
    if (this.searchParam) {
      this.billList = this.allbillList.filter(
        (element) =>
          (element.billNo &&
            element.billNo
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
          (element.ministerName &&
            element.ministerName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.memberName &&
            element.memberName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
              (element.subDate &&
                element.subDate
                  .toLowerCase()
                  .includes(this.searchParam.toLowerCase())) ||    
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.billList = this.allbillList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.billList = this.allbillList;
    } else {
      this.billList = this.allbillList.filter((item: any) =>
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
    this.allbillList.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    if (list) {
      list.viewLinks = false;
      if (this.mapOfCheckedId[list.id]) {
        list.viewLinks = true;
      }
    }
    this.checkbxParams.numberOfChecked = this.allbillList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.allbillList.every(
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
    const data = this.allbillList.filter((item) => item);
    if (sort.key && sort.value) {
      this.billList = data.sort((a, b) =>
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
      this.billList = data;
    }
  }
  getData() {
     // this.service
      //   .getOrdinanceDisapprovalList()
      //   .subscribe((bills) => {
      //     if (bills) {
      //       this.listOfData = bills;
      //      this.billList = this.allbillList = bills;
           // this.paginationParams.total = this.billList.length;
      //     }
      //   });
    let bills=[
         {
           "id":'1',
           "billNo":"332",
           "billTitle":"The Kerala State Goods and Services Tax (Amendment) Bill, 2020",
           "billType":"Amendment",
           "ministerName":"K RAju",
           "memberName":"C diavkaran",
           "subDate":"01/08/2020",
           "status":"SAVED",
           viewLinks: false,
         },
         {
          "id":'2',
          "billNo":"333",
          "billTitle":"The Kerala Private Forests (Vesting and Assignment) (Amendment) Bill, 2020",
          "billType":"Ordiannce",
          "ministerName":"Oommen chandy",
          "memberName":"AK Saseendran",
          "subDate":"12/10/2020",
          "status":"SUBMITTED",
          viewLinks: false,
        },
        {
          "id":'3',
          "billNo":"334",
          "billTitle":"The Kerala Panchayat Raj (Amendment) BIll, 2020",
          "billType":"Amendment",
          "ministerName":"Pinarayi Vijayan",
          "memberName":"KM Shaji",
          "subDate":"10/04/2020",
          "status":"SAVED",
          viewLinks: false,
        },
        {
          "id":'4',
          "billNo":"335",
          "billTitle":"The Kerala Private Forests (Vesting and Assignment) (Amendment) Bill, 2020",
          "billType":"Ordiannce",
          "ministerName":"Oommen chandy",
          "memberName":"AK Saseendran",
          "subDate":"12/10/2020",
          "status":"SUBMITTED",
          viewLinks: false,
        },
       
    ];
    this.billList = this.allbillList = bills;
    this.paginationParams.total = this.billList.length;
  }
  showLinks(id){
    this.billList.forEach(element => {
      if(element.id === id){
        element.viewLinks=!element.viewLinks;
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
  // checkColumnDisable() {
  //   if(this.showSection) {
  //     this.colCheckboxes = [
  //       { id: 1, label: "Session", check: false, disable: true },
  //       { id: 2, label: "Assembly", check: false, disable: true },
  //       { id: 3, label: "Date", check: true, disable: false },
  //       { id: 4, label: "FileNo", check: true, disable: false },
  //       { id: 5, label: "Status", check: true, disable: false }, 
  //     ];
  //   }
  //   if(this.showDept) {
  //     this.colCheckboxes = [
  //       { id: 1, label: "Session", check: true, disable: false },
  //       { id: 2, label: "Assembly", check: true, disable:false },
  //       { id: 3, label: "Date", check: false, disable: true },
  //       { id: 4, label: "FileNo", check: false, disable: true },
  //       { id: 5, label: "Status", check: true, disable: false }, 
  //     ];
  //   }
  // }
}
