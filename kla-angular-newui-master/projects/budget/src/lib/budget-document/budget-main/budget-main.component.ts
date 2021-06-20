import { Component, Inject, Input, OnInit } from '@angular/core';
import { NzNotificationService, UploadFile } from "ng-zorro-antd";
import { FileServiceService } from '../../shared/services/file-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetDocumentService } from '../../shared/services/budget-document.service';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';
import { CreateFileComponent } from '../../files/create-file/create-file.component';
import { NzModalService } from 'ng-zorro-antd';
import { CreateBudgetComponent } from './create-budget/create-budget.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'budget-budget-main',
  templateUrl: './budget-main.component.html',
  styleUrls: ['./budget-main.component.scss']
})
export class BudgetMainComponent implements OnInit {
  tableParams: any = { colSpan: false };
  today: any = new Date();
  isCreateBudgetDOc = false;
  isChecked = true;
  tablefiltrParams: any = { disable: {}, data: {} };
  isVisibleFilter = false;
  listOfData = [];
  listOfDisplayData = [];
  listOfAllData = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  mapOfCheckedId: { [key: string]: boolean } = {};
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  statusParam: any;
  sortbyId = false;
  fileList: UploadFile[] = [];
  user;
  budgetDOcForm: FormGroup;
  filtrParams: any = {};
  openFilesave;
  assemblySession: object = [];
  colCheckboxes = [
    { id: 0, label: 'Assembly', check: true, disable: false },
    { id: 1, label: 'Session', check: true, disable: false },
    { id: 2, label: 'Budget For Financial Year', check: true, disable: false },
    { id: 3, label: 'Introduction Date', check: true, disable: false },
    { id: 4, label: 'Action', check: true, disable: false },
    { id: 5, label: 'Action', check: true, disable: false },
    { id: 6, label: 'Status', check: true, disable: false }
  ];
  showModel = { BSModel: false, fileCreateModel: false };
  paginationParams = { numberOfItem: 10, pageIndex: 0, total: 0 };
  coverLetterTitle = '';
  correspondance = { CoverLetterModel: false, coverLetterTitle: '', budgetId: '', type: 'c1', fileId: '', budgtNature: ''}
  constructor(
    private budgetDOc: BudgetDocumentService,
    private file: FileServiceService,
    public common: BudgetCommonService,
    @Inject('authService') public auth,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private notify: NzNotificationService,
    private router: Router,

  ) {
    this.common.setBudgetPermissions(auth.getCurrentUser().rbsPermissions);
  }
  ngOnInit() {
    this.getAssemblySession();
  }
  getAssemblySession() {
        this.common.getAllAssemblyAndSession().subscribe((res) => {
          if (res) {
            this.assemblySession = res;
            this.assemblySession['assembly'].currentassembly = parseInt(res.activeAssemblySession.assemblyId);
            this.assemblySession['assembly'].currentassemblyLabel = parseInt(res.activeAssemblySession.assemblyValue);
            this.setSession();
            this.assemblySession['session'].currentsession = parseInt(res.activeAssemblySession.sessionId);
            this.assemblySession['session'].currentsessionLabel = parseInt(res.activeAssemblySession.sessionValue);
            this.getAllBudgets();
          }
    });
  }
  setSession() {
    const assemblyDetails = this.assemblySession['assemblySession'].find(x => x.id == this.assemblySession['assembly'].currentassembly);
    if (assemblyDetails) {
      this.assemblySession['session'] = assemblyDetails.session;
    }
  }
  findSessionListByAssembly() {
    const assemblyDetails =  this.assemblySession['assemblySession'].find(x => x.id == this.assemblySession['assembly'].currentassembly);
    if (assemblyDetails) {
      this.assemblySession['session'] = assemblyDetails.session;
    }
    this.assemblySession['session'].currentsession = null;
    this.listOfData = [];
    if(this.assemblySession['session'] && this.assemblySession['session'].currentsession) {
      this.getAllBudgets();
    }
  }
  getAllBudgets() {
    this.budgetDOc
    .getAllBudgets(this.paginationParams)
    // .pipe()
    .subscribe((res) => {
      if (res) {
        if (this.router.url.includes('budgets/approved-list')) {
          res.content = res.content.filter((el) => el.status == 'APPROVED');
        }
        this.listOfDisplayData = this.listOfAllData = res ? res.content : [];
        this.paginationParams.total = res ? res.totalSize : 0;
        res.content.forEach(list => {
          this.disableBtn(list);
        });
        this.sortbyAssemblyAndSessionId(res.content);
      }
    });
  }
  showCreateDocmodel(Budget) {
    if(!this.assemblySession['session'].currentsession) {
      this.notify.warning('Warning.', 'Please Select Assembly & Session');
      return;
    }
    this.modalService.create({
      nzContent: CreateBudgetComponent,
      nzWidth: "600",
      nzFooter: null,
      nzTitle: 'Create Budget',
      nzClosable: true,
      nzOnOk: () => { this.getAllBudgets() },
      nzComponentParams: {
        assemblySession: this.assemblySession,
        Budget: Budget
      },
    });
  }
  showCreateFileModel(Budget) {
    this.modalService.create({
      nzContent: CreateFileComponent,
      nzWidth: "500",
      nzFooter: null,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzClosable: true,
      nzComponentParams: {
        assemblySession: this.assemblySession,
        DataObj: Budget,
        activeSubType: "BUDGET_MASTER"
      },
    });
  }
  findAssembly(assemblyId) {
    if (this.assemblySession["assembly"])
      return this.assemblySession["assembly"].find(o => o.id === assemblyId).assemblyId;

  }
  findSession(sessionId) {
    if (this.assemblySession["session"])
      return this.assemblySession["session"].find(o => o.id === sessionId).sessionId;
  }
  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: 'Bill No', key: 'billNumber' },
      { label: 'Title Of Bill', key: 'billTitle' },
      { label: 'Type Of Bill', key: 'billType' },
      { label: 'File Number', key: 'fileNumber' },
      { label: 'No of Amendments', key: 'numberOfAmendments' },
      { label: 'Responded Members', key: 'numberOfAmendments' }
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
    this.filtrParams.showPriorityPopup = false;
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
  pageSizeChange(numberOfItem) {
    this.paginationParams.pageIndex = 0;
    this.paginationParams.numberOfItem = numberOfItem;
    this.getAllBudgets();
  }
  pageIndexChange(index) {
    this.paginationParams.pageIndex = index;
    this.getAllBudgets();
  }
  sortbyAssemblyAndSessionId(res) {
    this.listOfAllData = res.filter(
      (el) =>
        el.assemblyId == this.assemblySession["assembly"].currentassembly &&
        el.sessionId === this.assemblySession["session"].currentsession
    );
    this.listOfDisplayData = this.listOfAllData;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.onSearchUser();
    this.sortbyId = true;

  }
  _applyFilterForAssembly(res) {
    if (this.filterSelected) {
      this.searchCol(this.filterSelected);
    } else {
      if (this.sortbyId) {
        this.listOfData;
      } else {
        this.listOfData = res;
      }
    }
    this.sortbyId = false;
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  _showFilter(): void {
    this.isVisibleFilter = false;
    const tablefilter = this.tablefiltrParams.disable;
    tablefilter.fileSubjectdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "Notice Number"
    ).checked;
    tablefilter.processionUrldisable = this.filterCheckboxes.find(
      (element) => element.label === "Assembly"
    ).checked;
    tablefilter.statusdisable = this.filterCheckboxes.find(
      (element) => element.label === "Session"
    ).checked;
    this._loadSelectedfilterData();
  }
  _hideFilter(): void {
    this.isVisibleFilter = false;
    if (this.isVisibleFilter == false) {
      this.clearFilter();
    }
  }
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }
  search(): void {
    const filterFunc = (item: { name: string; age: number; address: string }) =>
      (this.searchAddress
        ? item.address.indexOf(this.searchAddress) !== -1
        : true) &&
      (this.listOfSearchName.length
        ? this.listOfSearchName.some((name) => item.name.indexOf(name) !== -1)
        : true);
    const data = this.listOfData.filter((item) => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.listOfData = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.listOfData = data;
    }
  }
  DoNothing() {
    return false;
  }
  clearFilter() {
    this.searchParam = "";
    localStorage.clear();
    this._setFilterValue();
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  onSearchUser() {
    this.searchCol(this.filterSelected);
    this.inputSearch();
  }
  inputSearch() {
    if (this.searchParam) {
      this.listOfData = this.listOfData.filter(
        (element) =>
          (element.motionOfThanks.noticeNumber &&
            element.motionOfThanks.noticeNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.assemblyValue.toString() &&
            element.assemblyValue.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    }
  }
  onSearch() {
    if (this.searchParam) {
      this.listOfData = this.listOfAllData.filter(
        (element) =>
              (element.note &&
                    element.note
                      .toLowerCase()
                      .includes(this.searchParam.toLowerCase())) ||
                      (element.introductoryDate &&
                        element.introductoryDate
                          .toLowerCase()
                          .includes(this.searchParam.toLowerCase()))  ||
                          (element.status &&
                            element.status
                              .toLowerCase()
                              .includes(this.searchParam.toLowerCase()))
          
      );
    }
    else {
      this.listOfData = this.listOfAllData;
    }
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.disable;
    switch (fliterNum) {
      case 1:
        tablefilter.fileSubjectdisable = false;
        this.filterSelected["NoticeNumber"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Notice Number") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.processionUrldisable = false;
        this.filterSelected["Assembly"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Assembly") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.statusdisable = false;
        this.filterSelected["Session"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Session") {
            element.checked = false;
          }
        });
        break;
      default:
        break;
    }
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    const tablefilter = this.tablefiltrParams.disable;
    const tablefiltrData = this.tablefiltrParams.data;
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    tablefilter.fileSubjectdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter1++;
        tablefiltrData.NoticeNumber.push(self.listOfAllData[key].motionOfThanks.noticeNumber);
        if (counter1 == self.listOfAllData.length) {
          tablefiltrData.NoticeNumber = tablefiltrData.NoticeNumber.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.processionUrldisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter2++;
        tablefiltrData.Assembly.push(self.listOfAllData[key].assemblyValue);
        if (counter2 == self.listOfAllData.length) {
          tablefiltrData.Assembly = tablefiltrData.Assembly.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.statusdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter3++;
        tablefiltrData.Session.push(self.listOfAllData[key].sessionValue);
        if (counter3 == self.listOfAllData.length) {
          tablefiltrData.Session = tablefiltrData.Session.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
  }
  searchCol(filter: any) {
    if (!filter) {
      this.listOfData = this.listOfAllData;
    } else {
      this.listOfData = this.listOfAllData.filter((item: any) =>
        this.applyFilter(item, filter)
      );
    }
    this.inputSearch();
  }
  applyFilter(element: any, filter: any): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === "string") {
          if (
            !element[field] ||
            element[field]
              .toLowerCase()
              .indexOf(filter[field].toLowerCase()) === -1
          ) {
            return false;
          }
        } else if (typeof filter[field] === "number") {
          if (element[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  showModal(): void {
    this.isVisibleFilter = true;
  }
  _setFilterValue() {
    this.tablefiltrParams.disable = {
      fileSubjectdisable: false,
      processionUrldisable: false,
      statusdisable: false
    };
    this.tablefiltrParams.data = {
      NoticeNumber: [],
      Assembly: [],
      Session: []
    };
    this.filterCheckboxes = [
      { label: "Notice Number", checked: false },
      { label: "Assembly", checked: false },
      { label: "Session", checked: false },
    ];
    this.filterSelected = {
      NoticeNumber: null,
      Assembly: null,
      Session: null
    };
  }
  showCreateLetterForm(budget) {
    this.correspondance.CoverLetterModel = true;
    this.correspondance.budgetId = budget.id;
    this.correspondance.fileId = budget.fileId;
    this.correspondance.type = budget.type;
    this.correspondance.budgtNature = budget.nature;
  }
  createCoverLetter() {
    let type = 'DEPARTMENT'
    this.common
      .getAllCode(type)
      .subscribe((Res: any) => {
        let deptCode = Res.filter(x => x.code == 'FINANCE');
        this.draftCorrespondence(deptCode);
      });
  }
  draftCorrespondence(deptCode) {
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: this.buildCorrespondanceData(deptCode),
      }
    );
  }
  buildCorrespondanceData(deptCode) {
    if (this.getBusiness() == '') {
      this.notify.warning('Warning.', 'No Business Found');
      return;
    }
    return ({
      business: this.getBusiness(),
      type: "BUDGET",
      fileId: this.correspondance.fileId,
      businessReferId: this.correspondance.budgetId,
      businessReferType: "BUDGET",
      businessReferSubType: this.getBusiness(),
      businessReferValue: this.correspondance.coverLetterTitle,
      businessReferNumber: null,
      businessReferName: null,
      fileNumber: "",
      departmentId: null,
      masterLetter: null,
      refrenceLetter: null,
      toCode: deptCode,
      toDisplayName: deptCode,
      toEditable: true,
      redirectToFile: true,
      redirectToModule: 'BUDGET'
    })
  }
  getBusiness() {
    let business = '';
    switch (this.correspondance.type) {
      case 'c1':
        business = "BUDGET_DOCUMENT_LETTER"
        break;
      case 'c2':
        business = (this.correspondance.budgtNature == 'COMPLETE') ? "BUDGET_SDFG_LETTER" : "BUDGET_VOA_LETTER"
        break;
      case 'c3':
        business = "BUDGET_AP_BILL_REQUEST"
        break;
      case 'c4':
        business = "VOA_AP_BILL_REQUEST"
        break;
    }
    return business;
  }
  showLinks(id,) {
    this.listOfData.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else {
        element.viewLinks = false;
      }
    });
  }
  isApprovedList() {
    if (this.router.url.includes('budgets/approved-list')) {
      return true;
    }
    return false;
  }
  addSpeechToLOB(list) {
    this.budgetDOc.addSpeechToLOB(list.id).subscribe((res: any) => {
      this.notify.success('Success', 'Speech Added to LOB');
      this.getAllBudgets();
    });
  }
  publishSpeech(list) {
    this.budgetDOc.publishSpeech(list.id).subscribe((res: any) => {
      this.notify.success('Success', 'Speech Published SuccessFully');
      this.getAllBudgets();
    });
  }
  cancelCnfrm() { }
  _desideLabel(list) {
    if (list.nature) {
      if (list.stage == 'VOA_CUT_MOTION_LOB_PASSED') {
        return 'Request AP Bill On VOA'
      }
      if (list.stage == 'SDFG_CUT_MOTION_LOB_PASSED') {
        return 'Request AP Bill On Budget'
      }
      if (list.nature == 'INTERIM') {
        return 'Attach VOA Letter'
      }
      if (list.nature == 'COMPLETE') {
        return 'Attach SDFG Letter'
      }
    }
    return 'NILL'
  }
  disableBtn(list) {
    list.type = 'c1';
    if (list.stage === 'PUBLISHED') {
      list.type = 'c2';
      return false
    }
    if (list.stage == 'SDFG_CUT_MOTION_LOB_PASSED') {
      list.type = 'c3';
      return false
    }
    if (list.stage == 'VOA_CUT_MOTION_LOB_PASSED') {
      list.type = 'c4';
      return false
    }
    return true;
  }
}


