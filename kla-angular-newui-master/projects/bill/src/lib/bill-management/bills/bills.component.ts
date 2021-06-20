import { Component, OnInit, Inject } from "@angular/core";
import { BillManagementService } from "../../shared/services/bill-management.service";
import { UploadFile, NzNotificationService, NzModalService } from "ng-zorro-antd";
import { BillcommonService } from '../../shared/services/billcommon.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProrityListService } from '../../shared/services/prority-list.service';
import { FileServiceService } from '../../shared/services/file-service.service';


@Component({
  selector: "lib-bills",
  templateUrl: "./bills.component.html",
  styleUrls: ["./bills.component.css"],
})
export class BillsComponent implements OnInit {
  billid;
  assemblyId=null;
  sessionId=null;
  tabSelected='';
  fileCreateModel = false;
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  selectedCommittie = new FormControl('SELECT_COMMITTEE');
  assemblies = [];
  sessions = [];
  categorys = [];
  billDetails = null;
  modules: any;
  public Editor: any;
  showCreateBill = false;
  showViewBill = false;
  showEditBill = false;
  billList: any = [];
  allbillList: any = [];
  allFilteredBills: any;
  filteredBills: any;
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  priorityList = {
    assembly: null,
    session: null,
    categoryTitle: null,
    bills: []
  };
  requestErrata = {
    showpopUp: false,
    document: null,
    errataFile: "",
    showValidation: false,
    billId: null,
    viewFiles: false,
  };
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  sendMinistersMotion = {
    showpopUp: false,
    committee: "select",
    billId: [],
  };
  viewReport = {
    showpopUp : false,
    billDetails : null
  }
  colCheckboxes = [
    { id: 1, label: "Bill Number", check: true, disable: false },
    { id: 2, label: "Title Of Bill", check: true, disable: false },
    { id: 3, label: "Type Of Bill", check: true, disable: false },
    { id: 4, label: "Nature of Bill", check: true, disable: false },
    { id: 5, label: "Language", check: true, disable: false },
    { id: 6, label: "Hon'ble Minister", check: true, disable: false },
    { id: 7, label: "Department", check: true, disable: false },
    { id: 8, label: "Status", check: true, disable: false },
    { id: 9, label: "Act Reference", check: false, disable: true },
    { id: 10, label: "Old Act Reference", check: false, disable: true },
    { id: 11, label: "Ordinance", check: false, disable: true },
    { id: 12, label: "Governers Recommondation", check: false, disable: true },
    { id: 13, label: "Article No", check: false, disable: true },
    { id: 14, label: "subject", check: true, disable: false },
  ];
  billId;
  lobBillList:any =[];
  user: any;
  permissions = {
    create: false,
    allBills: false,
    update: false,
    fileView: false,
    billsForAction: false,
    addToBillRegister: false,
    createBulletin: false,
    viewBillRegister: false
  };
  billStatus;
  assignAssistant = {
    visible: false,
    billIds: [],
    searchPerson: null,
    assigneeId: null,
    assistantList: [],
    listofAssistants: []
  };
  motionHtmlContent = null;
  edit = false;
  bulletinData: any;
  showBulletinPart2Popup = false;
  resubmitFileDetails = {
    billId: null,
    fileId: null
  };
  fileStatus = null;
  maxNumber: any;
  maxValue: any;

  constructor(
    private billService: BillManagementService,
    private notification: NzNotificationService,
    private commonService: BillcommonService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject("authService") private AuthService,
    @Inject('notify') public notify,
    private priorityService: ProrityListService,
    private fileService: FileServiceService,
    private modalService: NzModalService
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setBillPermissions(this.user.rbsPermissions);
    this._setFilter();
  }
  ngOnInit() {
    this.getRbsPermissionsinList();
    this.setEditorConfig();
    // if (this.isAssistant() || this.isSectionOfficer()) {
    //   this.getBillsForAction();
    // } else {
    //   this.getBillsList();
    // }
    this.getAssistantList();
    this.selectedCommittie.valueChanges.subscribe(data => {
      this.processCommittie(data);
    });
    this.getAssemblySession();
    this.getBillsForFirstReading();
  }

  getAssemblySession() {
    forkJoin(
      this.commonService.getAllAssembly(),
      this.commonService.getAllSession(),
      this.priorityService.getPriorityLstCategories()
    ).subscribe(([assembly, session, categorys]) => {
      this.assemblies = assembly as Array<any>;
      const res = this.assemblies.map((x) => x.id);
      this.maxNumber = Math.max.apply(null, res);
      this.priorityList.assembly = this.maxNumber;
      this.sessions = session as Array<any>;
      const result = this.sessions.map((x) => x.id);
      this.maxValue = Math.max.apply(null, result);
      this.priorityList.session = this.maxValue;
      this.categorys = categorys as any[];

    });
  }
  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('BILLS', 'CREATE')) {
      this.permissions.create = true;
    }
    if (this.commonService.doIHaveAnAccess('BILLS', 'UPDATE')) {
      this.permissions.update = true;
    }
    if (this.commonService.doIHaveAnAccess('BILLS_FOR_ACTION', 'READ')) {
      this.permissions.billsForAction = true;
      this.getBillsForAction();
    }
    if (this.commonService.doIHaveAnAccess('ALL_BILLS', 'READ')) {
      this.permissions.allBills = true;
      if (!this.permissions.billsForAction) {
        this.getBillsList();
      }
    }
    if (this.commonService.doIHaveAnAccess('FILE', 'READ')) {
      this.permissions.fileView = true;
    }
    if (this.commonService.doIHaveAnAccess('BILLREGISTER', 'CREATE')) {
      this.permissions.addToBillRegister = true;
    }
    if (this.commonService.doIHaveAnAccess('BILLREGISTER', 'VIEW')) {
      this.permissions.viewBillRegister = true;
    }
    if (this.commonService.doIHaveAnAccess("BULLETIN", "CREATE")) {
      this.permissions.createBulletin = true;
    }
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Bill Number", key: "billNumber" },
      { label: "Title Of Bill", key: "title" },
      { label: "Type Of Bill", key: "type" },
      { label: "Nature of Bill", key: "natureOfBill" },
      { label: "Language", key: "language" },
      { label: "Hon'ble Minister", key: "minister" },
      { label: "Department", key: "department" },
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
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
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
          case "title":
            this.allbillList.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case "type":
            this.allbillList.forEach((value) => {
              element.data.push(value.type.split('_').join(' '));
            });
            break;
          case "billNumber":
              this.allbillList.forEach((value) => {
                element.data.push(value.billNumber);
              });
              break;
          case "natureOfBill":
              this.allbillList.forEach((value) => {
                element.data.push(value.natureOfBill);
              });
              break;
          case "language":
            this.allbillList.forEach((value) => {
              element.data.push(value.language);
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
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.type &&
            element.type
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billNumber  &&
            element.billNumber.toString() 
                  .includes(this.searchParam.toLowerCase())) ||    
          (element.language &&
            element.language
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.natureOfBill &&
            element.natureOfBill
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

  getBillsList() {
    this.tabSelected = 'all_bills';
    this.billStatus = null;
    this.billList = this.allbillList = [];
    this.clearFilter();
    this.searchParam = null;
    this.tableParams.colSpan = null;
    this.mapOfCheckedId = {};
    // let body = {
    //   departmentId: null,
    //   isGovernerRecommendation: null,
    //   isOrdinance: null,
    //   status: null,
    //   type: null,
    // };
    this.getListofBills();
  }
  getBillsForAction() {
    this.tabSelected = 'bills_for_action';
    this.billList = this.allbillList = [];
    this.clearFilter();
    this.searchParam = null;
    this.tableParams.colSpan = null;
    this.mapOfCheckedId = {};
    this.getListofBills();
  }
  getListofBills() {
    this.setStatusBasedOnRole();
    let body = {
      departmentId: null,
      isGovernerRecommendation: null,
      isOrdinance: null,
      status: this.billStatus,
      type: null,
    };
    this.billService.getAllBills(body).subscribe((arg: any) => {
      if(this.tabSelected = 'all_bills'){
        this.billList = this.allbillList = this.formatResponseOfAllBills(arg);
      }else{
        this.billList = this.allbillList = arg;
      }
      this.formatbillResponse();
    });
  }
  setStatusBasedOnRole() {
  if(this.tabSelected == 'bills_for_action'){
    if (this.isCreator()) {
      this.billStatus = ["SAVED"];
    }
    else if (this.isApprover()) {
       this.billStatus = ["UNDER_APPROVER"];
    }
    else if (this.isSectionOfficer()) {
      this.billStatus = ["ADMIT"];
    }
    else if (this.isAssistant()) {
      this.billStatus = ["WAITING_FOR_SUBMISSION"];
    }
  } else{
    this.billStatus = [];
  }
  }
  formatResponseOfAllBills(response){
   let statusArray = [];
   if(this.isPPO() || this.isMember()){
    statusArray =  ["APPROVED"];
    response =  response.filter(element=> statusArray.includes(element.status))
    return response;
        }
   else if (this.isCreator() || this.isApprover()) {
    return response;
  }
  else{
    statusArray =  ['ADMIT',"WAITING_FOR_SUBMISSION","APPROVED","SUBMITTED"];
     response =  response.filter(element=> statusArray.includes(element.status))
     return response;   
  }
  }
  formatbillResponse() {
    this.billList.forEach((element) => {
      if (element.language) {
        if (element.language == "MAL") {
          element.language = "MALAYALAM";
        } else {
          element.language = "ENGLISH";
        }
      }
      if (element.status) {
        if (element.status == "ADMIT") {
          element.status = "SENT TO LEGISLATION"; //ADMIT stauts showing as SENT TO LEGISLATION in front end.
        } 
      }
      if (element.ordinance == true) {
          element.ordinance = "YES";
        } else if (element.ordinance == false) {
          element.ordinance = "NO";
        }
      if (element.governerRecommendation == true) {
          element.governerRecommendation = "YES";
        } else if(element.governerRecommendation == false) {
          element.governerRecommendation = "NO";
        }
    });
    this.billList.forEach((element) => {
      element.viewLinks = false;
    });
  }

  showLinks(id, status) {
    this.edit = this.canEdit(status);
    if (this.tableParams.colSpan) {
      return;
    }
    this.billList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else {
        element.viewLinks = false;
      }
    });
  }
  isCreator() {
    return (this.permissions.create && this.user.authorities.includes("Department"));
  }
  isApprover() {
    return (!this.permissions.create && this.user.authorities.includes("Department"));
  }
  isSectionOfficer() {
    return (this.user.authorities.includes("sectionOfficer"));
  }
  isAssistant() {
    return (this.user.authorities.includes("assistant"));
  }
  isMember() {
    return (this.user.authorities.includes("MLA"));
  }
  isPPO() {
    return (
      this.AuthService.getCurrentUser().authorities.includes('ppo') ||
      this.AuthService.getCurrentUser().authorities.includes(
        'parliamentaryPartySecretary'
      )
    );
  }

  onCancelPopup() {
    this.filtrParams.showPriorityPopup = false;
    this.requestErrata.showpopUp = false;
    this.requestErrata.errataFile = null;
    this.requestErrata.viewFiles = false;
    this.requestErrata.showValidation = false;
    this.sendMinistersMotion.showpopUp = false;
  }
  // start add to priority list functions
  addToPriorityList() {
    this.filtrParams.showPriorityPopup = true;
  }
  onOKPriorityList() {
    if (
      this.priorityList.assembly &&
      this.priorityList.session &&
      this.priorityList.categoryTitle
    ) {
      let checkedArray = [];
      checkedArray = this.allbillList.filter(
        (item) => this.mapOfCheckedId[item.id]
      );
      this.priorityList.bills = checkedArray;
      let path = "../bill/create-priority-list";
      this.router.navigate([path], {
        relativeTo: this.route.parent,
        state: { data: this.priorityList }
      });
    }
    else {
      this.notification.error("Alert", "Select All Required Fields.")
      return;
    }

  }
  // end add to priority list functions

  // start request errata
  onRequestErrata(id) {
    this.requestErrata.showpopUp = true;
    this.requestErrata.billId = id;
  }
  onSaveErrata() {
    if (!this.requestErrata.errataFile) {
      this.requestErrata.showValidation = true;
      return;
    } else {
      let body = {
        billId: this.requestErrata.billId,
        content: this.requestErrata.errataFile,
      };
      this.billService.addErrata(body).subscribe((response: any) => {
        this.notification.create("success", "Saved Successfully", "");
        this.requestErrata.errataFile = null;
        this.requestErrata.showpopUp = false;
        this.getBillsList();
      });
    }
  }
  onSubmitErrata() {
    if (!this.requestErrata.errataFile) {
      this.requestErrata.showValidation = true;
      return;
    } else {
      let body = {
        billId: this.requestErrata.billId,
        content: this.requestErrata.errataFile,
      };
      this.billService.addErrata(body).subscribe((response: any) => {
      this.billService.sentErrataToApprover(response.id).subscribe((arg: any) => {
          this.notification.create("success", "Submitted Successfully", "");
          this.requestErrata.errataFile = null;
          this.requestErrata.showpopUp = false;
          this.getBillsList();
        });
      });
    }
  }
  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
      ]
    };
  }


  // end request errata

  // start Ministers Motion
  onSendMinistersMotion(data) {
    this.billDetails = data;
    let checkedArray = [];
    this.sendMinistersMotion.billId = [];
    if (data) {
      this.billDetails.ids = [data.id];
      this.billDetails.titles = [data.title];
    } else {
      checkedArray = this.allbillList.filter(
        (item) => this.mapOfCheckedId[item.id]
      );
      const ministerIds = checkedArray.map(x => Number(x.ministerId));
      const uniqueMinisters = [...new Set(ministerIds)];
      if (uniqueMinisters.length > 1) {
        this.notification.warning('Warning', 'please select bill with same minister');
        return;
      }
      this.billDetails = {};
      this.billDetails.ids = checkedArray.map(x => x.id);
      this.billDetails.titles = checkedArray.map(x => x.title);
      this.billDetails.minister = checkedArray[0].minister;
    }
    this.billDetails.committie = this.selectedCommittie.value;
    this.motionHtmlContent = this.billService.processMotionTemplate(this.billDetails);
    this.sendMinistersMotion.showpopUp = true;
  }

  viewMinistersMotion(billId) {
    this.router.navigate([
      'business-dashboard/bill/bill-view',
     billId,
    ], {
      state : {
        tabIndex : 2
      }
    });
  }

  processCommittie(committie) {
    this.billDetails.committie = committie;
    this.motionHtmlContent = this.billService.processMotionTemplate(this.billDetails);
  }
  onSubmitSendMinistersMotion() {
    const body = {
      content: this.motionHtmlContent,
      committeeType: this.selectedCommittie.value,
      billIds: this.billDetails.ids,
      ministerId: this.billDetails.ministerId
    };
    this.billService.createMinisterMotion(body).subscribe(data => {
      this.sendMinistersMotion.showpopUp = false;
      this.getBillsList();
      this.getAssistantList();
      this.notification.success('Success', 'Minister motion submitted successfully');
    });
  }

  // End ministers Motion

  // *****************************************************
  // Bill creation starts here //
  createBillPopup() {
    this.showCreateBill = true;
  }
  showCreateBillPopup(event) {
    this.showCreateBill = event;
  }

  // Bill creation Ends here

  // Bill   edit   starts here //
  editBillMetaform(billId) {
    this.billId = billId;
    this.showEditBill = true;
  }
  showEditBillPopup(event) {
    this.showEditBill = event;
    this.getBillsForAction();
  }
  // Bill  and edit  popup ends here //

  // navigate to view page
  bill_full_View(billId) {
      this.router.navigate([
        'business-dashboard/bill/bill-view',
        billId,
      ]);
  }
  bill_View(billId, type) {
    this.router.navigate([
      'business-dashboard/bill/registered-bill-view',
      billId, type
    ]);
  }
  gotoErrataView(billId) {
    this.router.navigate([
      'business-dashboard/bill/bill-view',
      billId,
    ], {
      state : {
        tabIndex : 1
      }
    });


  }
  editBillContent(billId) {
    if (billId) {
      this.router.navigate([
        "business-dashboard/bill/create-bill",
        billId,
      ]);
    }
  }
  // Bill   edit   ends here //

  // Assign to Assiantat //
  getAssistantList() {
    this.commonService.getAssisstantList(['LEGISLATION_ASSISTANT']).subscribe((Res: any) => {
    this.assignAssistant.assistantList= Res;
    this.assignAssistant.listofAssistants = this.assignAssistant.assistantList;
    });
  }
  assignToAssistant() {
    this.assignAssistant.visible = true;
  }

  onSubmitAssistant() {
    let checkedArray = [];
    checkedArray = this.allbillList.filter(
      (item) => this.mapOfCheckedId[item.id]
    );
    checkedArray.forEach(element => {
      if (element.id) {
        this.assignAssistant.billIds.push(element.id)
      }
    });
    let body = {
      actionTaken: this.user.userId,
      id: this.assignAssistant.billIds,
      assignedTo: this.assignAssistant.assigneeId
    };
    this.billService.assignToAssistant(body).subscribe((res: any) => {
      this.notification.create("success", "Success", "");
      this.assignAssistant.visible = false;
      this.assignAssistant.billIds = [];
      this.assignAssistant.assigneeId = null;
      this.getBillsForAction();
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
  //
  canEdit(status) {
    return (
      (this.isCreator() && status === 'SAVED') ||
      (this.isApprover() && status === 'UNDER_APPROVER') 
      // ||
      // (!this.user.authorities.includes('Department') &&
      //   this.permissions.update &&
      //   status === 'WAITING_FOR_SUBMISSION')
    );
  }
  showcreateFileModal(billId,assemblyId,sessionId) {
    this.fileCreateModel = true;
    this.billid = billId;
    this.assemblyId=assemblyId;
    this.sessionId=sessionId
  }
  createFile() {
    const body = {
      billId: this.billid,
      fileForm: {
        assemblyId: this.assemblyId? this.assemblyId :this.maxNumber,
        currentNumber: null,
        description: this.file.description,
        sessionId: this.sessionId ?this.sessionId: 0,
        status: "saved",
        subject: this.file.subject,
        activeSubTypes: ["BILL"],
        subtype: "BILL",
        type: "BILL",
        userId: this.user.userId,
        priority: this.file.priority,
      },
      priorityMasterId: 0,
    };
    let reqBody={
      id: [this.billid],
      actionTaken: this.user.userId,
    };
    this.billService.submitByAssistant(reqBody).subscribe((res: any) => {
    this.billService.createFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with file number :" + Res.fileResponse.fileNumber 
      );
      this.file = {
        subject: "",
        priority: null,
        description: "",
      };
      this.fileCreateModel = false;
      this.billid = null;
      this.router.navigate([
        "business-dashboard/bill/file-view",
        Res.fileResponse.fileId,
      ]);
    });
  });
  }
  handlePreviewCancel() {
    this.fileCreateModel = false;
  }
  addToBillRegister(billId, type) {
    // this.billId = billId;
    const body = {
      billId: billId
    };
    this.billService.addToRegister(body).subscribe((res: any) => {
      this.notification.success('Success', 'Bill Added To BillRegister Successfully');
      this.router.navigate([
        'business-dashboard/bill/registered-bill-view',
        billId, type,
      ]);
   });
  }

  createBulletinPart2(bill) {
    this.bulletinData = {
      businessId: bill.id,
      businessType: 'BILL',
      description: '',
      fileId: bill.fileId,
      part: '2',
      title: '',
      type: 'BILL',
      userId: this.user.userId,
      assemblyId: null,
      sessionId: null
    };
    this.resubmitFileDetails = {
      billId: bill.id,
      fileId: bill.fileId
    };
    this.fileService.getFileById(bill.fileId, this.user.userId).subscribe((res: any) => {
      this.fileStatus = res.fileResponse.status;
      if (this.fileStatus === 'APPROVED') {
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
    this.bulletinData = {};
  }

  afterCreateBulletin(event) {
    if (event) {
      this.notification.success('Success', 'Bulletin Created.');
      this.resubmitFile();
      // this.router.navigate(['business-dashboard/bill/file-view/', this.resubmitFileDetails.fileId]);
    }
    this.cancelBulletin();
  }

  resubmitFile() {
    const body = {
      fileForm: {
        fileId: this.resubmitFileDetails.fileId,
        activeSubTypes: ['BULLETIN'],
        type: 'BILL',
        userId: this.user.userId,
      }
    };
    this.billService.attachErrataToFile(body).subscribe((Res: any) => {
      this.router.navigate(['business-dashboard/bill/file-view/', 'bulletins', this.resubmitFileDetails.fileId]);
    });
  }

setToLOB(id) {
this.billService.setBillToLOB(id).subscribe((res)=>{
    this.notification.success('Success', 'Bill Set To LOB successfully');
    this.getBillsForFirstReading();
});
  }
  getBillsForFirstReading() {
    this.billService.getBillsReadyForFirstReading().subscribe((Res)=> {
      this.lobBillList=Res;
      this.lobBillList.forEach((element) => {
      element.viewLinks = false;
    });
    })
  }
  showLinksinLobBills(id){
     this.lobBillList.forEach((element) => {
      if (element.bill.id === id) {
        element.viewLinks = true;
      }
      else {
        element.viewLinks = false;
      }
    });
  }
  viewCommiteeReport(billData){
  this.viewReport.showpopUp = true;
  this.viewReport.billDetails = billData;
  }
  cancelReportPreview(event){
    this.viewReport.showpopUp = false;
    this.viewReport.billDetails = null;
  }
  sentforVetting(billId) {
    this.billService.sentBillForVetting(billId).subscribe(data => {
      this.notification.success('Success', 'Bill Sent to Lwt department successfully');
    });
  }
  // late document submission
  getBillsForLateDocSubmission() {
    this.tabSelected = 'bills_for_lateDocumentSubmition';
    this.billList = this.allbillList = [];
    this.clearFilter();
    this.searchParam = null;
    this.tableParams.colSpan = null;
    this.mapOfCheckedId = {};
    this.billService.getBillsForLateDocSubmission().subscribe(Response => {
      if(Response) {
        this.billList = this.allbillList = Response;
      }
    });
  }
}
