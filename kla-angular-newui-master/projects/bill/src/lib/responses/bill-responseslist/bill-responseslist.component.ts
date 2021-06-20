import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import {BillManagementService} from '../../shared/services/bill-management.service';

@Component({
  selector: "bill-processing-bill-responseslist",
  templateUrl: "./bill-responseslist.component.html",
  styleUrls: ["./bill-responseslist.component.css"],
})
export class BillResponseslistComponent implements OnInit {
  searchClause = null;
  searchObjection=null;
  searchOrdinance=null;
  searchAmendment=null;
  isVisible= false;
  content ='';
  amendmentDetails;
  tempAmendmentDetails;
  ordDisapprovalList:any =[];
  tempordDisapprovalList:any=[];
  ordIntroductionList:any =[];
  tempordIntroductionList:any =[];
  clauseList:any =[];
  tempclauseList:any=[];
  
  billId: any;
  billList;
  amendmentList: any = [];
  allAmendmentList: any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = '';
  mapOfCheckedId: { [key: string]: boolean } = {};
  // general amendments
  colCheckboxes = [
    { id: 0, label: 'title', check: true, disable: false },
    { id: 1, label: 'type', check: true, disable: false },
    { id: 2, label: 'Minister', check: true, disable: false },
    { id: 3, label: 'publicopinion', check: true, disable: false },
    { id: 4, label: 'committee', check: true, disable: false },
    { id: 5, label: 'amendmentover', check: true, disable: false },
    { id: 6, label: 'status', check: true, disable: false },
    { id: 7, label: 'dept', check: false, disable: false },
    { id: 8, label: 'subj', check: false, disable: false }
  ];
  //ordinance disapproval
  colCheckboxes2= [
    { id: 0, label: "billNo", check: true, disable: false },
    { id: 1, label: "billTitle", check: true, disable: false },
    { id: 2, label: "billType", check: true, disable: false },
    { id: 3, label: "ministerName", check: true, disable: false },
    { id: 4, label: "subDate", check: true, disable: false }, 
    { id: 5, label: "status", check: true, disable: false },
    { id: 6, label: "dept", check: false, disable: false },
    { id: 7, label: "subj", check: false, disable: false }
  ];
  //objection to introduction
  colCheckboxes3=[
    { id: 0, label: 'no', check: true, disable: false },
    { id: 1, label: 'billTitle', check: true, disable: false },
    { id: 2, label: 'billType', check: true, disable: false },
    { id: 3, label: 'ministerName', check: true, disable: false },
    { id: 4, label: 'department', check: false, disable: false },
    { id: 5, label: 'subject', check: false, disable: false },
    { id: 6, label: 'createdDate', check: true, disable: false },
    { id: 7, label: 'status', check: true, disable: false }
  ];
  colCheckboxes4=[
    { id: 0, label: 'no', check: true, disable: false },
    { id: 1, label: 'billTitle', check: true, disable: false },
    { id: 2, label: 'billType', check: true, disable: false },
    { id: 3, label: 'ministerName', check: true, disable: false },
    { id: 4, label: 'noofAmendments', check: true, disable: false },
    { id: 5, label: 'subdate', check: true, disable: false },
    { id: 6, label: 'status', check: true, disable: false }
  ];
  billData: any;
  user:any;
  constructor(   private billService: BillManagementService,
    @Inject('authService') private AuthService,
    private router:Router,
    private route:ActivatedRoute) {
      this.user = AuthService.getCurrentUser();
    }

  ngOnInit() {
   // this.tempAmendmentDetails = this.amendmentDetails;
   this.getOrdDisApprovalList() ;
    this.getGeneralAmendments();
  //  this.getOrdinanceDisapproval();
    // this.getObjectionTointro();
    this.getObjToIntroductionList()
    this.getClauseByClauseList();
  }
//load general amendments
  getGeneralAmendments() {
    // this.billService.getAmendmentListByBillId(this.billId).subscribe(((Res: any) => {
    //   this.billData = Res.bill;
    //   this.amendmentList = this.allAmendmentList = Res.amendmentResponseList;
    // }));
    // this.amendmentList.forEach((element) => {
    //   element.viewLinks = false;
    // });
    this.billService.getGenAmendmentList().subscribe((Res) => {
        this.amendmentList = this.allAmendmentList = Res;
        console.log(this.amendmentList);
    });
  }
  //load ordinance disapproval
  getOrdinanceDisapproval(){

  }
  //load objection to introduction
  getObjectionTointro(){
    
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: 'Name of Member', key: 'memberName' },
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
  sortLists(sortkey,listType){
    if(listType == 'OBJ'){
      this.ordIntroductionList = this.sort(sortkey,this.tempordIntroductionList,this.ordIntroductionList);
    }
    else if(listType == 'GEN_AMEND'){
      this.amendmentList = this.sort(sortkey,this.allAmendmentList, this.amendmentList);
    }
    else if(listType == 'ORDINANCE'){
      this.ordDisapprovalList = this.sort(sortkey,this.tempordDisapprovalList, this.ordDisapprovalList);
    }
    else if(listType == 'CLAUSE'){
      this.clauseList = this.sort(sortkey,this.tempclauseList, this.clauseList);
    }
  }
  sort(sort: { key: string; value: string },allList,list): void {
    const data = allList.filter((item) => item);
    if (sort.key && sort.value) {
      list = data.sort((a, b) =>
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
      list = data;
    }
    return list;
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
  showLink(id) {
    this.clauseList.forEach((element) => {
      if (element.billId === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  viewClause(id) {
    this.router.navigate(['business-dashboard/bill/create-clause-by-clause', id,'view']);
  }
  hideLinks(id) {
    this.clauseList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  onCurrentPageDataChange(event) {}

  //function to get data for all table
  getData() {}

  //search function for all table
  search(event) {
    if (event.target.value) {
      this.amendmentDetails = this.tempAmendmentDetails.filter(
        (element) =>
          element.no.toLowerCase().includes(event.target.value.toLowerCase()) ||
          element.title
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          element.type
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          element.minister
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          element.amendments
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          element.date
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) ||
          element.status
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
      );
    } else {
      this.amendmentDetails = this.tempAmendmentDetails;
    }
  }
getOrdDisApprovalList() {
  this.billService.getOrdDisApprovalList().subscribe((res)=>{
    this.ordDisapprovalList=this.tempordDisapprovalList = res;
    console.log(this.ordDisapprovalList);
  })
}
getObjToIntroductionList() {
  this.billService.getObjToIntroductionList().subscribe((res)=>{
    this.ordIntroductionList= res;
    this.ordIntroductionList.forEach(obj => {
      if(obj.status == "LOB_PENDING" || obj.status == "LOB_APPROVED" ){
        obj.status = "APPROVED";
      }
    });
    this.tempordIntroductionList = this.ordIntroductionList;
    console.log(this.ordIntroductionList);
  })
}
getContent(motionContent) {
  if(motionContent){
    debugger;
    this.isVisible = true;
this.content = motionContent;

  }
}
handleCancel(){
  this.isVisible = false;
  this.content='';
}
searchAmendmentList() {
if(this.searchAmendment) {
  this.amendmentList  = this.allAmendmentList.filter(
    (element) =>
    // (element.currentNumber &&
    //   element.currentNumber
    //     .toLowerCase()
    //     .includes(this.searchText.toLowerCase())) ||
      (element.type&&
        element.type
        .toLowerCase()
        .includes(this.searchAmendment.toLowerCase())) ||
        (element.title&&
      element.title
        .toLowerCase()
        .includes(this.searchAmendment.toLowerCase())) ||
        (element.minister&&
      element.minister
        .toLowerCase()
        .includes(this.searchAmendment.toLowerCase())) ||
        (element.motionCommitteeType&&
        element.motionCommitteeType
        .toLowerCase()
        .includes(this.searchAmendment.toLowerCase())) ||
        (element.amendmentOver&&
        element.amendmentOver
        .toLowerCase()
        .includes(this.searchAmendment.toLowerCase())) 
  //       (element.status&&
  //       element.delayStatus
  //       .toLowerCase()
  //       .includes(this.searchText.toLowerCase())) ||
  //       (element.status&&
  //     element.status.toLowerCase().includes(this.searchText.toLowerCase()))
   );
} else {
  this.amendmentList = this.allAmendmentList;
}
}
searchOrdinanceList(){
  if(this.searchOrdinance) {
    this.ordDisapprovalList  = this.tempordDisapprovalList.filter(
      (element) =>
      // (element.currentNumber &&
      //   element.currentNumber
      //     .toLowerCase()
      //     .includes(this.searchText.toLowerCase())) ||
        (element.type&&
          element.type
          .toLowerCase()
          .includes(this.searchOrdinance.toLowerCase())) ||
          (element.title&&
        element.title
          .toLowerCase()
          .includes(this.searchOrdinance.toLowerCase())) ||
          (element.minister&&
        element.minister
          .toLowerCase()
          .includes(this.searchOrdinance.toLowerCase())) ||
          (element.createdDate&&
          element.createdDate
          .toLowerCase()
          .includes(this.searchOrdinance.toLowerCase())) 
          // (element.amendmentOver&&
          // element.amendmentOver
          // .toLowerCase()
          // .includes(this.searchAmendmet.toLowerCase())) 
    //       (element.status&&
    //       element.delayStatus
    //       .toLowerCase()
    //       .includes(this.searchText.toLowerCase())) ||
    //       (element.status&&
    //     element.status.toLowerCase().includes(this.searchText.toLowerCase()))
     );
  } else {
    this.ordDisapprovalList = this.tempordDisapprovalList;
  }
}
searchObjectionList() {
  if(this.searchObjection) {
    this.ordIntroductionList = this.tempordIntroductionList.filter(
      (element) =>
      // (element.currentNumber &&
      //   element.currentNumber
      //     .toLowerCase()
      //     .includes(this.searchText.toLowerCase())) ||
        (element.type&&
          element.type
          .toLowerCase()
          .includes(this.searchObjection.toLowerCase())) ||
          (element.title&&
        element.title
          .toLowerCase()
          .includes(this.searchObjection.toLowerCase())) ||
          (element.minister&&
        element.minister
          .toLowerCase()
          .includes(this.searchObjection.toLowerCase())) ||
          (element.createdDate&&
          element.createdDate
          .toLowerCase()
          .includes(this.searchObjection.toLowerCase()))
          );
        } else {
          this.ordIntroductionList = this.tempordIntroductionList;
        }
}
searchClauseList(){
  if(this.searchClause) {
    this.clauseList = this.tempclauseList.filter(
      (element) =>
      // (element.currentNumber &&
      //   element.currentNumber
      //     .toLowerCase()
      //     .includes(this.searchText.toLowerCase())) ||
        (element.type&&
          element.type
          .toLowerCase()
          .includes(this.searchClause.toLowerCase())) ||
          (element.title&&
        element.title
          .toLowerCase()
          .includes(this.searchClause.toLowerCase())) ||
          (element.minister&&
        element.minister
          .toLowerCase()
          .includes(this.searchClause.toLowerCase())) ||
          (element.createdDate&&
          element.createdDate
          .toLowerCase()
          .includes(this.searchClause.toLowerCase()))
          );
        } else {
          this.clauseList = this.tempclauseList;
        }
}
getClauseByClauseList() {
  const billid=null;
  this.billService.getClauseByClauseList().subscribe((res)=>{
    this.clauseList=this.tempclauseList = res;
    console.log(this.clauseList);
  })
}
}
