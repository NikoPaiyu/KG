import { Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'lib-General_Amendment',
  templateUrl: './General_Amendment.component.html',
  styleUrls: ['./General_Amendment.component.css']
})

@Component({
  selector: 'datepicker-overview-example',
  templateUrl: 'datepicker-overview-example.html',
})
export class DatepickerOverviewExample {}
export interface DialogData {
  membername: string;
  name: string;
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'dialog-overview-example',
  templateUrl: 'dialog-overview-example.html',
})
export class DialogOverviewExample {

  membername: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {name: this.membername}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.membername = result;
    });
  }

}

@Component({
  selector: 'radio-overview-example',
  templateUrl: 'radio-overview-example.html',
  styleUrls: ['radio-overview-example.css'],
})
export class RadioOverviewExample {}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export class GeneralAmendmentComponent implements OnInit {
  billList: any = [];
  allbillList: any = [];
  paginationParams: any = {
    numberOfItem: 10,
    total: 0,
    pageIndex: 1,
  };
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "No", check: true, disable: false },
    { id: 2, label: "billNo", check: true, disable: false },
    { id: 3, label: "memberName", check: true, disable: false },
    { id: 4, label: "publicopinion", check: true, disable: false },
    { id: 5, label: "committee", check: true, disable: false },
    { id: 6, label: "amendmentover", check: true, disable: false },
    { id: 7, label: "ballotpriority", check: true, disable: false },
    { id: 8, label: "status", check: true, disable: false }, 
  ];
  constructor() {
  }
  ngOnInit() {
    this._setFilter();
    this.getData();
  }
  pageSizeChange(numberOfItem) {
    this.paginationParams.pageIndex = 1;
    this.paginationParams.numberOfItem = numberOfItem;
    this.billList = this.allbillList.slice(
      0,
      this.paginationParams.numberOfItem
    );
  }
  pageIndexChange(index) {
    this.paginationParams.pageIndex = index;
    this.loadNext(this.paginationParams.pageIndex);
  }
  loadNext(index) {
    const newIndex = index * 10;
    this.billList = this.allbillList.slice(
      newIndex,
      newIndex + this.paginationParams.numberOfItem
    );
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "No", key: "serialNo" },
      { label: "Bill No", key: "billNo" },
      { label: "Member Name", key: "memberName" },
      { label: "Public Opinion", key: "publicopinion" },
      { label: "Committee", key: "committee" },
      { label: "Amendment Over", key: "amendmentover" },
      { label: "Ballot Priority", key:"ballotpriority" },
      { label: "Status", key: "status" },
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
  _showFilter(type) {
    // this.filtrParams.colFilter = type === "column" ? true : false;
    this.filtrParams.rowFilter = type === "row" ? true : false;
    this.filtrParams.showPriorityPopup = false;
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
    // this.filtrParams.tableDto.forEach((element) => {
    //   if (element.checked) {
    //     element.disableCol = true;
    //   }
    // });
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
          case "No":
            this.allbillList.forEach((value) => {
              element.data.push(value.serialNo);
            });
            break; 
          case "billNo":
            this.allbillList.forEach((value) => {
              element.data.push(value.billNo);
            });
            break;
          case "memberName":
            this.allbillList.forEach((value) => {
              element.data.push(value.memberName);
            });
            break;
            case "publicopinion":
                this.allbillList.forEach((value) => {
                  element.data.push(value.publicopinion);
                });
                break;
          case "committee":
              this.allbillList.forEach((value) => {
                element.data.push(value.committee);
              });
              break;
            case "amendmentover":
                this.allbillList.forEach((value) => {
                  element.data.push(value.amendmentover);
                });
                break;
            case "ballotpriority":
                    this.allbillList.forEach((value) => {
                      element.data.push(value.ballotpriority);
                    });
                    break;
          case "status":
            this.allbillList.forEach((value) => {
              element.data.push(value.status);
            });
            break;
          default:
            break;
        }
      }
    });
  }

  getData() {
    let bills=[
         {
           "id":'332',
           "billNo":"122",
           "memberName":"Name of the Member",
           "publicopinion":"",
           "committee":"Select Committee",
           "amendmentover": "Bill",
           "ballotpriority": "01",
           "status":"Status",
           viewLinks: false,
         },
         {
            "id":'332',
            "billNo":"122",
            "memberName":"Name of the Member",
            "publicopinion":"",
            "committee":"Select Committee",
            "amendmentover": "Bill",
            "ballotpriority": "01",
            "status":"Status",
            viewLinks: false,
        },
        {
            "id":'332',
            "billNo":"122",
            "memberName":"Name of the Member",
            "publicopinion":"",
            "committee":"Select Committee",
            "amendmentover": "Subject cmt rep",
            "ballotpriority": "01",
            "status":"Status",
            viewLinks: false,
        },
        {
            "id":'332',
            "billNo":"122",
            "memberName":"Name of the Member",
            "publicopinion":"",
            "committee":"Select Committee",
            "amendmentover": "Subject cmt rep",
            "ballotpriority": "01",
            "status":"Status",
            viewLinks: false,
        },
       
    ];
}

}