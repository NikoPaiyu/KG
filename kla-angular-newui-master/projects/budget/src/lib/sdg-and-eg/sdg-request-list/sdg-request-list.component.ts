import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CreateFileComponent } from '../../files/create-file/create-file.component';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';
import { SdgEgService } from '../../shared/services/sdg-eg.service';

@Component({
  selector: 'budget-sdg-request-list',
  templateUrl: './sdg-request-list.component.html',
  styleUrls: ['./sdg-request-list.component.css']
})
export class SdgRequestListComponent implements OnInit {
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
  
  user;
  
  filtrParams: any = {};
  openFilesave;
  assemblySession: object = [];
  colCheckboxes = [
    { id: 0, label: 'File No', check: true, disable: false },
    { id: 1, label: 'File subject', check: true, disable: false },
    { id: 2, label: 'Date', check: true, disable: false },
    { id: 3, label: 'Status', check: true, disable: false }
  ];
  showModel = { BSModel: false, fileCreateModel: false };
  paginationParams = { numberOfItem: 10, pageIndex: 0, total: 0 };
  coverLetterTitle = '';
  correspondance = { CoverLetterModel: false, coverLetterTitle: '', budgetId: '', type: 'BUDGET_DOCUMENT_LETTER', fileId: '' }
  createPopup = false;
  sdgRequest;
  memberCodes =[];
  constructor(
    private SdgEgService: SdgEgService,
    private notification: NzNotificationService,
    private commonService: BudgetCommonService,
    @Inject("authService") private AuthService,
    private modalService: NzModalService,private router: Router,
    public common: BudgetCommonService,

  ) {
  }
  ngOnInit() {
    this.getAssemblySession();
    this.getMemberCode()
  }
  getMemberCode() {
    let type = 'DEPARTMENT'
    this.common
      .getAllCode(type)
      .subscribe((Res: any) => {
        let deptCode = Res.filter(x => x.code == 'FINANCE');
        this.memberCodes = deptCode;
      });
  }
  getAssemblySession() {
    this.common.getAllAssembly().subscribe((assembly) => {
      this.common.getAllSession().subscribe((session) => {
        this.common.getCurrentAssemblyAndSession().subscribe((active) => {
          if (Array.isArray(session) && Array.isArray(assembly)) {
            this.assemblySession["assembly"] = assembly;
            this.assemblySession["session"] = session;
            this.assemblySession["assembly"].currentassembly = active['assemblyId'];
            this.assemblySession["session"].currentsession = active['sessionId'];
            this.assemblySession["assembly"].currentassemblyVal = active['assemblyValue'];
            this.assemblySession["session"].currentsessionVal = active['sessionValue'];
          }
          this.getrequestList();
        });
      });
    });
  }
  getrequestList() {
    this.SdgEgService.getAllSdgegReuqests(this.paginationParams).subscribe((res: any) => {
      if(res) {
        this.listOfDisplayData = this.listOfAllData = res ? res.content : [];
        this.paginationParams.total = res ? res.totalSize : 0;
        this.sortbyAssemblyAndSessionId(res.content);
      }
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
    this.getrequestList();
  }
  pageIndexChange(index) {
    this.paginationParams.pageIndex = index;
    this.getrequestList();
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
  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
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
  createSDGRequest(list){
    this.createPopup = true;
    this.sdgRequest= list
  }
  cancelSDG(event){
    this.createPopup = false;
    this.getrequestList();
  }
  showCreateFileModel(BDoc) {
    this.modalService.create({
      nzContent: CreateFileComponent,
      nzWidth: "500",
      nzFooter: null,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzClosable: true,
      nzComponentParams: {
        assemblySession: this.assemblySession,
        DataObj: BDoc,
        activeSubType: "BUDGET_SDG_EG_MASTER"
      },
    });
  }
  draftCorrespondece(list){
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: "BUDGET_SDG_EG_REQUEST_LETTER",
          type: "BUDGET",
          fileId: list.fileId,
          businessReferId: list.id,
          businessReferType: "BUDGET",
          businessReferSubType: "BUDGET",
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: list.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: this.memberCodes,
          toDisplayName: this.memberCodes,
          toEditable: true,
          // redirectToFile: true,
          // redirectToModule: 'BUDGET'
        },
      }
    );

  }
  cancelCnfrm(){}
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.listOfData.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else{
        element.viewLinks = false;
      }
    });
  }
  viewFile(id){
    this.router.navigate(["business-dashboard/budgets/file-view",id])
  }
}
