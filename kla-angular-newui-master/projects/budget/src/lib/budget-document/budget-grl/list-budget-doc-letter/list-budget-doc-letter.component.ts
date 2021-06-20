import { Component, Inject, Input, OnInit } from '@angular/core';
import { NzNotificationService, UploadFile } from "ng-zorro-antd";
import { FileServiceService } from '../../../shared/services/file-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { BudgetCommonService } from '../../../shared/services/budgetcommon.service';
import { CreateFileComponent } from '../../../files/create-file/create-file.component';
import { NzModalService } from 'ng-zorro-antd';
import {CreateBudgetdocGRLComponent} from '../create-budgetdoc-grl/create-budgetdoc-grl.component';

@Component({
  selector: 'budget-list-budget-doc-letter',
  templateUrl: './list-budget-doc-letter.component.html',
  styleUrls: ['./list-budget-doc-letter.component.scss']
})
export class ListBudgetDocLetterComponent implements OnInit {
  budgetfiltrParams: any = { disable: {}, data: {} };
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
  filtrParams: any = {};
  openFilesave;
  assemblySession: object = [];
  colCheckboxes = [
    { id: 0, label: 'File No', check: true, disable: false },
    { id: 1, label: 'File subject', check: true, disable: false },
    { id: 2, label: 'Date', check: true, disable: false },
    { id: 3, label: 'Status', check: true, disable: false }
  ];
  paginationParams = { numberOfItem: 10, pageIndex: 0, total: 0 };
  coverLetterTitle = '';
  correspondance = { CoverLetterModel: false, coverLetterTitle: '', docId: '', type: 'BUDGET_DOCUMENT_GRL_REQUEST_LETTER', fileId: '' }

  isCreateBS;
  constructor(
    private budgetDOc: BudgetDocumentService,
    private file: FileServiceService,
    private common: BudgetCommonService,
    private router: Router,
    @Inject('authService') public auth,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private notify: NzNotificationService,

  ) { }
  ngOnInit() {
    this.getAssemblySession();

  }

  getAssemblySession() {
    this.common.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
          this.assemblySession = res;
          this.assemblySession["assembly"].currentassembly =  parseInt(res.activeAssemblySession.assemblyId);
          this.assemblySession["assembly"].currentassemblyVal = parseInt(res.activeAssemblySession.assemblyValue);
          this.setSession();
          this.assemblySession["session"].currentsession = parseInt(res.activeAssemblySession.sessionId);
          this.assemblySession["session"].currentsessionVal = parseInt(res.activeAssemblySession.sessionValue);
          this.getAllBudgetDocGRLList();
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
      this.getAllBudgetDocGRLList();
    }
  }
  getAllBudgetDocGRLList(){
    this.budgetDOc.getAllApprovedBudgetGRLdocuments().subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      this.paginationParams.total = res ? res.totalSize : 0;
      this.sortbyAssemblyAndSessionId(res);
    });

  }
  showCreateDocmodel(BDoc_grl) {
    if(!this.assemblySession['session'].currentsession) {
      this.notify.warning('Warning.', 'Please Select Assembly & Session');
      return;
    }
    this.modalService.create({
      nzContent: CreateBudgetdocGRLComponent,
      nzWidth: "500",
      nzFooter: null,
      nzTitle: 'Create GRL request',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzClosable: true,
      nzOnOk: () => {this.getAllBudgetDocGRLList()},
      nzComponentParams: {
        assemblySession: this.assemblySession,
        BudgetDocument_GRL: BDoc_grl
      },
    });
  }
  showCreateFileModel(BDoc_grl) {
    this.modalService.create({
      nzContent: CreateFileComponent,
      nzWidth: "500",
      nzFooter: null,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzClosable: true,
      nzComponentParams: {
        assemblySession: this.assemblySession,
        DataObj: BDoc_grl,
        activeSubType: "BUDGET_DOCUMENT_GRL"
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
    this.getAllBudgetDocGRLList();
  }
  pageIndexChange(index) {
    this.paginationParams.pageIndex = index;
    this.getAllBudgetDocGRLList();
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
  showCreateLetterForm(doc, type) {
    this.correspondance.CoverLetterModel = true;
    this.correspondance.docId = doc.id;
    this.correspondance.fileId = doc.fileId;
    this.correspondance.type = type;
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
      businessReferId: this.correspondance.docId,
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
        business = "BUDGET_DOCUMENT_GRL_REQUEST_LETTER"
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
        element.viewLinks = true;
      }
    });
  }
  
}


