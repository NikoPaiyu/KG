import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pmbr-opinion',
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.css']
})
export class OpinionComponent implements OnInit {

  tempNoticeList = [];
  search = null;

  colCheckboxes = [
    { id: 0, label: 'titleofbill', check: true, disable: false },
    { id: 1, label: 'typeofbill', check: true, disable: false },
    { id: 2, label: 'language', check: true, disable: false },
    { id: 3, label: 'honblemember', check: true, disable: false },
    { id: 4, label: 'department', check: true, disable: false },
    { id: 5, label: 'status', check: true, disable: false }

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
      id: "1",
      bill: "The Kerala Appropriation(No.1) Bill,2020",
      tob: "Type Of Bill",
      lan: "Malayalam",
      hbm: "Member",
      dep: "Finance",
      status: "Status"
    },
    {
      id: "2",
      bill: "The Kerala Appropriation(No.2) Bill,2020",
      tob: "Type Of Bill",
      lan: "Malayalam",
      hbm: "Member",
      dep: "Finance",
      status: "Status"
    },
    {
      id: "3",
      bill: "The Kerala Appropriation(No.3) Bill,2020",
      tob: "Type Of Bill",
      lan: "Malayalam",
      hbm: "Member",
      dep: "Finance",
      status: "Status"
    },
    {
      id: "4",
      bill: "The Kerala Appropriation(No.4) Bill,2020",
      tob: "Type Of Bill",
      lan: "English",
      hbm: "Member",
      dep: "Finance",
      status: "Status"
    }
  ]
  searchList()  {
    if (this.search) {
      this.noticeList = this.tempNoticeList.filter(
        (element) =>
            (element.bill &&
              element.bill
                .toLowerCase()
                .includes(this.search.toLowerCase())) ||
            (element.tob &&
              element.tob
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
            (element.lan &&
            element.lan
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
            (element.hbm &&
              element.hbm
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
              (element.dep &&
                element.dep
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
  showLinks(id) {
    this.tempNoticeList.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
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
