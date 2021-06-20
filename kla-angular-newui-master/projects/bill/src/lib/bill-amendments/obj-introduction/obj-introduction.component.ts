import { Component, OnInit } from '@angular/core';
import {BillManagementService} from '../../shared/services/bill-management.service'
import { BillAmendmentsService } from '../shared/bill-amendments.service';
import { Router,ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-obj-introduction',
  templateUrl: './obj-introduction.component.html',
  styleUrls: ['./obj-introduction.component.scss']
})
export class ObjIntroductionComponent implements OnInit {

  showCreateBill = false;
  billList: any = [];
  allbillList: any = [];
  obj_introductionreport:any=[];
  billData: any;
  // paginationParams: any = {
  //   numberOfItem: 10,
  //   total: 0,
  //   pageIndex: 1,
  // };
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  priorityList = {
    assembly: null,
    session: null,
    categoryTitle: null,
  };
  
  colCheckboxes = [
    { id: 0, label: "No", check: true, disable: false },
    { id: 1, label: "Title Of Bill", check: true, disable: false },
    { id: 2, label: "Type Of Bill", check: true, disable: false },
    { id: 3, label: "Hon'ble Minister", check: true, disable: false },
    { id: 4, label: "Member Name", check: true, disable: false },
    {id: 5, label: " Submitted date", check: true, disable: false},
    { id: 6, label: "Status", check: true, disable: false }, 
  ];
  constructor(private billService : BillManagementService, 
    private billAmendmentsService:BillAmendmentsService,
    private router: Router) {
    this._setFilter();
  }
  ngOnInit() {
   // this.getBillsList();
    this.getamendments();
  }
//to load all the amendments in obj-to-intro
  getamendments() {
    this.billAmendmentsService.getobj_introduction().subscribe((Res: any) => this.billList = 
    this.allbillList = Res)
      this.billList.forEach((element) => {
        element.viewLinks = false;
      });
      //this.formatbillResponse();
   
  }

  view_List(billId){
    this.router.navigate([
      "business-dashboard/bill/obj-introduction-list",
     billId
    ]);

  }

   showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.billList.forEach((element) => {
      if (element.billId === id) {
        element.viewLinks = true;
      }
      else{
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
  // pageSizeChange(numberOfItem) {
  //   this.paginationParams.pageIndex = 1;
  //   this.paginationParams.numberOfItem = numberOfItem;
  //   this.billList = this.allbillList.slice(
  //     0,
  //     this.paginationParams.numberOfItem
  //   );
  // }
  // pageIndexChange(index) {
  //   this.paginationParams.pageIndex = index;
  //   this.loadNext(this.paginationParams.pageIndex);
  // }
  // loadNext(index) {
  //   const newIndex = index * 10;
  //   this.billList = this.allbillList.slice(
  //     newIndex,
  //     newIndex + this.paginationParams.numberOfItem
  //   );
  // }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label:"No",key:"no"},
      { label: "Title Of Bill", key: "title" },
      { label: "Type Of Bill", key: "typeName" },
      { label: "Hon'ble Minister", key: "ministerName" },
      { label: "Member name", key: "memberName" },
      { label: "Submitted date", key: "submitted_date" },
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
          case "billNumber":
            this.allbillList.forEach((value) => {
              element.data.push(value.no);
            });
            break;
          case "billTitle":
            this.allbillList.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case "billType":
            this.allbillList.forEach((value) => {
              element.data.push(value.typeName);
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
            case "submittedDate":
              this.allbillList.forEach((value) => {
                element.data.push(value.submitted_date);
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
  searchBill() {
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
          (element.memberName &&
            element.memberName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
              (element.submittedDate &&
                element.submittedDate
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

 
  onCancelPopup() {
    this.filtrParams.showPriorityPopup = false;
  
  }
  // start add to priority list functions
  addToPriorityList() {
    this.filtrParams.showPriorityPopup = true;
  }
  onOKPriorityList() {
    if (
      this.priorityList.assembly == null ||
      this.priorityList.session == null ||
      this.priorityList.categoryTitle == null
    ) {
      return;
    }
    this.filtrParams.showPriorityPopup = false;
   
  }
}
