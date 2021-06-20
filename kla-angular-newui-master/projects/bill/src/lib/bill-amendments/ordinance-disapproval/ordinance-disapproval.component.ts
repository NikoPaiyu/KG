import { Component, OnInit } from '@angular/core';
import { BillAmendmentsService } from '../shared/bill-amendments.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'lib-ordinance-disapproval',
  templateUrl: './ordinance-disapproval.component.html',
  styleUrls: ['./ordinance-disapproval.component.css']
})
export class OrdinanceDisapprovalComponent implements OnInit {
  billList: any = [];
  allbillList: any = [];
  
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 0, label: "Bill No", check: true, disable: false },
    { id: 1, label: "Title Of Bill", check: true, disable: false },
    { id: 2, label: "Type Of Bill", check: true, disable: false },
    { id: 3, label: "Hon'ble Minister", check: true, disable: false },
    { id: 4, label: "File No", check: true, disable: false },
    { id: 5, label: "Number Of Amendments", check: true, disable: false },
  ];
  constructor(private billAmendmentsService: BillAmendmentsService,
     private router: Router) {
    this._setFilter();
  }

  ngOnInit() {
    this.getordinancedisappList();
  }
  //to load all the ordinance dissaproval list
  getordinancedisappList() {
    this.billAmendmentsService.getord_disapprovaldata().subscribe((Res: any) => this.billList =this.allbillList = Res);
    this.billList.forEach((element) => {
      element.viewLinks = false;
    });
  }
 

  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.billList.forEach((element) => {

      if (element.billId === id) {
        element.viewLinks = true;
      }
      else {
        element.viewLinks = false;
      }
    });
  }
  hideLinks(id) {
    this.billList.forEach((element) => {
      if (element.billId === id) {
        element.viewLinks = false;
      }
    });
  }

  view_List(billId) {
    this.router.navigate([
      "business-dashboard/bill/ordinance-disapproval-list",
      billId
    ]);

  }

   _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Bill No", key: "billNumber" },
      { label: "Title Of Bill", key: "billTitle" },
      { label: "Type Of Bill", key: "billType" },
      { label: "Hon'ble Minister", key: "ministerName" },
      { label: "File No", key: "fileNumber" },
      { label: "No Of Amendments", key: "numberOfNotices" },
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
  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
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
          case "billNumber":
            this.allbillList.forEach((value) => {
              element.data.push(value.billNumber);
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
          case "fileNumber":
            this.allbillList.forEach((value) => {
              element.data.push(value.fileNumber);
            });
            break;
          case "numberOfNotices":
            this.allbillList.forEach((value) => {
              element.data.push(value.numberOfNotices);
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
          (element.ministerName &&
            element.ministerName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.fileNumber &&
            element.fileNumber
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

  // showLinks(id){
  //   this.billList.forEach(element => {
  //     if(element.id === id){
  //       element.viewLinks=!element.viewLinks;
  //     }
  //   });
  // }
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


}
