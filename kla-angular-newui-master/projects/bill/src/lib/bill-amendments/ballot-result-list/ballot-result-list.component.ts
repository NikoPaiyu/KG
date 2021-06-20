import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { BillcommonService } from '../../shared/services/billcommon.service';

@Component({
  selector: 'lib-ballot-result-list',
  templateUrl: './ballot-result-list.component.html',
  styleUrls: ['./ballot-result-list.component.css']
})
export class BallotResultListComponent implements OnInit {
  mainList:any ={
    ballotList:[]
  };
  List:any= [];
  showBallotList= false;
  ballotList:any =[];
  tempBallotList:any = [];
  searchBallot= null;
  tableParams: any = { colSpan: false };
  colCheckboxes = [
    { id: 0, label: 'billNo', check: true, disable: false },
    { id: 1, label: 'title', check: true, disable: false },
    { id: 2, label: 'type', check: true, disable: false },
    { id: 3, label: 'fileNo', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false },
    { id: 5, label: 'noticetype', check: true, disable: false },
  ];
  constructor(private billService: BillManagementService,
    private router:Router,
    public commonService: BillcommonService) { }

  ngOnInit() {
    this.getGeneralAmendments();
  }
  getGeneralAmendments() {
    // let type='GENERAL_AMENDMENT';
    const  body ={
      noticeType :null,
      ballotStatus:['APPROVED','PUBLISHED'],
     };
    this.billService.getBallotList(body).subscribe((Res) => {
        this.ballotList= this.tempBallotList = Res;
        console.log(this.tempBallotList);
    });
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempBallotList.filter((item) => item);
    if (sort.key && sort.value) {
      this.ballotList= data.sort((a, b) =>
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
      this.ballotList = data;
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
    this.ballotList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.ballotList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  searchAmendmentList() {
    if(this.searchBallot) {
      this.ballotList  = this.tempBallotList.filter(
        (element) =>
          (element.type&&
            element.type
            .toLowerCase()
            .includes(this.searchBallot.toLowerCase())) ||
            (element.title&&
          element.title
            .toLowerCase()
            .includes(this.searchBallot.toLowerCase())) ||
            (element.fileNumber&&
            element.fileNumber
            .toLowerCase()
            .includes(this.searchBallot.toLowerCase()))  ||
            (element.ballotStatus&&
            element.ballotStatus
            .toLowerCase()
            .includes(this.searchBallot.toLowerCase())) 
       );
    } else {
      this.ballotList = this.tempBallotList;
    }
    }
    // searchOrdinanceList(){
    // }
    searchSecondList(){
      // if(this.searchSecondAmendment) {
      //   this.secondList = this.tempSecondList.filter(
      //     (element) =>
      //       (element.type&&
      //         element.type
      //         .toLowerCase()
      //         .includes(this.searchSecondAmendment.toLowerCase())) ||
      //         (element.title&&
      //       element.title
      //         .toLowerCase()
      //         .includes(this.searchSecondAmendment.toLowerCase())) ||
      //         (element.fileNumber&&
      //         element.fileNumber
      //         .toLowerCase()
      //         .includes(this.searchSecondAmendment.toLowerCase())) ||
      //         (element.status&&
      //         element.status
      //         .toLowerCase()
      //         .includes(this.searchSecondAmendment.toLowerCase())) 
      //    );
      // } else {
      //   this.secondList = this.tempSecondList;
      // }
    }
    viewList(id) {
      if(id) {
      this.billService.getListByBallotId(id).subscribe((Res) => {
    this.mainList =  Res;
     this.List =this.mainList.ballotList;
     this.showBallotList=true;
        console.log();
    });
    }
  }
  closeBallotList() {
    this.showBallotList = false;
  }
  openFile(id) {
    if(id) {
    this.router.navigate(['business-dashboard/bill/file-view', id]);
    }
  }
}
