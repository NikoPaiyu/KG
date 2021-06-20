import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'pmbr-resolution',
  templateUrl: './resolution.component.html',
  styleUrls: ['./resolution.component.css']
})
export class ResolutionComponent implements OnInit {
  tempResolutionList = [];
  search = null;
  viewLinks = false;
  colCheckboxes = [
    { id: 0, label: 'date', check: true, disable: false },
    { id: 1, label: 'fileno', check: true, disable: false },
    { id: 2, label: 'session', check: true, disable: false },
    { id: 3, label: 'honblemember', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false }

  ];
  constructor(private router: Router) { }

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
  resolutionList = this.tempResolutionList = [
    {
      id: "1",
      date: "12-01-2020",
      fileno: "fileno",
      session: "Session",
      honblemember: "Hon'ble Member",
      status: "Status"
    },
    {
      id: "2",
      date: "12-02-2020",
      fileno: "fileno",
      session: "Session",
      honblemember: "Hon'ble Member",
      status: "Status"
    },
    {
      id: "3",
      date: "12-03-2020",
      fileno: "fileno",
      session: "Session",
      honblemember: "Hon'ble Member",
      status: "Status"
    },
    {
      id: "4",
      date: "12-04-2020",
      fileno: "fileno",
      session: "Session",
      honblemember: "Hon'ble Member",
      status: "Status"
    }
  ]

  ngOnInit() {
  }

  searchList() {
    if (this.search) {
      this.resolutionList = this.tempResolutionList.filter(
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
      this.resolutionList = this.tempResolutionList;
    }
  }
  showLinks(id) {
    this.tempResolutionList.forEach(element => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  showLink(id) {
    this.tempResolutionList.forEach(element => {
      if (element.id === id) {
        element.viewLink = true;
      } else {
        element.viewLink = false;
      }
    });
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempResolutionList.filter((item) => item);
    if (sort.key && sort.value) {
      this.resolutionList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.resolutionList = data;
    }
  }
  viewResolution() {
    this.router.navigate([
      'business-dashboard/pmbr/resolution-view',
    ]);
  }

}
