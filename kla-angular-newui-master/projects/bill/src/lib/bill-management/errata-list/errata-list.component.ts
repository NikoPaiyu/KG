import { Component, OnInit, Inject } from "@angular/core";
import { NzNotificationService, NzModalService } from "ng-zorro-antd";
import { BillcommonService } from "../../shared/services/billcommon.service";
import { BillManagementService } from "../../shared/services/bill-management.service";
import { Router } from '@angular/router';
import { FileServiceService } from '../../shared/services/file-service.service';

@Component({
  selector: "lib-errata-list",
  templateUrl: "./errata-list.component.html",
  styleUrls: ["./errata-list.component.css"],
})
export class ErrataListComponent implements OnInit {
  rbsPermission = {
    create: false,
    createBulletin:false
  };
  expandSet = new Set<number>();
  modules: any;
  actionTitle ="business-dashboard.bill-management.erratalist.errataforaction"
  userId = null;
  AllErrataView = true;
  errtaStatus;
  errataList: any = [];
  allErrataList: any = [];
  allFilteredErrata: any;
  filteredErrata: any;
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: 'Title Of Bill', check: true, disable: false },
    { id: 2, label: "Type Of Bill", check: true, disable: false },
    { id: 3, label: "Date of Erratum", check: true, disable: false },
    { id: 4, label: "No of Erratums", check: true, disable: false },
    { id: 5, label: "Status", check: true, disable: false },
  ];
  colErrataforactn = [
    { id: 1, label: 'Date of Erratum', check: true, disable: false },
    { id: 2, label: "Errata Content", check: true, disable: false },
    { id: 3, label: "Title Of Bill", check: true, disable: false },
    { id: 4, label: "Status", check: true, disable: false },
  ];
  billId;
  user: any;
  viewErrata = {
    showpopUp: false,
    content: null,
    showValidation: false,
    id: null,
    isEdit: false,
    billId:null,
    oldContent: null,
    billFileId: null,
    billFileNumber : null,
    billFileStatus : null
  };
  assignAssistant = {
    visible: false,
    errIds: [],
    searchPerson: null,
    assigneeId: null,
    assistantList: [],
    listofAssistants: []
  };
  bulletinData: any;
  showBulletinPart2Popup = false;
  // fileCreateModel = false;
  // file = {
  //   subject: "",
  //   priority: null,
  //   description: "",
  //   billId:null
  // };
  errataViewText = 'View Errata';
  constructor(
    private billService: BillManagementService,
    private notification: NzNotificationService,
    private commonService: BillcommonService,
    private router: Router,
    @Inject("authService") private AuthService,
    @Inject("notify") public notify,
    private modalService: NzModalService,
    private fileService: FileServiceService,
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setBillPermissions(this.user.rbsPermissions);
    this._setFilter();
  }
  ngOnInit() {
    this.getRbsPermissionsinList();
    // if(this.isApprover() || this.isCreator() || this.isAssistant()){
    //   this.getAllErrataList();
    // }
    // else {
      this.getErrataForAction();
    // }
    this.setEditorConfig();
    this.getAssistantList();
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess("BILLS", "CREATE")) {
      this.rbsPermission.create = true;
    }
    if (this.commonService.doIHaveAnAccess("BULLETIN", "CREATE")) {
      this.rbsPermission.createBulletin = true;
    }
  }
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    let tableDataMdl = []
    if(this.AllErrataView){
     tableDataMdl = [
      { label: "Title Of Bill", key: "billTitle" },
      { label: "Type Of Bill", key: "billType" },
      { label: "Date of Erratum", key: "date" },
      { label: "No of Erratums", key: "numberOfErrata" },
      { label: "Status", key: "status" },
     ];

   }else{
    tableDataMdl = [
      { label: "Title Of Bill", key: "billTitle" },
      { label: "Date of Erratum", key: "createdDate" },
      { label: "Status", key: "status" },
    ];
   }
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
          case "billTitle":
            this.allErrataList.forEach((value) => {
              element.data.push(value.billTitle);
            });
            break;
          case "billType":
            this.allErrataList.forEach((value) => {
              element.data.push(value.billType);
            });
            break;
          case "date":
            this.allErrataList.forEach((value) => {
              element.data.push(value.date);
            });
            break;
          case "numberOfErrata":
            this.allErrataList.forEach((value) => {
              element.data.push(value.numberOfErrata);
            });
            break;
          case "status":
            this.allErrataList.forEach((value) => {
              element.data.push(value.status);
            });
            break;
          case "createdDate":
            this.allErrataList.forEach((value) => {
              element.data.push(value.createdDate);
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
  searchonErrata() {
    const checkArray: any = [];
    for (const check of this.filtrParams.tableDto) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.filteredErrata = this.allErrataList;
      this.allFilteredErrata = this.allErrataList;
    }
    if (this.searchParam) {
      this.errataList = this.filteredErrata.filter(
        (element) =>
          (element.billTitle &&
            element.billTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billType &&
            element.billType
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.date &&
            element.date
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.numberOfErrata &&
            element.numberOfErrata == this.searchParam) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.errataList = this.allFilteredErrata;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.errataList = this.allErrataList;
    } else {
      this.errataList = this.allErrataList.filter((item: any) =>
        this.applyFilter(item, this.filtrParams.tableDto)
      );
      this.filteredErrata = this.errataList;
      this.allFilteredErrata = this.errataList;
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
    this.allErrataList.forEach(
      (item) => (this.mapOfCheckedId[item.id] = value)
    );
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allErrataList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.allErrataList.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.errataList.forEach((element) => {
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
  get checkedFilters() {
    return this.filtrParams.tableDto.filter((ele) => ele.filtersel);
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.allErrataList.filter((item) => item);
    if (sort.key && sort.value) {
      this.errataList = data.sort((a, b) =>
        sort.value === "ascend"
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
      this.errataList = data;
    }
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
  disableCheckBoxOnerrataActn() {
    let count = 0;
    for (const box of this.colErrataforactn) {
      if (box.check) {
        count++;
      }
    }
    if (count === 6) {
      for (const box of this.colErrataforactn) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colErrataforactn) {
        box.disable = false;
      }
    }
  }
  getAllErrataList() {
    this.AllErrataView = true;
    this.errataList = this.allErrataList = [];
    this.clearFilter();
    this.searchParam = null;
    this.tableParams.colSpan = null;
    this.mapOfCheckedId = {};
    this.billService.getAllErrata().subscribe((arg: any) => {
      this.errataList = this.allErrataList = arg;
    });
    this.errataList.forEach((element) => {
      element.viewLinks = false;
      element.expand = false;
    });
  }
  getErrataForAction() {
    this.AllErrataView = false;
    this.errataList = this.allErrataList = [];
    this.clearFilter();
    this.searchParam = null;
    this.tableParams.colSpan = null;
    this.mapOfCheckedId = {};
    this.setStatusBasedOnRole();
    let body = {
      status: this.errtaStatus,
      userId: this.userId,
    };
    this.billService.getErrataForAction(body).subscribe((arg: any) => {
      this.errataList = this.allErrataList = arg;
    });
    this.errataList.forEach((element) => {
      element.viewLinks = false;
    });
  }

  setStatusBasedOnRole() {
    if (this.isCreator()) {
      this.errtaStatus = "SAVED";
      this.userId = this.user.userId;
    } else if (this.isApprover()) {
      this.errtaStatus = "UNDER_APPROVER";
    } else if (this.isSectionOfficer()) {
      this.errtaStatus = "ADMIT";
    } else if (this.isAssistant()) {
      this.errtaStatus = "WAITING_FOR_SUBMISSION";
    } else{
      this.actionTitle = "bill.bill-clause.list.allerratas"
      this.errtaStatus = "PUBLISHED";
    }
  }
  isCreator() {
    return (
      this.rbsPermission.create && this.user.authorities.includes("Department")
    );
  }
  isApprover() {
    return (
      !this.rbsPermission.create && this.user.authorities.includes("Department")
    );
  }
  isSectionOfficer() {
    return this.user.authorities.includes("sectionOfficer");
  }
  isAssistant() {
    return this.user.authorities.includes("assistant");
  }
  isMember() {
    return (this.user.authorities.includes("MLA"));
  }
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    if (this.AllErrataView) {
      this.errataList.forEach((element) => {
        if (element.billId === id) {
          element.viewLinks = true;
        } else {
          element.viewLinks = false;
        }
      });
    } else {
      this.errataList.forEach((element) => {
        if (element.id === id) {
          element.viewLinks = true;
        } else {
          element.viewLinks = false;
        }
      });
    }
  }
  showAllErrata(id){
    this.errataList.forEach((element) => {
      if (element.billId === id) {
        element.expand = !element.expand;
      }
    });
  }
  bill_errata_View(billId){
    this.router.navigate([
      "business-dashboard/bill/bill-view",
     billId,
    ],{
      state : {
        tabIndex : 1
      }
    });
}
bill_full_View(billId){
  this.router.navigate([
    "business-dashboard/bill/bill-view",
   billId,
  ]);
}
setEditorConfig() {
  this.modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],  
      ['link'], 
      [{ 'list': 'ordered' }, { 'list': 'bullet'}],
      [{ 'indent': '-1'}, { 'indent': '+1' }], 
    ]
  };
}
  viewandEditErrta(errata) {
    this.viewErrata.showpopUp = true;
    this.viewErrata.content = this.viewErrata.oldContent = errata.content;
    this.viewErrata.id = errata.id;
    this.viewErrata.billId = errata.billId;
    this.viewErrata.billFileId= errata.billFileId;
    this.viewErrata.billFileNumber= errata.billFileNumber;
    this.viewErrata.billFileStatus = errata.billFileStatus;
  }
  onCancelPopup() {
    this.viewErrata.showpopUp = false;
    this.viewErrata.content = null;
    this.viewErrata.id = null;
    this.viewErrata.isEdit = false;
  }
  onErrataEdit() {
    this.viewErrata.isEdit = true;
  }
  onUpdateErrata() {
    if (!this.viewErrata.content) {
      this.viewErrata.showValidation = true;
      return;
    } else {
      let body={
        billId : this.viewErrata.billId,
        content : this.viewErrata.content,
        id : this.viewErrata.id
      };
      this.billService.addErrata(body).subscribe((response: any) => {
      this.notification.create("success", "Success", "");
      this.viewErrata.isEdit = false;
      this.viewErrata.oldContent =this.viewErrata.content;
      this.getErrataForAction();
      });
    }
  }
  onCanelEdit(){
    this.viewErrata.content = this.viewErrata.oldContent;
    this.viewErrata.isEdit = false;
  }
  sentToApprover(errId) {
    this.billService.sentErrataToApprover(errId).subscribe((arg: any) => {
      this.notification.create("success", "Success", "");
      this.onCancelPopup(); 
      this.getErrataForAction();
    });
  }
  sentToSection(list) {
    if(list.correspondenceId) {
      this.billService.sentErrataToSection(list.id).subscribe((arg: any) => {
      this.notification.create("success", "Success", "");
      this.onCancelPopup();
      this.getErrataForAction();
      });
    } else { this.notification.warning("Warning", "Attach covering letter to continue!");}
  }

  // Assign to assistant
  getAssistantList() {
    this.commonService.getAssisstantList(['LEGISLATION_ASSISTANT']).subscribe((Res:any) => {
    this.assignAssistant.assistantList = Res;
    this.assignAssistant.listofAssistants = this.assignAssistant.assistantList;
    });
  }
  assignToAssistant() {
    this.assignAssistant.visible = true;
  }

  onSubmitAssistant() {
    let checkedArray = [];
    checkedArray = this.allErrataList.filter(
      (item) => this.mapOfCheckedId[item.id]
    );
    checkedArray.forEach(element => {
      if (element.id) {
        this.assignAssistant.errIds.push(element.id)
      }
    });
    let body = {
      actionTaken: this.user.userId,
      id: this.assignAssistant.errIds,
      assignedTo : this.assignAssistant.assigneeId
    };
    this.billService.assignErratatoAssistant(body).subscribe((res: any) => {
      this.notification.create("success", "Success", "");
      this.assignAssistant.visible = false;
      this.assignAssistant.errIds = [];
      this.assignAssistant.assigneeId = null;
      this.getErrataForAction();
    });
  }
  onCancelAssistant() {
    this.assignAssistant.visible = false;
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

  attachErratatoFile(errata) {
    let content;
    if(errata.billFileId == null){
      content = '&nbsp;&nbsp;<b > Currently bill is not added to file..Cannot attach at this time ... </b>'
      this.generateAttchFileConfm(content);
      return;
    }
    if(errata.billFileStatus && errata.billFileStatus == 'APPROVED'){
    this.modalService.create({
      nzTitle: 'Attach to file',
      nzWidth :"500",
      nzContent: '&nbsp;&nbsp;<b >Are you sure to attach this errata to file : '+errata.billFileNumber+'</b>',
      nzOkText: 'Yes',
      nzOnOk: () => {this.attachtoFile(errata);},
      nzCancelText: 'No',
      nzOnCancel: () => {}
    });
  } else {
    content = '&nbsp;&nbsp;<b > Currently file is under approval flow.Cannot attach at this time ... </b>'
    this.generateAttchFileConfm(content);
  }
  }
  generateAttchFileConfm(content){
    this.modalService.create({
      nzTitle: 'Attach to file',
      nzWidth :"500",
      nzContent: content,
      nzOkText: 'OK',
      nzOnOk: () => {
      },
    });
  }
  attachtoFile(errata){
    const body = {
      errataId: errata.id,
      fileForm: {
        fileId: errata.billFileId,
        activeSubTypes: ["ERRATA"],
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
        "business-dashboard/bill/file-view", 'errata',
        errata.billFileId,
      ]);
      this.getErrataForAction();
      this.viewErrata.showpopUp = false;
    });
  }
  errataListOnRole(errata) {
    if(this.isAssistant()){
      return errata.filter((element) => !(element.status == "SAVED" || element.status == "UNDER_APPROVER"));
    }else{
      return errata;
    }
  }
  createBulletinPart2(errata) {
    this.bulletinData = {
      businessId: errata.id,
      businessType: 'ERRATA',
      description: '',
      fileId: errata.fileId,
      part: '2',
      title: '',
      type: 'ERRATA',
      userId: this.user.userId,
      assemblyId: null,
      sessionId: null
    };
    this.fileService.getFileById(errata.fileId, this.user.userId).subscribe((res: any) => {
      const fileStatus = res.fileResponse.status;
      if (fileStatus === 'APPROVED') {
        this.showBulletinPart2Popup = true;
      } else {
        this.modalService.create({
          nzTitle: 'Create Bulletin Part 2',
          nzWidth : '500',
          nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot create bulletin now... </b>',
          nzOkText: 'OK',
          nzOnOk: () => {},
        });
      }
    });
  }

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
  }

  afterCreateBulletin(event) {
    if (event) {
      this.getAllErrataList();
      this.notification.success('Success', 'Bulletin Created.');
      this.resubmitFile();
    }
    this.cancelBulletin();
  }
  resubmitFile() {
    const body = {
      fileForm: {
        fileId: this.bulletinData.fileId,
        activeSubTypes: ['BULLETIN'],
        type: 'BILL',
        userId: this.user.userId,
      }
    };
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
      this.router.navigate(['business-dashboard/bill/file-view/', 'bulletins', this.bulletinData.fileId]);
    });
  }
  // Eratta Covering letter
  draftCorrespondance(errattaId) {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "BILL_ERRATA_LETTER",
          type: "LEGISLATION_SECTION",
          fileId: null,
          businessReferId: errattaId,
          businessReferType: "ERRATA",
          businessReferSubType: "BILL_ERRATA_LETTER",
          businessReferValue: "Erratta Covering letter",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: null,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: 'LEGISLATION_SECTION',
          toDisplayName: 'Legislation Section',
          // toEditable: true,
          // toTypable : true
        },
      }
    );
  }
  // view covering letter
  viewCorrespondance(corresId){
    this.router.navigate(["business-dashboard/correspondence/correspondence", "view", corresId]);
  }
  // permission to carete covering letter
  doIHaveAccess(category, action) {
    return this.commonService.doIHaveAnAccess(category , action);
  }
}
