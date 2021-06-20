import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pmbr-bill-register',
  templateUrl: './bill-register.component.html',
  styleUrls: ['./bill-register.component.css']
})
export class BillRegisterComponent implements OnInit {

  tempNoticeList = [];
  search = null;
  filtrParams: any = {};

  colCheckboxes = [
    { id: 0, label: 'nameofbill', check: true, disable: false },
    { id: 1, label: 'billno', check: true, disable: false },
    { id: 2, label: 'honblemember', check: true, disable: false },
    { id: 3, label: 'fileno', check: true, disable: false },
    { id: 4, label: 'dateofpresentation', check: true, disable: false },
    { id: 4, label: 'minister', check: true, disable: false },
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
      bill: "The good Samaritan Bill1",
      bno: "1231",
      fn: "file no1",
      hbm: "Member1",
      dop: "01-12-2020",
      minister: "Minister1",
      status: "Status"
    },
    {
      id: "2",
      bill: "The good Samaritan Bill2",
      bno: "1232",
      fn: "file no2",
      hbm: "Member2",
      dop: "02-12-2020",
      minister: "Minister2",
      status: "Status"
    },
    {
      id: "3",
      bill: "The good Samaritan Bill3",
      bno: "1233",
      fn: "file no3",
      hbm: "Member3",
      dop: "03-12-2020",
      minister: "Minister3",
      status: "Status"
    },
    {
      id: "4",
      bill: "The good Samaritan Bill4",
      bno: "1234",
      fn: "file no4",
      hbm: "Member4",
      dop: "04-12-2020",
      minister: "Minister4",
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
            (element.bno &&
              element.bno
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
            (element.fn &&
            element.fn
            .toLowerCase()
            .includes(this.search.toLowerCase())) ||
            (element.hbm &&
              element.hbm
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
              (element.dop &&
                element.dop
                .toLowerCase()
                .includes(this.search.toLowerCase())) ||
                (element.minister &&
                  element.minister
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
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "nameofbill", key: "nameofbill" },
      { label: "billno", key: "billno" },
      { label: "honblemember", key: "honblemember" },
      { label: "fileno", key: "fileno" },
      { label: "dateofpresentation", key: "dateofpresentation" },
      { label: "minister", key: "minister" },
      { label: "status", key: "status" }

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
    this.filtrParams.colFilter = false;
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  showFilter(type) {
    this.filtrParams.rowFilter = type === "row" ? true : false;
  }
  _confrmFilter(): void {
    if (this.filtrParams.colFilter) {
      this._filterCols();
    } else {
      this._filterRows();
    }
  }
  _filterCols() {
    this.filtrParams.colFilter = false;
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
          case "bill":
            this.tempNoticeList.forEach((value) => {
              element.data.push(value.bill);
            });
            break;
          case "bno":
            this.tempNoticeList.forEach((value) => {
              element.data.push(value.bno);
            });
            break;
          case "hbm":
            this.tempNoticeList.forEach((value) => {
              element.data.push(value.hbm);
            });
            break;
          case "fn":
            this.tempNoticeList.forEach((value) => {
              element.data.push(value.fn);
            });
            break;
          case "dop":
            this.tempNoticeList.forEach((value) => {
              element.data.push(value.dop);
            });
            break;
            case "minister":
              this.tempNoticeList.forEach((value) => {
                element.data.push(value.minister);
              });
              break;
          case "status":
            this.tempNoticeList.forEach((value) => {
              element.data.push(value.status);
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
  searchCol() {
    if (!this.filtrParams.row) {
      this.noticeList = this.tempNoticeList;
    } else {
      this.noticeList = this.tempNoticeList.filter((item: any) =>
        this.applyFilter(item, this.filtrParams.row)
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
  disableFilter(filter) {
    filter.filtersel = false;
    filter.checked = false;
    filter.data = [];
    filter.selValue = null;
    this.searchCol();
    this._loadSelectedfilterData();
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
