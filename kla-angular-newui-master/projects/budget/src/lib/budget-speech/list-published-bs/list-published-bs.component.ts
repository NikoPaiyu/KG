import { Component, OnInit, Inject } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';
import { BudgetSpeechService } from '../../shared/services/budget-speech.service';
@Component({
  selector: 'budget-list-published-bs',
  templateUrl: './list-published-bs.component.html',
  styleUrls: ['./list-published-bs.component.scss']
})
export class ListPublishedBsComponent implements OnInit {
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
  docUrl: any = null;
  previewVisible = false;
  constructor(
    private common: BudgetCommonService,
    private budgetspeech: BudgetSpeechService,
    @Inject('authService') public auth
  ) {
    this._setFilterValue();
  }
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
          this.getPublishedBudgetSpeech();
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
      this.getPublishedBudgetSpeech();
    }
  }
  getPublishedBudgetSpeech() {
    this.budgetspeech.getAllPublishedBudgetSpeech(this.paginationParams).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res ? res.content : [];
      this.paginationParams.total = res ? res.totalSize : 50;
      this.sortbyAssemblyAndSessionId(res.content);
    });
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
    const tablefilter = this.budgetfiltrParams.disable;
    tablefilter.fileNumberdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "budgetTitle"
    ).checked;
    tablefilter.datedisable = this.filterCheckboxes.find(
      (element) => element.label === "Date"
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
          (element.budgetTitle &&
            element.budgetTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.date &&
            element.date
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
        this.filterSelected["budgetTitle"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "budgetTitle") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.datedisable = false;
        this.filterSelected["date"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Date") {
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
    let counter3 = 0;
    tablefilter.budgetTitle
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter1++;
        tablefiltrData.budgetTitle.push(self.listOfAllData[key].budgetTitle);
        if (counter1 == self.listOfAllData.length) {
          tablefiltrData.budgetTitle = tablefiltrData.budgetTitle.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.datedisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter2++;
        tablefiltrData.date.push(self.listOfAllData[key].date);
        if (counter2 == self.listOfAllData.length) {
          tablefiltrData.date = tablefiltrData.date.filter(
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
    element.stage = element.stage.replace(/_/g, ' ');
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
      budgetTitledisable: false,
      datedisable: false
    };
    this.budgetfiltrParams.data = {
      budgetTitle: [],
      date: []
    };
    this.filterCheckboxes = [
      { label: "budgetTitle", checked: false },
      { label: "Date", checked: false }
    ];
    this.filterSelected = {
      budgetTitle: null,
      date: null
    };
  }
  pageSizeChange(numberOfItem) {
    this.paginationParams.pageIndex = 0;
    this.paginationParams.numberOfItem = numberOfItem;
    this.getPublishedBudgetSpeech();
  }
  pageIndexChange(index) {
    this.paginationParams.pageIndex = index;
    this.getPublishedBudgetSpeech();
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
  view_doc(list) {
    this.previewVisible = true;
    this.docUrl = list.budgetUrl;
  }
  cancelPreview() {
    this.previewVisible = false;
  }
}
