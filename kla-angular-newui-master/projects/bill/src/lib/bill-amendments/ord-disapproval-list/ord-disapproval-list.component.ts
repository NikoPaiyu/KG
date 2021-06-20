import { Component, OnInit } from '@angular/core';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { Router, ActivatedRoute } from "@angular/router";
import { BillAmendmentsService } from '../shared/bill-amendments.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-ord-disapproval-list',
  templateUrl: './ord-disapproval-list.component.html',
  styleUrls: ['./ord-disapproval-list.component.scss'],
  providers: [DatePipe]
})
export class OrdDisapprovalListComponent implements OnInit {

  showCreateBill = false;

  billData;
  amendmentList: any = [];
  allAmendmentList: any = [];

  isVisible = false;
  content = '';
  billnumber;
  schedulDtoForm;
  ordinanceDate;
  ord_date;
  currentdate;
  // paginationParams: any = {
  //   numberOfItem: 10,
  //   total: 0,
  //   pageIndex: 1,
  // };
  billId = 0;
  Billtitle;
  title;
  billDetails;
  billnames;
  ballotflag;

  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};

  colCheckboxes = [
    { id: 0, label: "Notice Number", check: true, disable: false },
    { id: 1, label: "Minister Name", check: true, disable: false },
    { id: 2, label: "Submiited Date", check: true, disable: false },
    { id: 3, label: "Ballot Priority", check: true, disable: false },
  ];
  constructor(private billService: BillManagementService, private route: ActivatedRoute,
    private billAmendmentsService: BillAmendmentsService, private router: Router,
    private datePipe: DatePipe) {
    //   this._setFilter();
  }
  ngOnInit() {
        
    if (this.route.snapshot.params.id) {
      // this.billId = this.route.snapshot.params.id;
      this.billId = parseInt(this.route.snapshot.params.id, 10);
      this.title = this.route.snapshot.params.title;
      this.getBill(this.billId);
    }
    this.getamendments();
    this.currentdate=new Date;

  }

  getBill(billId) {
    this.billAmendmentsService.getOrdByBillId(this.billId).subscribe(((Res: any) => {
      // console.log(Res);
      this.billData = Res.bill;
      this.schedulDtoForm=Res.schedulDtoForm;
      this.billnumber = this.billData.billNumber;
      this.amendmentList = this.allAmendmentList = Res.objectionToIntroDtoList;
      this.content = Res.objectionToIntroDtoList.content;
      this.ballotflag = Res.balloted;
      this.Billtitle = this.billData.title;
      if(this.schedulDtoForm!=null){
        this.ordinanceDate=this.schedulDtoForm.ordinanceDisapprovalMotion;
        this.ord_date=this.datePipe.transform(this.ordinanceDate, 'yyyy-MM-dd').toString();
        this.currentdate=this.datePipe.transform(this.currentdate, 'yyyy-MM-dd').toString();

      }
      
      //  console.log(this.ballotflag)
    }));
    this.amendmentList.forEach((element) => {
      element.viewLinks = false;
    });
  }
  getamendments() {
    this.billAmendmentsService.getord_disapprovaldata().subscribe((res) => {
      this.billnames = res;

    });
  }
  reloadPage() {
    this.amendmentList = [];
    this.getBill(this.billId);
    this.router.navigate([
      'business-dashboard/bill/ordinance-disapproval-list',
      this.billId
    ]);
  }


  selected_bill(billId) {

    if (this.billId) {
      this.getBill(billId)
    }
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Notice Number", key: "no" },
      { label: "Minister Name", key: "minister_name" },
      { label: "Submiited Date", key: 'subdate' },
      { label: "Ballot priority", key: "ballot_priority" },
      // { label: "Status", key: "status" },
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
          case "noticeNumber":
            this.allAmendmentList.forEach((value) => {
              element.data.push(value.noticeNumber);
            });
            break;
          case "memberName":
            this.allAmendmentList.forEach((value) => {
              element.data.push(value.memberName);
            });
            break;
          case "createdDate":
            this.allAmendmentList.forEach((value) => {
              element.data.push(value.createdDate);
            });
            break;

          case "ballotPriority":
            this.allAmendmentList.forEach((value) => {
              element.data.push(value.ballotPriority);
            });
            break;

          // case "status":
          //   this.allAmendmentList.forEach((value) => {
          //     element.data.push(value.status);
          //   });
          //   break;

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
  //search
  searchBill() {
    this.amendmentList = this.allAmendmentList;
    if (this.searchParam) {
      this.amendmentList = this.allAmendmentList.filter(
        (element) =>
          (element.noticeNumber &&
            element.noticeNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.memberName &&
            element.memberName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.createdDate &&
            element.createdDate
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );

    } else {
      this.amendmentList = this.allAmendmentList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.amendmentList = this.allAmendmentList;
    } else {
      this.amendmentList = this.allAmendmentList.filter((item: any) =>
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
    this.allAmendmentList.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allAmendmentList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.allAmendmentList.every(
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
    const data = this.allAmendmentList.filter((item) => item);
    if (sort.key && sort.value) {
      this.amendmentList = data.sort((a, b) =>
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
      this.amendmentList = data;
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


  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.amendmentList.forEach((element) => {

      if (element.billId === id) {
        element.viewLinks = true;
      }
      else {
        element.viewLinks = false;
      }
    });
  }
  hideLinks(id) {
    this.amendmentList.forEach((element) => {
      if (element.billId === id) {
        element.viewLinks = false;
      }
    });
  }
  view_content(content) {
    if (content) {
      this.isVisible = true;
      this.content = content;
    }

  }
  handleCancel() {
    this.isVisible = false;
  }
  onCancelPopup() {
    this.filtrParams.showPriorityPopup = false;

  }
  // start add to priority list functions
  addToPriorityList() {
    this.filtrParams.showPriorityPopup = true;
  }
  //balloting
  balloting() {
    this.router.navigate([
      'business-dashboard/bill/perform-balloting', this.billId], {
      state: {
        code: 'ORDINANCE_DISAPPROVAL',
        name: 'ordinance disapproval'
      }
    });


  }
  goToPrevpage() {
    this.router.navigate([
      'business-dashboard/bill/ordinance-disapproval']);
  }

}
