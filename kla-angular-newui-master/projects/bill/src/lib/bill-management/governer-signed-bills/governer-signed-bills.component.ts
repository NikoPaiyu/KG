import { Component, Inject, OnInit } from '@angular/core';
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { BillViewService } from '../../bill-full-view/shared/bill-view.service';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { BillcommonService } from '../../shared/services/billcommon.service';

@Component({
  selector: 'bill-governer-signed-bills',
  templateUrl: './governer-signed-bills.component.html',
  styleUrls: ['./governer-signed-bills.component.css']
})
export class GovernerSignedBillsComponent implements OnInit {
  showActModal;
  searchKey = null;
  pendingSearch = null;
  completedSearch = null;
  pendingList: any = [];
  totalPendingList: any = [];
  completedList: any = [];
  totalCompletedList: any = [];
  vettingList: any = [];
  totalVettingList: any = [];
  assemblyId = null;
  sessionId = null;
  colCheckboxes = [
    { id: 0, label: 'title', check: true, disable: false },
    { id: 1, label: 'date', check: true, disable: false },
    { id: 2, label: 'venue', check: true, disable: false },
  ];
  permissions: any = {
    pending_vetting : false,
    completed_vetting: false,
    vetting: false
  };
  currentUser;
  pendingFiltered;
  pendingListFiltered;
  completedFiltered;
  completedListFiltered;
  filterCheckboxes = [
    { label: 'Bill Title', checked: false }
  ];
  filterSelected = {
    title: null
  };
  vettingFiltered: any;
  vettingListFiltered: any;
  selectRes: any;
  reason: any;
  billId: any;
  attachmentDto: any;
  uploadURL = this.service.uploadUrl();
  fileList: any = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  constructor(private service: BillManagementService,
              private commonService: BillcommonService,
              private billview: BillViewService,
              private notify: NzNotificationService,
              @Inject('authService') private AuthService) {
              this.currentUser = AuthService.getCurrentUser();
              this.commonService.setBillPermissions(this.currentUser.rbsPermissions);
    }

  ngOnInit() {
    this.getSignManualList();
    this.getBillsCompletedVetting();
    this.getRbsPermissionsinList();
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('VETTING_PENDING', 'READ')) {
      this.permissions.pending_vetting = true;
    }
    if (this.commonService.doIHaveAnAccess('VETTING_COMPLETED', 'READ')) {
      this.permissions.completed_vetting = true;
    }
    if (this.commonService.doIHaveAnAccess('VETTING', 'READ')) {
      this.permissions.vetting = true;
    }
  }
  getSignManualList() {
    this.service.getGoverRecommendedBills().subscribe(data => {
      this.pendingList = data;
      this.totalPendingList = data;
    });
  }

  getBillsCompletedVetting() {
    this.service.getAllActs().subscribe(data => {
      this.completedList = data;
      this.totalCompletedList = data;
      console.log(data);
    });
  }
  searchPending() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.pendingFiltered = this.pendingList;
      this.pendingListFiltered = this.pendingList;
    }
    if (this.pendingSearch) {
      this.pendingList = this.pendingFiltered.filter(
        (element) =>
          (element.title && element.title.toLowerCase()
              .includes(this.pendingSearch.toLowerCase())) ||
          (element.status && element.status.toLowerCase()
              .includes(this.pendingSearch.toLowerCase()))||
              (element.biillNumber && element.biillNumber.toString()
                  .includes(this.pendingSearch.toLowerCase()))
      );
    } else {
      this.pendingList = this.totalPendingList;
    }
  }
  sendBillforVetting(billId) {
    this.showActModal = true;
    this.billId = billId;
  }
  searchCompleted() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.completedFiltered = this.completedList;
      this.completedListFiltered = this.completedList;
    }
    if (this.completedSearch) {
      this.completedList = this.completedFiltered.filter(
        (element) =>
          (element.name && element.name.toLowerCase()
              .includes(this.completedSearch.toLowerCase())) ||
          (element.status && element.status.toLowerCase()
              .includes(this.completedSearch.toLowerCase()))
      );
    } else {
      this.completedList = this.totalCompletedList;
    }
  }
  searchVetting() {
    const checkArray: any = [];
    for (const check of this.filterCheckboxes) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.vettingFiltered = this.vettingList;
      this.vettingListFiltered = this.vettingList;
    }
    if (this.searchKey) {
      this.vettingList = this.vettingFiltered.filter(
        (element) =>
          (element.title && element.title.toLowerCase()
              .includes(this.searchKey.toLowerCase())) ||
          (element.status && element.status.toLowerCase()
              .includes(this.searchKey.toLowerCase()))
      );
    } else {
      this.vettingList = this.totalVettingList;
    }
  }
  clearFilter() {
    this.filterSelected = {
      title: null
    };
    this.filterCheckboxes.forEach((element) => {
      {
        element.checked = false;
      }
    });
    this.searchVett(this.filterSelected);
    this.searchcompl(this.filterSelected);
    this.searchPend(this.filterSelected);
  }
  searchPend( filter: any) {
    if (!filter) {
      this.pendingList = this.totalPendingList;
    } else {
      this.pendingList = this.totalPendingList.filter((item: any) =>
        this.applyFilter(item, filter)
      );
      this.pendingFiltered = this.pendingList;
      this.pendingListFiltered = this.pendingList;
    }
  }
  searchcompl(filter: any) {
    if (!filter) {
      this.completedList = this.totalCompletedList;
    } else {
      this.completedList = this.totalCompletedList.filter((item: any) =>
        this.applyFilter(item, filter)
      );
      this.completedFiltered = this.completedList;
      this.completedListFiltered = this.completedList;
    }
  }
  searchVett(filter: any) {
    if (!filter) {
      this.vettingList = this.totalVettingList;
    } else {
      this.vettingList = this.totalVettingList.filter((item: any) =>
        this.applyFilter(item, filter)
      );
      this.vettingFiltered = this.vettingList;
      this.vettingListFiltered = this.vettingList;
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
  clearSearch() {
    this.searchKey = '';
    this.pendingSearch = '';
    this.completedSearch = '';
  }
  showLinks(id, listType) {
    if(listType === 'pending') {
      this.pendingList.forEach((element) => {
        if (element.id === id) {
          element.viewLinks = true;
        }
        else {
          element.viewLinks = false;
        }
      });
    } else if (listType === 'complete') {
      this.completedList.forEach((element) => {
        if (element.id === id) {
          element.viewLinks = true;
        }
        else {
          element.viewLinks = false;
        }
      });
    }
  }
  updateGovernerResponse() {
    const body = {
      action: this.selectRes,
      billId: this.billId,
      docUrl: this.attachmentDto && this.attachmentDto.length > 0 ? this.attachmentDto[0].attachmentUrl: '',
      reason: this.reason
    };
    this.billview.markBillFinalStatus(body).subscribe( data => {
      this.showActModal = false;
      this.notify.success('Success', 'Updated Response successfully');
      this.getSignManualList();
    });
  }
  handleChange(info: UploadChangeParam): void {
    const fileList = [...info.fileList];
    this.fileList = [];
    if (info.file.response) {
      for (const file of fileList) {
        this.fileList.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          type: 'ATTACHMENT',
        });
      }
    }
    this.attachmentDto = this.fileList;
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }
}
