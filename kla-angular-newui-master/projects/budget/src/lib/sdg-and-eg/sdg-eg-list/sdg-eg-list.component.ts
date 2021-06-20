import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { SdfgPreViewComponent } from '../../budget-document/stmt-demands-grants/sdfg-preview/sdfg-preview.component';
import { CreateFileComponent } from '../../files/create-file/create-file.component';
import { BudgetDocumentService } from '../../shared/services/budget-document.service';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';
import { SdgEgService } from '../../shared/services/sdg-eg.service';

@Component({
  selector: 'budget-sdg-eg-list',
  templateUrl: './sdg-eg-list.component.html',
  styleUrls: ['./sdg-eg-list.component.css']
})
export class SdgEgListComponent implements OnInit {

  isChecked = true;
  budgetfiltrParams: any = { disable: {}, data: {} };
  isVisibleFilter = false;
  listOfData = [];
  listOfDisplayData = [];
  listOfAllData = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  statusParam: any;
  sortbyId = false;
  assemblySession: object = [];
  paginationParams = { numberOfItem: 10, pageIndex: 0, total: 50 };
  tblParams = { isPublishedView: false, isApprovedView: false, isAllView: false, pageTitle: '', canCreateSDGEG: false,viewFrom:'FINANCE' }
  correspondance = { CoverLetterModel: false, coverLetterTitle: '', sdgegId: '', type: 'c1', fileId: ''}
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private common: BudgetCommonService,
    private budgetDoc: BudgetDocumentService,
    private sdgeg: SdgEgService,
    private modalService: NzModalService,
    @Inject('authService') public auth,
  ) {
    this._setFilterValue();
  }
  ngOnInit() {
    this.getAssemblySession();
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
          this.canBudgetSDGEG();
          this.renderList();
        });
      });
    });
  }
  renderList() {
     if (this.router.url.includes('budgets/sdgeg/received-list')) {
      this.tblParams.isApprovedView = true;
      this.tblParams.viewFrom = 'TABLE_SECTION';
      this.tblParams.pageTitle = 'Received SDG/EG List';
      this.getReceivedList();
      return;
    } if (this.router.url.includes('budgets/sdgeg/received-on-legislation')) {
      this.tblParams.isApprovedView = true;
      this.tblParams.viewFrom = 'LEGISLATION_SECTION'
      this.tblParams.pageTitle = 'SDG/EG List';
      this.getReceivedListOnLegislation();
      return;
    }if (this.router.url.includes('budgets/sdgeg/published')) {
      this.tblParams.isApprovedView = true;
      this.tblParams.viewFrom = 'MEMBER/PPO'
      this.tblParams.pageTitle = 'Published SDG/EG List';
      this.getPublishedSDGEG();
      return;
    }
    this.tblParams.pageTitle = 'SDG/EG List'
    this.tblParams.isAllView = true;
    this.getSDGEGList();
  }
  canBudgetSDGEG() {
    if (this.listOfData.length === 0) {
      this.tblParams.canCreateSDGEG = true;
      return;
    }
    this.tblParams.canCreateSDGEG = this.listOfData.find(o => o.status === "SAVED");
  }
  getAllApprovedSDGEG() {
  }
  getPublishedSDGEG() {
    this.sdgeg.getPublishedSDGEGWithPagination(this.paginationParams).subscribe((res: any) => {
        this.listOfDisplayData = this.listOfAllData = res ? res : [];
        this.paginationParams.total = res ? res.totalSize : 0;
        this.sortbyAssemblyAndSessionId(res); 
    });
  }
  getSDGEGList() {
    this.sdgeg.getAllSDGEG(this.paginationParams).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res ? res.content : [];
      this.paginationParams.total = res ? res.totalSize : 0;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  getReceivedList(){
    this.sdgeg.getAllSDGEGReceived(this.paginationParams).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res ? res.content : [];
      this.paginationParams.total = res ? res.totalSize : 0;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  getReceivedListOnLegislation(){
    this.sdgeg.getReceivedListOnLegislation(this.paginationParams).subscribe((res: any) => {
      if(res.content){
        // let avoidedStages =["CREATED","UNDER_TABLE_SECTION","APPROVED","LOB_ADDED"]
        // res.content = res.content.filter(data=>!avoidedStages.includes(data.stage))
        this.listOfDisplayData = this.listOfAllData = res ? res.content : [];
        this.paginationParams.total = res ? res.totalSize : 0;
        this.sortbyAssemblyAndSessionId(res);
      }  
    });
  }
  publishSDGEG(sdfgId) {
  }
  sortbyAssemblyAndSessionId(res) {
    // this.listOfAllData = res.filter(
    //   (el) =>
    //     el.assemblyId == this.assemblySession["assembly"].currentassembly &&
    //     el.sessionId === this.assemblySession["session"].currentsession
    // );
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
    const tablefilter = this.budgetfiltrParams.disable;
    tablefilter.fileNumberdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "File Number"
    ).checked;
    tablefilter.fileSubjectdisable = this.filterCheckboxes.find(
      (element) => element.label === "File Subject"
    ).checked;
    tablefilter.createdOndisable = this.filterCheckboxes.find(
      (element) => element.label === "created On"
    ).checked;
    tablefilter.statusdisable = this.filterCheckboxes.find(
      (element) => element.label === "Status"
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
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.fileSubject &&
            element.fileSubject
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.createdOn &&
            element.createdOn
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    }
  }
  disableFilter(fliterNum) {
    const tablefilter = this.budgetfiltrParams.disable;
    switch (fliterNum) {
      case 1:
        tablefilter.fileNumberdisable = false;
        this.filterSelected["fileNumber"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "File Number") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.fileSubjectdisable = false;
        this.filterSelected["fileSubject"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "File Subject") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.createdOndisable = false;
        this.filterSelected["createdOn"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Created On") {
            element.checked = false;
          }
        });
        break;
      case 4:
        tablefilter.statusdisable = false;
        this.filterSelected["status"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Status") {
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
    const tablefilter = this.budgetfiltrParams.disable;
    const tablefiltrData = this.budgetfiltrParams.data;
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0; let counter4 = 0;
    tablefilter.fileNumberdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter1++;
        tablefiltrData.fileNumber.push(self.listOfAllData[key].fileNumber);
        if (counter1 == self.listOfAllData.length) {
          tablefiltrData.fileNumber = tablefiltrData.fileNumber.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.fileSubjectdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter2++;
        tablefiltrData.fileSubject.push(self.listOfAllData[key].fileSubject);
        if (counter2 == self.listOfAllData.length) {
          tablefiltrData.fileSubject = tablefiltrData.fileSubject.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.createdOndisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter3++;
        tablefiltrData.createdOn.push(self.listOfAllData[key].createdOn);
        if (counter3 == self.listOfAllData.length) {
          tablefiltrData.createdOn = tablefiltrData.createdOn.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.statusdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter4++;
        tablefiltrData.status.push(self.listOfAllData[key].status);
        if (counter3 == self.listOfAllData.length) {
          tablefiltrData.status = tablefiltrData.status.filter(
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
    this.budgetfiltrParams.disable = {
      fileNumberdisable: false,
      fileSubjectdisable: false,
      createdOndisable: false,
      statusdisable: false
    };
    this.budgetfiltrParams.data = {
      fileNumber: [],
      fileSubject: [],
      createdOn: [],
      status: []
    };
    this.filterCheckboxes = [
      { label: "File Number", checked: false },
      { label: "File Subject", checked: false },
      { label: "Created On", checked: false },
      { label: "Status", checked: false },
    ];
    this.filterSelected = {
      fileNumber: null,
      fileSubject: null,
      createdOn: null,
      status: null
    };
  }
  viewSDGEG(list) {
    if( this.tblParams.isApprovedView){
      this.showSDGEGPreview(list.id);
      return;
    }
    this.router.navigate(
      ["business-dashboard/budgets/sdgeg/create"],
      {
        state: {
          id: list.id,
          status: list.status,
          type: list.type
        },
      });
  }
  showSDGEGPreview(sdgEgId) {
    this.modalService.create({
      nzContent: SdfgPreViewComponent,
      nzWidth: "800",
      nzFooter: null,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzClosable: true,
      nzComponentParams: { sdgEgId: sdgEgId }
    });
  }
  viewFile(id) {
    if(this.tblParams.viewFrom == 'FINANCE' || this.tblParams.viewFrom == 'MEMBER/PPO'){
      return;
    }
    this.router.navigate(['business-dashboard/budgets/file-view/', id]);
  }
  findAssembly(assemblyId) {
    if (this.assemblySession["assembly"])
      return this.assemblySession["assembly"].find(o => o.id === assemblyId).assemblyId;
  }
  findSession(sessionId) {
    if (this.assemblySession["session"])
      return this.assemblySession["session"].find(o => o.id === sessionId).sessionId;
  }
  cancelCnfrm() { }
  pageSizeChange(numberOfItem) {
    this.paginationParams.pageIndex = 0;
    this.paginationParams.numberOfItem = numberOfItem;
    this.getSDGEGList();
  }
  pageIndexChange(index) {
    this.paginationParams.pageIndex = index;
    this.getSDGEGList();
  }
  showLinks(id) {
    this.listOfData.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else {
        element.viewLinks = false;
      }
    });
  }
  navigate(type) {
    this.router.navigate(
      ["business-dashboard/budgets/sdgeg/create"],
      {
        state: { type: type },
      });
  }
  createFile(list){
    list.assemblyId = this.assemblySession["assembly"].currentassembly;
    list.sessionId = this.assemblySession["session"].currentsession;
    this.modalService.create({
      nzContent: CreateFileComponent,
      nzWidth: "500",
      nzFooter: null,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzClosable: true,
      nzComponentParams: {
        assemblySession: this.assemblySession,
        DataObj: list,
        activeSubType: "BUDGET_SDG_AND_EG"
      },
    });
  }
  addToLOB(list){
    this.sdgeg.addToLOB(list.id).subscribe((res: any) => {
      this.notify.success('Success', 'Speech Added to LOB');
      this.getReceivedList();
    });
  }
  sentToLegislation(list){
    this.sdgeg.sentToLegislation(list.id).subscribe((res: any) => {
      this.notify.success('Success', 'Successfully Sent to Legislation');
      this.getReceivedList();
    });
  }
  sentToMembers(list){
    this.sdgeg.sentToMembers(list.id).subscribe((res: any) => {
      this.notify.success('Success', 'Successfully Sent');
      this.getReceivedListOnLegislation();
    });
  }
  addToLOBforSpeakerNote(list){
    this.sdgeg.addToLOBforSpeakerNote(list.id).subscribe((res: any) => {
      this.notify.success('Success', 'Success');
      this.getReceivedListOnLegislation();
    });
  }
  showCreateLetterForm(sdgeg) {
    this.correspondance.CoverLetterModel = true;
    this.correspondance.sdgegId = sdgeg.id;
    this.correspondance.fileId = sdgeg.fileId;
    this.correspondance.type = 'c1';
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
      businessReferId: this.correspondance.sdgegId,
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
        business = "SDG_AP_BILL_REQUEST"
        break;
    }
    return business;
  }
}
