import { Component, OnInit } from '@angular/core';
import {BillManagementService} from '../../shared/services/bill-management.service';
import { Router,ActivatedRoute} from "@angular/router";
import { BillAmendmentsService } from '../shared/bill-amendments.service';

@Component({
  selector: 'lib-obj-introduction-list',
  templateUrl: './obj-introduction-list.component.html',
  styleUrls: ['./obj-introduction-list.component.scss']
})
export class ObjIntroductionListComponent implements OnInit {

  
  showCreateBill = false;
  billList: any = [];
  allbillList: any = [];
  billnames:any=[];
  billData;
  amendmentList: any = [];
  allAmendmentList: any = [];
  // paginationParams: any = {
  //   numberOfItem: 10,
  //   total: 0,
  //   pageIndex: 1,
  billId = 0;
  title;
  billDetails;
  // };
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};

  colCheckboxes = [
    { id: 0, label: "No", check: true, disable: false },
    { id: 1, label: "Bill No", check: true, disable: false },
    { id: 2, label: "Minister Name", check: true, disable: false },
    { id: 3, label: "Submiited Date", check: true, disable: false },
    { id: 4, label: "Ballot Priority", check: true, disable: false },
    { id: 5, label: "Status", check: true, disable: false }];
  constructor(private billService : BillManagementService, private route: ActivatedRoute,
   private billAmendmentsService:BillAmendmentsService,private router: Router,) {
    this._setFilter();
  }
  ngOnInit() {
//    this.getBillsList();
    if (this.route.snapshot.params.id) {
      //this.billId = this.route.snapshot.params.id;
      this.billId=parseInt(this.route.snapshot.params.id,10)
      this.title=this.route.snapshot.params.title
      this.getBill(this.billId);
       }
       this.getamendments();
  }

  getBill(billId) {
    this.billAmendmentsService.getBillByBillId(this.billId).subscribe(((Res: any) => {
     // console.log(Res);
      this.billData = Res.bill;
      this.amendmentList = this.allAmendmentList = Res.objectionToIntroDtoList;
    
    }));
    this.amendmentList.forEach((element) => {
      element.viewLinks = false;
    });
  }
  getamendments() {
    this.billAmendmentsService.getobj_introduction().subscribe((res) => {
      this.billnames = res;
     
    });
  }
  selected_bill(billId){
    // console.log(billId)
    if(this.billId){
      this.getBill(billId)
    }


    
  }
  reloadPage(){
    this.amendmentList = [];
    this.getBill(this.billId);
    this.router.navigate([
      'business-dashboard/bill/obj-introduction-list',this.billId
    ]);
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
      { label: "Bill No", key: "bill_no" },
      { label: "Minister Name", key: "minister_name" },
      { label: "Ballot priority", key: "ballot_priority" },
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
          case "no":
            this.allbillList.forEach((value) => {
              element.data.push(value.no);
            });
            break;
          case "bill_no":
            this.allbillList.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case "minister_name":
            this.allbillList.forEach((value) => {
              element.data.push(value.typeName);
            });
            break;
      
          case "ballot_priority":
            this.allbillList.forEach((value) => {
              element.data.push(value.ministerName);
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
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.language &&
            element.language
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.ministerName &&
            element.ministerName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.departmentName &&
            element.departmentName
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

  // getBillsList() {
  //   // this.billService.getAllBills()
  //   // .subscribe((arg: any) => this.billList = this.allbillList = arg);
  //   this.billList = this.allbillList = [
  //     {
  //       id: "1",
  //       no:"321",
  //       bill_No:"122",
  //       ballot_priority:"01",
  //       title: "The kerala private forests",
  //       typeName: "Amendment bill",
  //       language: "Malayalam",
  //       ministerName: "K K Shylaja Teacher",
  //       departmentName: "4",
  //       memberName:"Membername",
  //       status: "SAVED",
  //       submitted_date:"12/2/2019",
  //       viewLinks: false,
  //     },
  //     {
  //       id: "2",
  //       no:"322",
  //       bill_No:"122",
  //       ballot_priority:"01",
  //       title: "The kerala private forests",
  //       typeName: "Ordinance bill",
  //       language: "English",
  //       ministerName: "A K Saseendran",
  //       departmentName: "4",
  //       memberName:"Membername",
  //       status: "SUBMITTED",
  //       submitted_date:"12/2/2019",
  //       viewLinks: false,
  //     },
  //     {
  //       id: "3",
  //       no:"323",
  //       bill_No:"122",
  //       title: "The kerala private forests",
  //       ballot_priority:"01",
  //       typeName: "Ordinance bill",
  //       language: "English",
  //       ministerName: "M K Muneer",
  //       departmentName: "4",
  //       memberName:"Membername",
  //       status: "SAVED",
  //       submitted_date:"12/2/2019",
  //       viewLinks: false,
  //     },
  //     {
  //       id: "4",
  //       no:"333",
  //       bill_No:"122",
  //       ballot_priority:"01",
  //       title: "The kerala private forests",
  //       typeName: "Amendment bill ",
  //       language: "Malayalam",
  //       ministerName: "Pinarayi Vijayan",
  //       departmentName: "4",
  //       memberName:"Membername",
  //       status: "SUBMITTED",
  //       submitted_date:"12/2/2019",
  //       viewLinks: false,
  //     },
      
  //   ];
  //   // this.paginationParams.total = this.billList.length;
  // }
  showLinks(id) {
    this.billList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = !element.viewLinks;
      }
    });
  }
  onCancelPopup() {
    this.filtrParams.showPriorityPopup = false;
  
  }
  // start add to priority list functions
  addToPriorityList() {
    this.filtrParams.showPriorityPopup = true;
  }
  
    
 
  }
 

