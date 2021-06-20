import { Component, Inject, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { BillcommonService } from '../../shared/services/billcommon.service';

@Component({
  selector: 'lib-vetting',
  templateUrl: './vetting.component.html',
  styleUrls: ['./vetting.component.css']
})
export class VettingComponent implements OnInit {

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

  constructor(private service: BillManagementService,
              private commonService: BillcommonService,
              private notify: NzNotificationService,
              @Inject('authService') private AuthService) {
              this.currentUser = AuthService.getCurrentUser();
              this.commonService.setBillPermissions(this.currentUser.rbsPermissions);
    }

  ngOnInit() {
    this.getSignManualList();
    this.getRbsPermissionsinList();
    this.isLDC();
  }
  isLDC() {
    if (this.currentUser.authorities.includes('Department')) {
      this.getBillsForVetting();
    }
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
    this.service.getBillsSignManualList().subscribe(data => {
      this.pendingList = data;
      this.totalPendingList = data;
    });
  }
  getBillsForVetting() {
    this.service.getBillsForVetting().subscribe(data => {
      this.vettingList = data;
      this.totalVettingList = data;
      console.log(data);
    });
  }
  getBillsCompletedVetting() {
    this.service.getBillsCompletedVetting().subscribe(data => {
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
          (element.title && element.title .toLowerCase()
              .includes(this.pendingSearch.toLowerCase())) ||
          (element.status && element.status.toLowerCase()
              .includes(this.pendingSearch.toLowerCase()))
      );
    } else {
      this.pendingList = this.totalPendingList;
    }
  }
  sendBillforVetting(billId) {
    if (billId) {
      this.service.sentBillForVetting(billId).subscribe(data => {
        this.notify.success('Success', 'bill sent for vetting successfully');
        this.getSignManualList();
      });
    }
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
          (element.title && element.title .toLowerCase()
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
          (element.title && element.title .toLowerCase()
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
        if (element.bill.id === id) {
          element.viewLinks = true;
        }
        else {
          element.viewLinks = false;
        }
      });
    } else if (listType === 'complete') {
      this.completedList.forEach((element) => {
        if (element.bill.id === id) {
          element.viewLinks = true;
        }
        else {
          element.viewLinks = false;
        }
      });
    }
  }
}
