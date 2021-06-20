import { Component, OnInit } from '@angular/core';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-rejected-bill-list',
  templateUrl: './rejected-bill-list.component.html',
  styleUrls: ['./rejected-bill-list.component.css']
})
export class RejectedBillListComponent implements OnInit {
  colCheckboxes = [
    { id: 0, label: 'bill', check: true, disable: false },
    { id: 1, label: 'date', check: true, disable: false },
    { id: 2, label: 'priority', check: true, disable: false },
    { id: 3, label: 'session', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false },
    { id: 5, label: 'status', check: true, disable: false },
    { id: 6, label: 'status', check: true, disable: false }

  ];
  rejectedBills: any = [];
  tempRejectedList: any = [];
  search;
  constructor( private pmbrCommonService: PmbrCommonService) { }

  ngOnInit() {
    this.rejectedBillList();
  }
rejectedBillList(){
  this.pmbrCommonService.getRejectedBillList().subscribe((Res) => {
    this.rejectedBills = this.tempRejectedList = Res;
  });
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
searchList() {
  if (this.search) {
    this.rejectedBills = this.tempRejectedList.filter(
      (element) =>
        (element.bill &&
          element.bill
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
        (element.priority &&
          element.priority
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
        (element.session &&
          element.session
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
        (element.date &&
          element.date
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
        (element.status &&
          element.status
            .toLowerCase()
            .includes(this.search.toLowerCase()))
    );
  } else {
    this.rejectedBills = this.tempRejectedList;
  }
} 
}
