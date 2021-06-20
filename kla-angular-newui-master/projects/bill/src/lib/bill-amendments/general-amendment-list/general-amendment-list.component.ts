import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { BillAmendmentsService } from '../shared/bill-amendments.service';
import { Router } from '@angular/router';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'lib-general-amendment-list',
  templateUrl: './general-amendment-list.component.html',
  styleUrls: ['./general-amendment-list.component.scss'],
  providers: [DatePipe]
})
export class GeneralAmendmentListComponent implements OnInit {
  billId = 0;
  billNo;
  ballotflag;
  amendmentList: any = [];
  allAmendmentList: any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = '';
  ballotbody;
  GA1status;
  title;
  selectValue;
  billnumber;
  Billtitle;
  schedulDtoForm;

  isVisible = false;
  content = '';
  billdetails;
  committeeType;
  contentdata = '';
  viewcontent = false;
  ga1date;
  ga2date;
  generalAmendmentI;
  generalAmendmentII;

  rbsPermission = {
    create: false,
    update: false,
    addResponse: false,
    objectionToIntro: false,
    generalAmendment: false,
    ordinanceDisapproval: false,
    reSubmitFile: false,
    balloting: false,
    view_balloting: false
  };

  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 0, label: 'Notice Number', check: true, disable: false },
    { id: 1, label: 'Name of Member', check: true, disable: false },
    { id: 2, label: 'Submitted Date', check: true, disable: false },
    { id: 3, label: 'Public Opinion', check: true, disable: false },
    { id: 4, label: 'Committee', check: true, disable: false },
    { id: 5, label: 'Amendment Over', check: true, disable: false },
    { id: 6, label: 'Ballot Priority', check: true, disable: false }

  ];
  billData: any;
  generalAmendmentList: any;
  user;
  currentUser;
  currentdate;

  constructor(private route: ActivatedRoute,
    private billService: BillManagementService,
    private billAmendmentsService: BillAmendmentsService,
    private router: Router,
    private commonService: BillcommonService,
    @Inject("authService") private AuthService,
    private datePipe: DatePipe) {
    this.user = AuthService.getCurrentUser();
    this._setFilter();
    //this.billId = this.route.snapshot.params.id;
    this.billId = parseInt(this.route.snapshot.params.id, 10);
  }

  ngOnInit() {

    if (this.billId) {
      this.getAmendmentListById();
    }
 this.currentdate=new Date;
 

  }

  getAmendmentListById() {
    this.billService.getAmendmentListByBillId(this.billId).subscribe(((Res: any) => {
      this.billData = Res.bill;
      this.billdetails = Res.bill;
      this.schedulDtoForm=Res.schedulDtoForm;
      this.billnumber = this.billdetails.billNumber;
      if (this.billdetails.ministerMotion != null) {
        this.committeeType = this.billdetails.ministerMotion.committeeType;
        this.contentdata = this.billdetails.ministerMotion.content;
      }
      this.amendmentList = this.allAmendmentList = Res.amendmentResponseList;
      this.ballotflag = Res.balloted;
      this.GA1status = Res.generalAmendment2Action;
      this.Billtitle = this.billdetails.title;
      if(this.schedulDtoForm!=null){
        this.generalAmendmentI=this.schedulDtoForm.generalAmendmentI;
        this.generalAmendmentII=this.schedulDtoForm.generalAmendmentII;
        this.ga1date=this.datePipe.transform(this.generalAmendmentI, 'yyyy-MM-dd');
        console.log(this.ga1date)
        this.ga2date=this.datePipe.transform(this.generalAmendmentII, 'yyyy-MM-dd');
        this.currentdate=this.datePipe.transform(this.currentdate, 'yyyy-MM-dd');
        
      }
     

    }));
    
    this.amendmentList.forEach((element) => {
      element.viewLinks = false;
    });
  }
 
 
  getContent() {
    this.viewcontent = true;

  }
  viewNotice() {
    if (this.contentdata) {
      this.isVisible = true;
      this.content = this.contentdata;
    }
  }
  handleCancel() {
    this.isVisible = false;
  }
  hideview() {
    this.viewcontent = false;
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: 'Notice Number', key: 'noticeNumber' },
      { label: 'Name of Member', key: 'memberName' },
      { label: 'Submitted Date', key: 'subdate' },
      { label: 'Public Opinion', key: 'publicOpinion' },
      { label: 'Committee', key: 'committeeType' },
      { label: 'Amendment Over', key: 'amendmentOver' },
      { label: 'Ballot Priority', key: 'ballotPriority' }
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
    this.filtrParams.rowFilter = type === 'row' ? true : false;
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
          case 'memberName':
            this.allAmendmentList.forEach((value) => {
              element.data.push(value.memberName);
            });
            break;
          case 'committeeType':
            this.allAmendmentList.forEach((value) => {
              element.data.push(value.committeeType);
            });
            break;
          case 'amendmentOver':
            this.allAmendmentList.forEach((value) => {
              element.data.push(value.amendmentOver);
            });
            break;
          case 'ballotPriority':
            this.allAmendmentList.forEach((value) => {
              element.data.push(value.ballotPriority);
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
    this.amendmentList = this.allAmendmentList;
    if (this.searchParam) {
      this.amendmentList = this.allAmendmentList.filter(
        (element) =>
          (element.memberName &&
            element.memberName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.committeeType &&
            element.committeeType
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.amendmentOver &&
            element.amendmentOver
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.ballotPriority &&
            element.ballotPriority
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
    this.allAmendmentList.forEach((item) => (this.mapOfCheckedId[item.billId] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allAmendmentList.filter(
      (item) => this.mapOfCheckedId[item.billId]
    ).length;
    this.checkbxParams.allDtCheckd = this.allAmendmentList.every(
      (item) => this.mapOfCheckedId[item.billId]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.amendmentList.forEach((element) => {
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
    const data = this.allAmendmentList.filter((item) => item);
    if (sort.key && sort.value) {
      this.amendmentList = data.sort((a, b) =>
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

  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.amendmentList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.amendmentList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  //balloting for general amendmentI
  balloting() {
    this.router.navigate([
      'business-dashboard/bill/perform-balloting', this.billId
    ], {
      state: {
        code: 'GENERAL_AMENDMENT',
        name: 'Bill'
      }
    });



  }
  //balloting for general amendmentII
  GA2balloting() {
    this.router.navigate([
      'business-dashboard/bill/perform-balloting', this.billId
    ], {
      state: {
        code: 'GENERAL_AMENDMENT_II',
        name: 'Bill'
      }
    });
  }

  getBillsList() {
    this.billService.getGeneralAmendmentList()
      .subscribe((Res: any) => this.generalAmendmentList = Res);

  }

  reloadPage() {
    this.amendmentList = [];
    this.getAmendmentListById();
    this.router.navigate([
      'business-dashboard/bill/general-amendment-list',
      this.billId
    ]);
  }
  goToPrevpage() {
    this.router.navigate([
      'business-dashboard/bill/general-amendment-1'
    ]);
  }

}
