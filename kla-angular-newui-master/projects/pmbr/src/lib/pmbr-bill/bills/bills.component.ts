import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { InoticeDetails } from '../shared/models/pmbr-bill-model';

@Component({
  selector: 'pmbr-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {
  tempBillList: any = [];
  billList: any = [];
  search = null;
  viewLinks = false;
  colCheckboxes = [
    { id: 0, label: 'bill', check: true, disable: false },
    { id: 1, label: 'date', check: true, disable: false },
    { id: 2, label: 'priority', check: true, disable: false },
    { id: 3, label: 'session', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false }

  ];
  showHideCreateBillMetaform = false;
  showHideCreateNotice = false;
  noticeDetails: InoticeDetails;
  noticeId;
  viewNoticeTitle = '';
  user: any = null;
  permissions = {
    createBill: false,
    updateBill: false
  };
  selectedBillId;
  myBillsList: any = [];
  tempMyBillList: any = [];
  constructor(private notification: NzNotificationService, private router: Router, private pmbrCommonService: PmbrCommonService,
    @Inject('authService') private AuthService) {
    this.user = AuthService.getCurrentUser();
    this.pmbrCommonService.setPermissions(this.user.rbsPermissions);
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
  getBillsList() {
    const body = {
      "assignedTo": 0,
      "departmentId": null,
      "natureOfBill": "PRIVATE",
      "isGovernerRecommendation": false,
      "isOrdinance": false,
      "status": [
        null
      ],
      "type": null
    }
    this.pmbrCommonService.getBillsList(body).subscribe(res => {
      this.billList = this.tempBillList = res;
    });
  }

  ngOnInit() {
    this.getRbsPermissions();
    this.getBillsList();
    this.getMyBillsList();
  }

  searchList() {
    if (this.search) {
      this.billList = this.tempBillList.filter(
        (element) =>
          (element.billMetaDataDto.title &&
            element.billMetaDataDto.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.createdDate &&
            element.billMetaDataDto.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.priority &&
            element.billMetaDataDto.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.session &&
            element.billMetaDataDto.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.status &&
            element.billMetaDataDto.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.billList = this.tempBillList;
    }
  }
  searchBills() {
    if (this.search) {
      this.myBillsList = this.tempMyBillList.filter(
        (element) =>
          (element.billMetaDataDto.title &&
            element.billMetaDataDto.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.createdDate &&
            element.billMetaDataDto.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.priority &&
            element.billMetaDataDto.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.session &&
            element.billMetaDataDto.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.status &&
            element.billMetaDataDto.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.myBillsList = this.tempMyBillList;
    }
  }
  showLinks(id) {
    this.tempMyBillList.forEach(element => {
      if (element.billMetaDataDto.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  createBill(res) {
    if (res) {
      this.getBillsList();
      this.notification.success('Success', 'Private bill created.');
      if (this.selectedBillId) {
        this.getBillsList();
        this.hidePopUp();
      }
      else {
        this.router.navigate(["business-dashboard/pmbr/create", res.id]);
      }
    }
    else {
      this.hidePopUp();
    }
    this.showHideCreateBillMetaform = false;
  }
  showCreateBillMetaForm() {
    this.selectedBillId = null;
    this.showHideCreateBillMetaform = true;
  }
  hidePopUp() {
    this.showHideCreateBillMetaform = false;
    this.showHideCreateNotice = false;
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempBillList.filter((item) => item);
    if (sort.key && sort.value) {
      this.billList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.billList = data;
    }
  }
  showCreateNotice(type, event, title) {
    this.viewNoticeTitle = title
    const noticeDetails = event.notices.find(n => n.noticeType == type)
    this.noticeDetails = {
      billId: event.billMetaDataDto.id,
      noticeId: noticeDetails ? noticeDetails.id : null,
      noticeType: type,
      billStatus: event.billMetaDataDto.status
    }
    this.showHideCreateNotice = true;
  }
  hideNoticeView(event) {
    this.hidePopUp();
  }
  saveNotice(event) {
    if (event) {
      this.getBillsList();
      this.notification.success('Success', 'Notice created successfully')
    }
    this.hidePopUp();
  }
  createNoticeText(type, event) {
    let noticeDetails;
    if (event.notices) {
      noticeDetails = event.notices.find(n => n.noticeType == type)
    }
    if (type == 'INTRODUCE_BILL') {
      return noticeDetails ? 'ViewNotice' : 'CreateNotice'
    }
    else if (type == 'PRESENT_IN_ENGLISH') {
      return noticeDetails ? 'ViewEnglishNotice' : 'CreateEnglishNotice'
    }
  }
  viewBill(id) {
    this.router.navigate(['business-dashboard/pmbr/bill-view/', id]);
  }
  editBill(id) {
    this.router.navigate(['business-dashboard/pmbr/create/', id]);
  }
  editMetaData(billId) {
    this.selectedBillId = billId;
    this.showHideCreateBillMetaform = true;
  }

  getRbsPermissions() {
    if (this.pmbrCommonService.doIHaveAnAccess('PM_BILL', 'CREATE')) {
      this.permissions.createBill = true;
    }
    if (this.pmbrCommonService.doIHaveAnAccess('PM_BILL', 'UPDATE')) {
      this.permissions.updateBill = true;
    }
  }
  getMyBillsList() {
    this.pmbrCommonService.getMemberBillList().subscribe(res => {
      this.myBillsList = this.tempMyBillList = res;
    });
  }

}
