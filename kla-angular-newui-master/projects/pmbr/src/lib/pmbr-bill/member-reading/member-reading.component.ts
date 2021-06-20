import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pmbr-member-reading',
  templateUrl: './member-reading.component.html',
  styleUrls: ['./member-reading.component.css']
})
export class MemberReadingComponent implements OnInit {

  tempMemberList = [];
  search = null;
  viewLinks = false;
  colCheckboxes = [
    { id: 0, label: 'session', check: true, disable: false },
    { id: 1, label: 'date', check: true, disable: false },
    { id: 2, label: 'member', check: true, disable: false },
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
  memberList = this.tempMemberList = [
    {
      id: "1",
      date: "12-01-2020",
      session: "Session",
      member: " Member",
      status: "Status"
    },
    {
      id: "2",
      date: "12-02-2020",
      session: "Session",
      member: " Member",
      status: "Status"
    },
    {
      id: "3",
      date: "12-03-2020",
      session: "Session",
      member: "Member",
      status: "Status"
    },
    {
      id: "4",
      date: "12-04-2020",
      session: "Session",
      member: "Member",
      status: "Status"
    }
  ]

  ngOnInit() {
  }

  searchList() {
    if (this.search) {
      this.memberList = this.tempMemberList.filter(
        (element) =>
          (element.date &&
            element.date
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.fileno &&
            element.fileno
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.session &&
            element.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.honblemember &&
            element.honblemember
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.memberList = this.tempMemberList;
    }
  }
  showLinks(id) {
    this.tempMemberList.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
 
  sort(sort: { key: string; value: string }): void {
    const data = this.tempMemberList.filter((item) => item);
    if (sort.key && sort.value) {
      this.memberList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.memberList = data;
    }
  }

}
