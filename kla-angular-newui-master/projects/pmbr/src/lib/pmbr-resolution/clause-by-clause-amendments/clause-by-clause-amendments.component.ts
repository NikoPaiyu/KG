import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BillAmendmentsService } from '../shared/services/bill-amendments.service';

@Component({
  selector: 'lib-clause-by-clause-amendments',
  templateUrl: './clause-by-clause-amendments.component.html',
  styleUrls: ['./clause-by-clause-amendments.component.css']
})
export class ClauseByClauseAmendmentsComponent implements OnInit {
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = '';
  mapOfCheckedId: { [key: string]: boolean } = {};
  assignAssistant = {
    visible: false,
    noticeIds: [],
    searchPerson: null,
    assigneeId: null,
    assistantList: [],
    listofAssistants: []
  };
  colCheckboxes = [
    { id: 0, label: 'billNo', check: true, disable: false },
    { id: 1, label: 'billTitle', check: true, disable: false },
    { id: 2, label: 'billType', check: true, disable: false },
    { id: 3, label: 'fileNo', check: true, disable: false },
    { id: 4, label: 'numberOfAmendments', check: true, disable: false },
    { id: 5, label: 'respondedmembers', check: true, disable: false },
    { id: 6, label: 'status', check: true, disable: false },
    { id: 7, label: 'ministerName', check: true, disable: false }
  ];
  clauseList: any = [];
  allClauseList: any = [];
  user;
  isassistant: boolean;
  status: any;
  constructor(
    private billAmendmentsService: BillAmendmentsService,
    private router: Router,
    private notification: NzNotificationService,
    @Inject('authService') private AuthService,
    @Inject('notify') public notify) {
      this.user = AuthService.getCurrentUser();
    }

  ngOnInit() {
    this._setFilter();
    if ( this.isAssistant()) {
      this.isassistant = true;
      this.status = null;
    } else {
      this.isassistant = false;
      this.status = 'SUBMITTED';
    }
    this.getClauseBasedOnStatusAndUserId();
    // this.getAssistantList();
  }
  selectedText: string = '';

  isSectionOfficer() {
    return (this.user.authorities.includes('sectionOfficer'));
  }
  isAssistant() {
    return (this.user.authorities.includes('assistant'));
  }
  showSelectedText() {
    let text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.getSelection() && document.getSelection().type !== 'Control') {
      // text = document.getSelection().;
    }
    this.selectedText = text;
  }
  getClauseBasedOnStatusAndUserId() {
    const body = {
      assignedTo: 0,
      billId: 0,
      isAssigned: false,
      status: this.status,
    };
    this.billAmendmentsService.getClauseByuserIdandStatus(body, this.isassistant).subscribe((Res: any) =>
    this.clauseList = this.allClauseList = Res);
    this.clauseList.forEach((element) => {
    element.viewLinks = false;
    });

  }
  searchOnList() {
    this.clauseList = this.allClauseList;
    if (this.searchParam) {
      this.clauseList = this.allClauseList.filter(
        (element) =>
          (element.billNumber &&
            element.billNumber.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billTitle &&
            element.billTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billType &&
            element.billType
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.ministerName &&
            element.ministerName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.memberName &&
            element.memberName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.submittedDate &&
            element.submittedDate
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.clauseList = this.allClauseList;
    }

  }
  // showFilter(data) {

  // }
  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 8) {
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
  _checkAllRows(value: boolean): void {
    this.allClauseList.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    // if (list) {
    //   list.viewLinks = false;
    //   if (this.mapOfCheckedId[list.id]) {
    //     list.viewLinks = true;
    //   }
    // }
    this.checkbxParams.numberOfChecked = this.allClauseList.filter(
      (item) => this.mapOfCheckedId[item.billId]
    ).length;
    this.checkbxParams.allDtCheckd = this.allClauseList.every(
      (item) => this.mapOfCheckedId[item.billId]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
        this.clauseList.forEach((element) => {
          element.viewLinks = false;
        });
      }
  }
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.clauseList.forEach((element) => {

      if (element.billId === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  hideLinks(id) {
    this.clauseList.forEach((element) => {
      if (element.billId === id) {
        element.viewLinks = false;
      }
    });
  }
  view_List(billId) {
    this.router.navigate([
      'business-dashboard/pmbr/clause-by-clause-notices',
      billId
    ]);
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.allClauseList.filter((item) => item);
    if (sort.key && sort.value) {
      this.clauseList = data.sort((a, b) =>
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
      this.clauseList = data;
    }
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: 'Bill No', key: 'billNo' },
      { label: 'Title Of Bill', key: 'billTitle' },
      { label: 'Type Of Bill', key: 'billType' },
      { label: 'fileNo', key: 'fileNo' },
      { label: 'numberOfAmendments', key: 'numberOfAmendments' },
      { label: 'respondedmembers', key: 'respondedmembers' },
      { label: 'Status', key: 'status' },
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
    // this.filtrParams.colFilter = type === "column" ? true : false;
    this.filtrParams.rowFilter = type === 'row' ? true : false;
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
          case 'billNo':
            this.allClauseList.forEach((value) => {
              element.data.push(value.billNumber);
            });
            break;
          case 'billTitle':
            this.allClauseList.forEach((value) => {
              element.data.push(value.billTitle);
            });
            break;
          case 'billType':
            this.allClauseList.forEach((value) => {
              element.data.push(value.billType);
            });
            break;
          case 'fileNo':
            this.allClauseList.forEach((value) => {
              element.data.push(value.fileNumber);
            });
            break;
          case 'numberOfAmendments':
            this.allClauseList.forEach((value) => {
              element.data.push(value.numberOfNotices);
            });
            break;
          case 'respondedmembers':
              this.allClauseList.forEach((value) => {
                element.data.push(value.ministerName);
              });
              break;
          case 'status':
            this.allClauseList.forEach((value) => {
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
    if (!this.filtrParams.tableDto) {
      this.clauseList = this.allClauseList;
    } else {
      this.clauseList = this.clauseList.filter((item: any) =>
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
  view_Bill(billId) {
    this.router.navigate([
      'business-dashboard/pmbr/resolution-amendment',
      billId
    ]);
  }
  // getAssistantList() {
  //   // this.commonService.getAssisstantList(['CPL_ASSISTANT']).subscribe((Res:any) => {
  //   this.assignAssistant.assistantList = [
  //     {
  //       firstName: "Bill Assistant",
  //       fullName: "Bill Assistant",
  //       name: "Assistant",
  //       userId: 521
  //     }
  //   ];
  //   this.assignAssistant.listofAssistants = this.assignAssistant.assistantList;
  //   // });
  // }
  // assignToAssistant() {
  //   this.assignAssistant.visible = true;
  // }

  // onSubmitAssistant() {
  //   let checkedArray = [];
  //   checkedArray = this.clauseList.filter(
  //     (item) => this.mapOfCheckedId[item.id]
  //   );
  //   checkedArray.forEach(element => {
  //     if (element.id) {
  //       this.assignAssistant.noticeIds.push(element.id)
  //     }
  //   });
  //   let body = {
  //     actionTaken: this.user.userId,
  //     id: this.assignAssistant.noticeIds
  //   };
  //   this.billAmendmentsService.getClauseBymemberId().subscribe((res: any) => {
  //     this.notification.create("success", "Success", "");
  //     this.assignAssistant.visible = false;
  //     this.assignAssistant.noticeIds = [];
  //     // this.getBillsForAction();
  //   });
  // }
  // onCancelAssistant() {
  //   this.assignAssistant.visible = false;
  // }
  // personSearch() {
  //   if (this.assignAssistant.searchPerson) {
  //     this.assignAssistant.assistantList = this.assignAssistant.listofAssistants.filter(
  //       (element) =>
  //         element.fullName &&
  //         element.fullName
  //           .toLowerCase()
  //           .includes(this.assignAssistant.searchPerson.toLowerCase())
  //     );
  //   } else {
  //     this.assignAssistant.assistantList = this.assignAssistant.listofAssistants;
  //   }
  // }
}
