import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pmbr-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit {

  tempNoticeList = [];
  search = null;

  colCheckboxes = [
    { id: 0, label: 'notice', check: true, disable: false },
    { id: 1, label: 'session', check: true, disable: false },
    { id: 2, label: 'date', check: true, disable: false },
    { id: 3, label: 'status', check: true, disable: false }
  ];
  constructor() { }

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
 noticeList = this.tempNoticeList=[
    {
      notice : "Notice no 1",
      session : "Session",
      date : "12-01-2020",
      status : "Status" 
    },
    {
      notice : "Notice no 1",
      session : "Session",
      date : "12-01-2020",
      status : "Status" 
    }
  ]
  searchList()  {
    if (this.search) {
      this.noticeList = this.tempNoticeList.filter(
        (element) =>
            (element.notice &&
              element.notice
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
      this.noticeList = this.tempNoticeList;
    }
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempNoticeList.filter((item) => item);
    if (sort.key && sort.value) {
      this.noticeList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.noticeList = data;
    }
  }

  ngOnInit() {
  }

}
