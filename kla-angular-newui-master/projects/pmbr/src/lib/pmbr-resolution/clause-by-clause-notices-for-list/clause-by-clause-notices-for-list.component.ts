import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BillAmendmentsService } from '../shared/services/bill-amendments.service';
import { BillcommonService } from '../../shared/services/billcommon.service';

@Component({
  selector: 'lib-resolution-amendment-notices-for-list',
  templateUrl: './clause-by-clause-notices-for-list.component.html',
  styleUrls: ['./clause-by-clause-notices-for-list.component.css']
})
export class ResolutionAmendmentNoticesForListComponent implements OnInit {

  mapOfCheckedId: { [key: string]: boolean } = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  billId;
  billAmendment = null;
  clause = null;
  subClause = null;
  status = null;
  searchWord = null;
  totalClauseResponse: any = [];
  clauseNoticesList: any = [];
  allclauseNoticesList: any = [];
  tempclauseNoticeList: any = [];
  assignAssistant = {
  visible: false,
  noticeIds: [],
  searchPerson: null,
  assigneeId: null,
  assistantList: [],
  listofAssistants: []
  };
  user;
  radioValue: any = null;
  assigneeCode: any = '';
  colCheckboxes = [
  { id: 0, label: 'AmdNo', check: true, disable: false },
  { id: 1, label: 'amendment', check: true, disable: false },
  { id: 2, label: 'billNo', check: true, disable: false },
  { id: 3, label: 'membername', check: true, disable: false },
  { id: 4, label: 'official', check: true, disable: false },
  { id: 5, label: 'assigned', check: true, disable: false },
  { id: 6, label: 'clause', check: true, disable: false },
  { id: 7, label: 'type', check: true, disable: false },
  { id: 8, label: 'status', check: true, disable: false }
  ];
  filterCheckboxes = [
  { label: 'Amd No', checked: false },
  { label: 'Amendment', checked: false },
  { label: 'Member Name', checked: false},
  { label: 'Assigned To', checked: false},
  { label: 'Type', checked: false},
  ];
  noticeFiltered;
  noticeListFiltered;
  clauseList = [];
  subClauseList = [];
  amdnoList = [];
  amendmentList = [];
  memeberList = [];
  assignedList = [];
  typeList = [];
  blockTypeList = [];
  filterSelected = {
  clauseNumber: null,
  subClause: null,
  noticeNumber: null,
  content: null,
  memberName: null,
  assignedTo: null,
  operationType: null,
  blockTypeCode: null
  };
  isVisibleFilter: boolean;
  amdnodisable = false;
  amendmentdisable = false;
  memberdisable = false;
  assignedtodisable = false;
  typedisable = false;
  generatedList: any = [];
  visibleModel: boolean;
  listData: any = [];
  today = new Date();
  clauseDate;
  generateList2Flag: boolean;
  generateList3Flag: boolean;
  listDetails: any = [];
  orderList = {
    amendmentId: 0,
    order: 0
  };
  listType;
  validateForm: FormGroup;
  rbsPermission = {
    createList: false,
    reSubmitFile: false
  };
  list2status: any;
  list3status: any;
  conformButton: boolean;
  list;
  isClause = true;
  isSubclause = true;
  constructor(
  private fb: FormBuilder,
  private router: Router,
  private route: ActivatedRoute,
  private billAmendmentsService: BillAmendmentsService,
  private notification: NzNotificationService,
  private modalService: NzModalService,
  private commonService: BillcommonService,
  @Inject('authService') private AuthService,
  @Inject('notify') public notify) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setBillPermissions(this.user.rbsPermissions);
    this.billId = this.route.snapshot.params.id;
    this.formValidation();
  }

  ngOnInit() {
    this.getRbsPermission();
    if (this.billId) {
      this.getclauseNoticesList(this.billId);
    }
    this.getAssistantList();
  }
  formValidation(): void {
    this.validateForm = this.fb.group ({
      billId : [this.billId],
      listType : [null],
      orderDto : [[]]
    });
  }
  getRbsPermission() {
    if (this.commonService.doIHaveAnAccess('CBC_LIST', 'CREATE')) {
      this.rbsPermission.createList = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE', 'CREATE')) {
      this.rbsPermission.reSubmitFile = true;
    }
  }
  isSectionOfficer() {
    return (this.user.authorities.includes('sectionOfficer'));
  }
  getclauseNoticesList(id) {
    let body;
    if (this.isAssistant()) {
      body = {
        assignedTo : this.user.userId,
        billId : id,
        status :  null
      };
    } else {
      body = {
        billId : id,
        isAssigned : true,
      };
    }
    this.billAmendmentsService.getClauseNoticesListByBillId( body).subscribe((Res: any) => {
    this.totalClauseResponse = Res;
    this.clauseNoticesList = this.tempclauseNoticeList = Res.bilClauseAmendmentResponse;
    this.allclauseNoticesList = this.clauseNoticesList;
    const result = differenceInCalendarDays(parseISO(this.totalClauseResponse.schedule.calusebyClause), this.today);
    if (this.totalClauseResponse.list2CanbeGenerated && this.totalClauseResponse.schedule.calusebyClause !== null) {
        if ( result < 0) {
          this.generateList2Flag = true;
          this.generateList3Flag = false;
        } else { this.generateList2Flag = false; }
    } else {
      this.generateList2Flag = false;
      if (this.totalClauseResponse.list3CanbeGenerated) {
        this.generateList3Flag = true;
      } else {
        this.generateList3Flag = false;
      }
    }
    this._loadSelectedfilterData();
    });
  }
  canIGenerateList2() {
    if (this.totalClauseResponse.list2CanbeGenerated && this.rbsPermission.createList) {
      return true;
    }
    return false;
  }
  canIGenerateList3(){
    if (this.rbsPermission.createList && this.totalClauseResponse.list3CanbeGenerated) {
      return true;
    }
    return false;
  }
  _checkAllRows(value: boolean): void {
    this.tempclauseNoticeList.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    // if (list) {
    //   list.viewLinks = false;
    //   if (this.mapOfCheckedId[list.id]) {
    //     list.viewLinks = true;
    //   }
    // }
    this.checkbxParams.numberOfChecked = this.tempclauseNoticeList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.tempclauseNoticeList.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.clauseNoticesList.forEach((element) => {
        element.viewLinks = false;
      });
    }
  }
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.clauseNoticesList.forEach((element) => {

      if (element.billId === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  hideLinks(id) {
    this.clauseNoticesList.forEach((element) => {
      if (element.blockId === id) {
        element.viewLinks = false;
      }
    });
  }
  view_List(billId) {
    this.router.navigate([
      'business-dashboard/bill/bill-view',
      billId
    ]);
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempclauseNoticeList.filter((item) => item);
    if (sort.key && sort.value) {
      this.clauseNoticesList = data.sort((a, b) =>
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
      this.clauseNoticesList = data;
    }
  }

  getAssistantList() {
    // this.commonService.getAssisstantList(['CPL_ASSISTANT']).subscribe((Res:any) => {
    this.assignAssistant.assistantList = [
      {
        firstName: 'Bill Assistant',
        fullName: 'Bill Assistant',
        name: 'Assistant',
        userId: 521
      }
    ];
    this.assignAssistant.listofAssistants = this.assignAssistant.assistantList;
    // });
  }
  assignToAssistant() {
    this.assignAssistant.visible = true;
  }

  onSubmitAssistant() {
    let checkedArray = [];
    checkedArray = this.clauseNoticesList.filter(
      (item) => this.mapOfCheckedId[item.id]
    );
    checkedArray.forEach(element => {
      if (element.id) {
        this.assignAssistant.noticeIds.push(element.id);
      }
    });
    // let body = {
    //   actionTaken: this.assignAssistant.assigneeId,
    //   id: this.assignAssistant.noticeIds
    // };
    let body = {
      assignee: this.assignAssistant.assigneeId,
      noticeIds: this.assignAssistant.noticeIds
    };
    this.billAmendmentsService.assignToAssistant(body).subscribe((res: any) => {
      if (res) {
        this.assignAssistant.visible = false;
        this.assignAssistant.noticeIds = [];
        this.notification.create('Success', 'Assigned successfully!', '');
        this.getclauseNoticesList(this.billId);
      }
    });
    this.billAmendmentsService.getClauseBymemberId().subscribe((res: any) => {
      // this.getBillsForAction();
    });
  }
  onCancelAssistant() {
    this.assignAssistant.visible = false;
    this.assignAssistant.assigneeId.reset();
  }
  personSearch() {
    if (this.assignAssistant.searchPerson) {
      this.assignAssistant.assistantList = this.assignAssistant.listofAssistants.filter(
        (element) =>
          element.fullName &&
          element.fullName
            .toLowerCase()
            .includes(this.assignAssistant.searchPerson.toLowerCase())
      );
    } else {
      this.assignAssistant.assistantList = this.assignAssistant.listofAssistants;
    }
  }
  filtering() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    this.noticeFiltered = this.clauseNoticesList;
    this.noticeListFiltered = this.clauseNoticesList;
    if (this.searchWord) {
      this.clauseNoticesList = this.noticeFiltered.filter(
        (element) =>
          (element.noticeNumber &&
            element.noticeNumber
              .toLowerCase()
              .includes(this.searchWord.toLowerCase())) ||
          (element.content &&
            element.content
              .toLowerCase()
              .includes(this.searchWord.toLowerCase()))
      );
    } else {
      this.clauseNoticesList = this.noticeListFiltered;
    }
  }
  clearSearch() {
    this.clauseNoticesList = this.allclauseNoticesList;
    this.searchWord = '';
  }
  isAssistant() {
    return (this.user.authorities.includes('assistant'));
  }
  _loadSelectedfilterData() {
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;
    let counter6 = 0;
    let counter7 = 0;
    let counter8 = 0;
    this.allclauseNoticesList.forEach(element => {
      counter1++;
      if (element.clauseNumber !== '0') {
        this.clauseList.push(element.clauseNumber);
      }
      if (counter1 === this.allclauseNoticesList.length) {
        this.clauseList = this.clauseList.filter((v, i, a) => a.indexOf(v) === i);
      }
    });
    this.allclauseNoticesList.forEach(element => {
      counter2++;
      if (element.subClause !== null) {
        this.subClauseList.push(element.subClause);
      }
      if (counter2 === this.allclauseNoticesList.length) {
        this.subClauseList = this.subClauseList.filter((v, i, a) => a.indexOf(v) === i);
      }
    });
    this.amdnodisable
      ? Object.keys(self.allclauseNoticesList).forEach(function(key) {
        counter3++;
        self.amdnoList.push(self.allclauseNoticesList[key].noticeNumber);
        if (counter3 === self.allclauseNoticesList.length) {
          self.amdnoList = self.amdnoList.filter((v, i, a) => a.indexOf(v) === i);
        }
      })
      : '';
    this.amendmentdisable
      ? Object.keys(self.allclauseNoticesList).forEach(function(key) {
        counter4++;
        self.amendmentList.push(self.allclauseNoticesList[key].content);
        if (counter4 === self.allclauseNoticesList.length) {
          self.amendmentList = self.amendmentList.filter((v, i, a) => a.indexOf(v) === i);
        }
      })
      : '';
    this.memberdisable
      ? Object.keys(self.allclauseNoticesList).forEach(function(key) {
        counter5++;
        self.memeberList.push(self.allclauseNoticesList[key].memberName);
        if (counter5 === self.allclauseNoticesList.length) {
          self.memeberList = self.memeberList.filter((v, i, a) => a.indexOf(v) === i);
        }
      })
      : '';
    this.assignedtodisable
      ? Object.keys(self.allclauseNoticesList).forEach(function(key) {
        counter6++;
        self.assignedList.push(self.allclauseNoticesList[key].assignedTo);
        if (counter6 === self.allclauseNoticesList.length) {
          self.assignedList = self.assignedList.filter((v, i, a) => a.indexOf(v) === i);
        }
      })
      : '';
    this.typedisable
      ? Object.keys(self.allclauseNoticesList).forEach(function(key) {
        counter7++;
        self.typeList.push(self.allclauseNoticesList[key].operationType);
        if (counter7 === self.allclauseNoticesList.length) {
          self.typeList = self.typeList.filter((v, i, a) => a.indexOf(v) === i);
        }
      })
      : '';
    this.allclauseNoticesList.forEach(element => {
      counter8++;
      self.blockTypeList.push(element.blockTypeCode);
      if (counter8 === this.allclauseNoticesList.length) {
          self.blockTypeList = self.blockTypeList.filter((v, i, a) => a.indexOf(v) === i);
        }
      });
  }
  searchClauseList(filter: any) {
    const subclause = [];
    if (!filter) {
      this.clauseNoticesList = this.allclauseNoticesList;
    } else {
      if (this.clauseNoticesList) {
        this.clauseNoticesList = this.allclauseNoticesList.filter((item: any) =>
          this.applyFilter(item, filter)
        );
        this.clauseNoticesList.forEach(element => {
          if (element.clauseNumber !== '0') {
            this.isClause = true;
          } else { this.isClause = false; }
        });
        this.clauseNoticesList.forEach(element => {
          if (element.subClause !== null) {
            subclause.push(element.subClause);
          }
          if (subclause.length > 0) {
            this.isSubclause = true;
          } else {this.isSubclause = false; }
        });
      }
      this.noticeFiltered = this.clauseNoticesList;
      this.noticeListFiltered = this.clauseNoticesList;
    }
  }
  applyFilter(element: any, filter: any): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (!element[field] || element[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  showModel() {
    this.isVisibleFilter = true;
  }
  hideModel() {
    this.isVisibleFilter = false;
    this.cancelCheckbox();
  }
  cancelCheckbox() {
    this.filterCheckboxes.find((element) => element.label === 'Amd No').checked = this.amdnodisable ;
    this.filterCheckboxes.find((element) => element.label === 'Amendment').checked = this.amendmentdisable;
    this.filterCheckboxes.find((element) => element.label === 'Member Name').checked = this.memberdisable;
    this.filterCheckboxes.find((element) => element.label === 'Assigned To').checked = this.assignedtodisable;
    this.filterCheckboxes.find((element) => element.label === 'Type').checked = this.typedisable;
  }
  showFilter() {
    this.isVisibleFilter = false;
    this.amdnodisable = this.filterCheckboxes.find(
      (element) => element.label === 'Amd No'
    ).checked;
    this.amendmentdisable = this.filterCheckboxes.find(
      (element) => element.label === 'Amendment'
    ).checked;
    this.memberdisable = this.filterCheckboxes.find(
      (element) => element.label === 'Member Name'
      ).checked;
    this.assignedtodisable = this.filterCheckboxes.find(
      (element) => element.label === 'Assigned To'
    ).checked;
    this.typedisable = this.filterCheckboxes.find(
      (element) => element.label === 'Type'
    ).checked;
    this._loadSelectedfilterData();
  }
  chooseFilter(box) {
    box.checked = !box.checked;
  }
  disableFilter(value) {
    switch (value) {
      case 1:
        this.amdnodisable = false;
        this.filterSelected.noticeNumber = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'Amd No') {
            element.checked = false;
          }
        });
        break;
        case 2:
        this.amendmentdisable = false;
        this.filterSelected.content = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'Amendment') {
            element.checked = false;
          }
        });
        break;
        case 3:
        this.memberdisable = false;
        this.filterSelected.memberName = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'Member Name') {
            element.checked = false;
          }
        });
        break;
        case 4:
        this.assignedtodisable = false;
        this.filterSelected.assignedTo = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'Assigned To') {
            element.checked = false;
          }
        });
        break;
        case 5:
        this.typedisable = false;
        this.filterSelected.operationType = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === 'Type') {
            element.checked = false;
          }
        });
        break;
      }
    this.searchClauseList(this.filterSelected);
  }
  generateList(listType) {
    // if (listType === 'LIST_2') {
    //   this.list = 'List 2';
    // } else { this.list = 'List 3'; }
    const body = {
      billId : this.billId
    };
    this.billAmendmentsService.intitialList(body, this.billId, listType).subscribe( res => {
        if (res) {
          this.listDetails = res;
          this.listData = res;
          this.visibleModel = true;
          this.conformButton = true;
        }
    });
  }
  createClauseList(listId) {
    if (listId === 2) {
      this.listType = 'LIST_2';
    } else {
      this.listType = 'LIST_3';
    }
    this.orderList = this.listDetails.bilClauseAmendmentResponse.map((x) => ({
      amendmentId : x.id,
      order : x.order
    }));
    this.validateForm.get('listType').setValue(this.listType);
    this.validateForm.get('orderDto').setValue(this.orderList);
    this.billAmendmentsService.createClauseList(this.validateForm.value).subscribe(res => {
      if (res) {
        this.visibleModel = false;
        this.getclauseNoticesList(this.billId);
      }
    });
  }
  getByBillIdList(listId) {
    this.conformButton = false;
    if (this.totalClauseResponse.list2status === 'PUBLISHED'|| 
        this.totalClauseResponse.list2status === 'CIRCULATED') {
      this.list2status = 'PUBLISHED';
    }
    if (this.totalClauseResponse.list3status === 'PUBLISHED') {
      this.list3status = 'PUBLISHED';
    }
    if (listId === 2) {
      this.list = 'List';
      this.billAmendmentsService.getClauseList(this.totalClauseResponse.list2Id).subscribe(res => {
        if (res) {
          this.listData = res;
        }
      });
    } else {
      this.list = 'List 3';
      this.billAmendmentsService.getClauseList(this.totalClauseResponse.list3Id).subscribe(res => {
        if (res) {
          this.listData = res;
        }
      });
    }
    this.visibleModel = true;
  }
  closeList() {
    this.visibleModel = false;
    this.getclauseNoticesList(this.billId);
  }
  resubmitFile(activeSubType) {
    let body;
    body = {
      listId: this.listData.listId,
      fileForm: {
        fileId: this.totalClauseResponse.billFileId,
        activeSubTypes: [activeSubType],
        type: 'PMBR',
        userId: this.user.userId,
      },
    };
    if (this.totalClauseResponse.fileStatus === 'APPROVED') {
    this.billAmendmentsService.resubmitFile(body).subscribe( res => {
        if (res) {
          this.router.navigate(['business-dashboard/pmbr/file-view/', this.totalClauseResponse.billFileId]);
          this.notification.create('Success', 'Resubmitted successfully!', '');
        }
      });
    } else {
      this.modalService.create({
        nzTitle: 'Resubmit File',
        nzWidth : '500',
        nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot resubmit now... </b>',
        nzOkText: 'OK',
        nzOnOk: () => {},
      });
    }
    this.visibleModel = false;
  }
  viewFile() {
    this.router.navigate([
      'business-dashboard/pmbr/file-view/',
      this.totalClauseResponse.billFileId
    ]);
  }
  publishList() {
  // let listId;
  // if (id === 2) {
  //   listId = this.totalClauseResponse.list2Id;
  // } else {
  //   listId = this.totalClauseResponse.list3Id;
  // }
  this.billAmendmentsService.publishList(this.listData.listId).subscribe( res => {
      if (res) {
        this.notification.create('Success', 'List Circulated successfully!', '');
      }
    });
  this.visibleModel = false;
  this.getclauseNoticesList(this.billId);
  }
  goBack() {
    window.history.back();
  }
}
