import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillcommonService } from '../../shared/services/billcommon.service';
import { BillAmendmentsService } from '../shared/services/bill-amendments.service';

@Component({
  selector: 'lib-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  searchClause = null;
  searchObjection = null;
  searchSecondAmendment = null;
  searchThirdAmendment = null;
  searchAmendment = null;
  isVisible = false;
  content = '';
  amendmentDetails;
  tempAmendmentDetails;
  secondList: any = [];
  thirdList: any = [];
  tempThirdList: any = [];
  tempSecondList: any = [];
  ordIntroductionList: any = [];
  tempordIntroductionList: any = [];
  clauseList: any = [];
  tempclauseList: any = [];
  mainList: any = {
    ballotList: []
  };
  list: any = [];
  ballotList: any = [];
  billId: any;
  billList;
  amendmentList: any = [];
  allAmendmentList: any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = '';
  mapOfCheckedId: { [key: string]: boolean } = {};
  showBallotList = false;
  showClauseList = false;
  // general amendments
  colCheckboxes = [
    { id: 0, label: 'billNo', check: true, disable: false },
    { id: 1, label: 'title', check: true, disable: false },
    { id: 2, label: 'type', check: true, disable: false },
    { id: 3, label: 'fileNo', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false }
  ];
  // ordinance disapproval
  colCheckboxes2 = [
    { id: 0, label: 'billNo', check: true, disable: false },
    { id: 1, label: 'billTitle', check: true, disable: false },
    { id: 2, label: 'billType', check: true, disable: false },
    { id: 3, label: 'fileNo', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false }
  ];
  // objection to introduction
  colCheckboxes3 = [
    { id: 0, label: 'billno', check: true, disable: false },
    { id: 1, label: 'billTitle', check: true, disable: false },
    { id: 2, label: 'billType', check: true, disable: false },
    { id: 3, label: 'fileNo', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false },
    { id: 5, label:  'view', check: true, disable: false}
  ];
  billData: any;
  list3Data: any = [];
  tempList3: any = [];
  listNumber: any;
  resolutionAmendmentList: any;

  constructor(
    private router: Router,
    public commonService: BillcommonService,
    private billService: BillAmendmentsService,) { }

  ngOnInit() {
    //  this.getObjToList();
    this.getGeneralAmendments();
    this.getSecondList();
    this.getThirdList();
    this.getList3();
  }

  getGeneralAmendments() {
    // let type='GENERAL_AMENDMENT';
    const  body = {
    noticeType : 'GENERAL_AMENDMENT',
    ballotStatus: ['PUBLISHED', 'CIRCULATED'],
    };
    this.billService.getListByNoticeType(body).subscribe((Res) => {
        this.allAmendmentList = Res;
        this.amendmentList =this.allAmendmentList.filter(x=> x.type === 'NORMAL');
        this.resolutionAmendmentList = this.allAmendmentList.filter(x=> x.type === 'PRIVATE_MEMBER_RESOLUTION');
    });
  }
  getSecondList() {
    // let type ='GENERAL_AMENDMENT_II';
    const  body = {
      noticeType : 'GENERAL_AMENDMENT_II',
      ballotStatus: ['PUBLISHED'],
    };
    // this.billService.getSecondList(body).subscribe((res) => {
    //   this.secondList = this.tempSecondList = res;
    // });
  }
  getThirdList() {
    const body = {
      listType: 'LIST_2',
      ballotStatus: ['PUBLISHED'],
    };
    // this.billService.getThirdList(body).subscribe((res) => {
    //   this.thirdList = this.tempThirdList = res;
    //   console.log('third list', this.thirdList);
    // });
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
    this.resolutionAmendmentList.forEach((element) => {
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
  showSecondLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.secondList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  searchAmendmentList() {
    if (this.searchAmendment) {
      this.amendmentList  = this.allAmendmentList.filter(
        (element) =>
          (element.type &&
            element.type
            .toLowerCase()
            .includes(this.searchAmendment.toLowerCase())) ||
            (element.title &&
          element.title
            .toLowerCase()
            .includes(this.searchAmendment.toLowerCase())) ||
            (element.fileNumber &&
            element.fileNumber
            .toLowerCase()
            .includes(this.searchAmendment.toLowerCase()))  ||
            (element.ballotStatus &&
            element.ballotStatus
            .toLowerCase()
            .includes(this.searchAmendment.toLowerCase()))
      );
    } else {
      this.amendmentList = this.allAmendmentList;
    }
    }
    // searchOrdinanceList(){
    // }
    searchSecondList() {
      if (this.searchSecondAmendment) {
        this.secondList = this.tempSecondList.filter(
          (element) =>
            (element.type &&
              element.type
              .toLowerCase()
              .includes(this.searchSecondAmendment.toLowerCase())) ||
              (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchSecondAmendment.toLowerCase())) ||
              (element.fileNumber &&
              element.fileNumber
              .toLowerCase()
              .includes(this.searchSecondAmendment.toLowerCase())) ||
              (element.ballotStatus &&
              element.ballotStatus
              .toLowerCase()
              .includes(this.searchSecondAmendment.toLowerCase()))
          );
      } else {
        this.secondList = this.tempSecondList;
      }
    }
    searchThirdList() {
      if (this.searchThirdAmendment) {
        this.thirdList = this.tempThirdList.filter(
          (element) =>
            // (element.billNumber&&
            //   element.billNumber
            //   .toLowerCase()
            //   .includes(this.searchThirdAmendment.toLowerCase())) ||
              (element.type &&
                element.type
                  .toLowerCase()
                  .includes(this.searchThirdAmendment.toLowerCase())) ||
              (element.title &&
                element.title
              .toLowerCase()
              .includes(this.searchThirdAmendment.toLowerCase())) ||
              (element.fileNumber &&
              element.fileNumber
              .toLowerCase()
              .includes(this.searchThirdAmendment.toLowerCase())) ||
              (element.status &&
              element.status
              .toLowerCase()
              .includes(this.searchThirdAmendment.toLowerCase()))
          );
      } else {
        this.thirdList = this.tempThirdList;
      }
    }
  viewList(id, listNumber) {
      if (id) {
    //   this.billService.getListByBallotId(id).subscribe((Res) => {
    //   this.mainList =  Res;
    //   this.ballotList = this.mainList.ballotList;
    //   this.showBallotList = true;
    //   this.listNumber = listNumber;
    // });
    }
  }
  closeBallotList() {
    this.showBallotList = false;
  }
  view(listId) {
    // this.billService.getClauseList(listId).subscribe((res) => {
    //   if (res) {
    //     this.list = res;
    //   }
    // });
    // this.showClauseList = true;
    this.router.navigate(['business-dashboard/pmbr/amendments-list-view', listId])
  }
  closeClauseList() {
    this.showClauseList = false;
  }
  openFile(id) {
    if (id) {
    this.router.navigate(['business-dashboard/pmbr/file-view/', id]);
    }
  }
  newSort(sort: { key: string; value: string }): void {
    const data = this.tempThirdList.filter((item) => item);
    if (sort.key && sort.value) {
      this.thirdList = data.sort((a, b) =>
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
      this.thirdList = data;
    }
  }
  getList3() {
    const body = {
      listType: 'LIST_3',
      ballotStatus: ['PUBLISHED'],
    };
    // this.billService.getThirdList(body).subscribe((res) => {
    //   this.list3Data = res;
    //   this.tempList3 = this.list3Data;
    //   console.log('list3', this.list3Data);
    // });
  }
  searchList3() {
    if (this.searchThirdAmendment) {
      this.thirdList = this.tempList3.filter(
        (element) =>
          (element.billNumber.includes(this.searchThirdAmendment)) ||
          (element.type && element.type.toLowerCase().includes(this.searchThirdAmendment.toLowerCase())) ||
          (element.title && element.title.toLowerCase().includes(this.searchThirdAmendment.toLowerCase())) ||
          (element.fileNumber && element.fileNumber.toLowerCase().includes(this.searchThirdAmendment.toLowerCase())) ||
          (element.status && element.status.toLowerCase().includes(this.searchThirdAmendment.toLowerCase()))
        );
      } else {
      this.thirdList = this.tempList3;
    }
  }
}
