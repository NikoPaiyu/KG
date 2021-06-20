import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzModalService, NzNotificationService } from "ng-zorro-antd";
import { BillManagementService } from '../../shared/services/bill-management.service';
import { BillcommonService } from "../../shared/services/billcommon.service";
import { FileServiceService } from '../../shared/services/file-service.service';
import { BillAmendmentsService } from "../shared/bill-amendments.service";

@Component({
  selector: "lib-obj-intoduction-notices",
  templateUrl: "./obj-intoduction-notices.component.html",
  styleUrls: ["./obj-intoduction-notices.component.css"],
})
export class ObjIntoductionNoticesComponent implements OnInit {
  billid;
  billList: any = [];
  allbillList: any = [];
  allFilteredBills: any;
  filteredBills: any;
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "Notice Number", check: true, disable: false },
    { id: 2, label: "Memeber Name", check: true, disable: false },
    { id: 3, label: "Submitted Date", check: true, disable: false },
    { id: 4, label: "Bill Number", check: true, disable: false },
    { id: 5, label: "Title of Bill", check: true, disable: false },
    { id: 6, label: "Bill Owner", check: true, disable: false },
    { id: 7, label: "Notice Content", check: true, disable: false },
    { id: 8, label: "Status", check: true, disable: false },
  ];
  billId;
  user: any;
  permissions = {
    pendingObjection : false,
    approvedObjection: false,
    publishedObjection : false
  };
  billStatus;
  edit = false;
  bulletinData: any;
  noticeDetails;
  viewContentModel = false;
  isFileAttach;
  response;
  responsePermission = false;
  constructor(
    private billAmendmentsService: BillAmendmentsService,
    private notification: NzNotificationService,
    private commonService: BillcommonService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject("authService") private AuthService,
    @Inject("notify") public notify,
    private modalService: NzModalService,
    private billService: BillManagementService,
    private fileService: FileServiceService,
  ) 
  {
    this.user = AuthService.getCurrentUser();
    this.commonService.setBillPermissions(this.user.rbsPermissions);
    this._setFilter();
  }
  ngOnInit() {
    this.getRBSPermission();
    if(this.isAssistant()){
      this.getApprovedObjection();
    }else if(!this.permissions.pendingObjection && this.permissions.publishedObjection){
      this.getPublishedObjections();
    }
  }
  getRBSPermission(){
    if (this.commonService.doIHaveAnAccess('PENDING_OBJ_INTRO', 'READ')) {
      this.permissions.pendingObjection = true;
      this.getObjectionForAction();
    }
    if (this.commonService.doIHaveAnAccess('PUBLISHED_OBJ_INTRO','READ')) {
      this.permissions.publishedObjection = true;
      // this.getPublishedObjections();
    }
    if (this.commonService.doIHaveAnAccess('APPROVED_OBJ_INTRO','READ')) {
      this.permissions.approvedObjection = true;
    }
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Notice Number", key: "noticeNumber" },
      { label: "Member Name", key: "memberName" },
      { label: "Submitted Date", key: "createdDate" },
      { label: "Bill Number", key: "billNumber" },
      { label: "Title of Bill", key: "billTitle" },
      { label: "Bill Owner", key: "billMinisterName" },
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
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  showFilter(type) {
    this.filtrParams.rowFilter = type === "row" ? true : false;
  }
  get checkedFilters() {
    return this.filtrParams.tableDto.filter((ele) => ele.filtersel);
  }
  _confrmFilter(): void {
    if (this.filtrParams.rowFilter) {
      this._filterRows();
    }
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
          case "noticeNumber":
            this.allbillList.forEach((value) => {
              element.data.push(value.noticeNumber);
            });
            break;
          case "memberName":
            this.allbillList.forEach((value) => {
              element.data.push(value.memberName);
            });
            break;
          case "billNumber":
            this.allbillList.forEach((value) => {
              element.data.push(value.billNumber);
            });
            break;
          case "billTitle":
            this.allbillList.forEach((value) => {
              element.data.push(value.billTitle);
            });
            break;
          case "createdDate":
            this.allbillList.forEach((value) => {
              element.data.push(value.createdDate);
            });
            break; 
            case "billMinisterName":
              this.allbillList.forEach((value) => {
                element.data.push(value.billMinisterName);
              });
              break;  
          case "minister":
            this.allbillList.forEach((value) => {
              element.data.push(value.minister);
            });
            break;
          case "department":
            this.allbillList.forEach((value) => {
              element.data.push(value.department);
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
    if (count === this.filtrParams.tableDto.length) {
      this.filtrParams.tableDto.forEach((element) => {
        element.data = element.data.filter((v, i, a) => a.indexOf(v) === i);
      });
    }
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  searchBill() {
    const checkArray: any = [];
    for (const check of this.filtrParams.tableDto) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.filteredBills = this.allbillList;
      this.allFilteredBills = this.allbillList;
    }
    if (this.searchParam) {
      this.billList = this.filteredBills.filter(
        (element) =>
          (element.noticeNumber &&
            element.noticeNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.memberName &&
            element.memberName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billNumber.toString() &&
            element.billNumber
              .toString()
              .includes(this.searchParam.toLowerCase())) ||
          (element.createdDate &&
            element.createdDate
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billMinisterName &&
            element.billMinisterName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||    
          (element.billTitle &&
            element.billTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.minister &&
            element.minister
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.department &&
            element.department
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.billList = this.allFilteredBills;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.billList = this.allbillList;
    } else {
      this.billList = this.allbillList.filter((item: any) =>
        this.applyFilter(item, this.filtrParams.tableDto)
      );
      this.filteredBills = this.billList;
      this.allFilteredBills = this.billList;
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
  _checkAllRows(value: boolean): void {
    this.allbillList.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allbillList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.allbillList.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.billList.forEach((element) => {
        element.viewLinks = false;
      });
    }
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
  sort(sort: { key: string; value: string }): void {
    const data = this.allbillList.filter((item) => item);
    if (sort.key && sort.value) {
      this.billList = data.sort((a, b) =>
        sort.value === "ascend"
          ? (typeof a[sort.key!] === "number"
              ? a[sort.key!]
              : a[sort.key!].toLowerCase()) >
            (typeof b[sort.key!] === "number"
              ? b[sort.key!]
              : b[sort.key!].toLowerCase())
            ? 1
            : -1
          : (typeof b[sort.key!] === "number"
              ? b[sort.key!]
              : b[sort.key!].toLowerCase()) >
            (typeof a[sort.key!] === "number"
              ? a[sort.key!]
              : a[sort.key!].toLowerCase())
          ? 1
          : -1
      );
    } else {
      this.billList = data;
    }
  }

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
  getApprovedObjection() {
    this.clearTable();
    let status = "APPROVED"
    this.billAmendmentsService.getObjectionsByStatus(status).subscribe((arg: any) => {
      this.billList = this.allbillList = arg;
      this.formatbillResponse();
    });
  }
  getAllObjections() {
    this.clearTable();
    let status = ""
    this.billAmendmentsService.getObjectionsByStatus(status).subscribe((arg: any) => {
      this.billList = this.allbillList = arg;
      this.formatbillResponse();
    });
  }
  getObjectionForAction() {
    this.clearTable();
    this.billAmendmentsService
      .getAllPendingObjections()
      .subscribe((arg: any) => {
        this.billList = this.allbillList = arg;
        this.formatbillResponse();
      });
  }
  getPublishedObjections() {
    this.clearTable();
    this.billAmendmentsService
      .getPublishedObjections()
      .subscribe((arg: any) => {
        this.billList = this.allbillList = arg;
        this.formatbillResponse();
      });
  }
  clearTable(){
    this.billStatus = null;
    this.billList = this.allbillList = [];
    this.clearFilter();
    this.searchParam = null;
    this.tableParams.colSpan = null;
    this.mapOfCheckedId = {};
  }
  formatbillResponse() {
    this.billList.forEach((element) => {
      element.viewLinks = false;
    });
  }

  showLinks(id, status) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.billList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  isAssistant() {
    return this.user.authorities.includes("assistant");
  }
  isMember() {
    return this.user.authorities.includes("MLA");
  }


  // navigate to view page
  bill_full_View(billId) {
    this.router.navigate(["business-dashboard/bill/bill-view", billId]);
  }
  bill_View(billId, type) {
    this.router.navigate([
      "business-dashboard/bill/registered-bill-view",
      billId,
      type,
    ]);
  }
  noticeView(noticeId) {
    this.router.navigate([
      "business-dashboard/bill/obj-introduction-process-flow",
      noticeId,
    ]);
  }
  viewNoticeModal(notice,fileAttach){
   this.isFileAttach = fileAttach;
   this.noticeDetails = notice;
   this.viewContentModel = true;
   if( this.noticeDetails.status == 'SUBMITTED'){
    this.responsePermission = this.canIAddResponse();
   }
  }
  cancelContentModal(){
    this.viewContentModel = false;
  }
  canIAddResponse(){
   if(this.noticeDetails.billMinisterId == this.user.userId){
    if(this.noticeDetails.ministerResponse.length == 0){
      return true;
    }
    let currentRole = this.noticeDetails.ministerResponse.find((element) => element.ministerId === this.user.userId);
    if(currentRole){
        return false;
      }
    else{
        return true;
      }
    }
    else{
      return false;
    }
  }
  addResponse(){
    let body={
      ministerId: this.user.userId,
      objectionId: this.noticeDetails.id,
      response: this.response
    };
    this.billAmendmentsService
    .addMemberResponseOnObjection(body)
    .subscribe((arg: any) => {
      this.viewContentModel = false;
      this.notification.success("Success", "Response Added SucessFully");
     
      this.getPublishedObjections();
    });
  }
  confrmattachToFile(notice){
    let content;
    if(notice.billFileId){
    this.fileService.getFileById(notice.billFileId , this.user.userId).subscribe((res: any) => {
    const fileStatus = res.fileResponse.status;  
    if(fileStatus === 'APPROVED'){
      this.modalService.create({ 
        nzTitle: 'Attach to file',
        nzWidth :"500",
        nzContent: '&nbsp;&nbsp;<b >Are you sure to attach this notice to file : '+notice.billFileNumber+'</b>',
        nzOkText: 'Yes',
        nzOnOk: () => {this.attachtoFile(notice);},
        nzCancelText: 'No',
        nzOnCancel: () => {}
      });
    }else{
      content = '&nbsp;&nbsp;<b > Currently file is under approval flow.Cannot attach at this time ... </b>'
      this.modalService.create({
        nzTitle: 'Attach to file',
        nzWidth :"500",
        nzContent: content,
        nzOkText: 'OK',
        nzOnOk: () => {
        },
      });
    }
  });
  }
  }
  attachtoFile(notice){
    const body = {
      objectionToIntroId: notice.id,
      fileForm: {
        fileId: notice.billFileId,
        activeSubTypes: ["OBJECTION_TO_INTRODUCTION"],
        type:"BILL",
        userId: this.user.userId,
      }
    };
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "Success" 
      );
      this.router.navigate([
        "business-dashboard/bill/file-view",
        notice.billFileId,
      ]);
      this.getApprovedObjection();
      // this.viewErrata.showpopUp = false;
    });
  }
}
