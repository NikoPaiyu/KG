import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  Injectable,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { forkJoin } from "rxjs";
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-draft-assurance-list",
  templateUrl: "./draft-assurance-list.component.html",
  styleUrls: ["./draft-assurance-list.component.scss"],
})
export class DraftAssuranceListComponent implements OnInit {
  isChecked = true;
  isAllDisplayDataChecked = false;
  tablefiltrParams: any = { show: {}, data: {} };
  isVisibleFilter = false;
  listOfDisplayData = [];
  listOfAllData = [];
  listOfData = [];
  numberOfChecked = 0;
  sortName: string | null = null;
  sortValue: string | null = null;
  mapOfCheckedId: { [key: string]: boolean } = {};
  searchParam: string;
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  role: string;
  sortbyId = false;
  @ViewChild("inputElement", { static: false }) inputElement: ElementRef;
  buttonList: any;
  assemblySession: object = [];
  constructor(
    private router: Router,
    private question: QuestionService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this._setFilterValue();
  }
  ngOnInit() {
    this.clearFilter();
    this.getAssemblySession();
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly)
      }
    });
  }
  findSessionListByAssembly(selAssembly) {
    if (this.assemblySession) {
      if (this.assemblySession['sessionByAssembly'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['sessionByAssembly'].find(
          (element) => element.id === selAssembly).session;
        this.assemblySession['session'] = session;
        this.assemblySession['session'].currentsession = session.slice(-1).pop().id
      }
    }
    if(this.assemblySession['session'].currentsession) {
      this.getAllPendingDraftAssurances();
    }
  }
  getAllPendingDraftAssurances() {
    let body = {
      role: this._findRole(),
      userId: this.auth.getCurrentUser().userId,
    };
    this.question.getAllPendingDraftAssurances(body).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  sortbyAssemblyAndSessionId(res) {
    this._filterWithAssembly(res);
    this.listOfDisplayData = this.listOfAllData;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.sortbyId = true;
  }
  _filterWithAssembly(res) {
    if (this.assemblySession["session"].currentsession) {
      this.listOfAllData = res.filter(
        (el) =>
          el.assemblyId === this.assemblySession["assembly"].currentassembly &&
          el.sessionId === this.assemblySession["session"].currentsession
      );
      return;
    }
    this.listOfAllData = res.filter(
      (el) => el.assemblyId === this.assemblySession["assembly"].currentassembly
    );
  }
  viewListData(list) {
    this.router.navigate([
      "business-dashboard/question/draft-list-view",
      list.id,
    ]);
  }
  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }
  refreshStatus(): void {
    if (this.listOfDisplayData.length > 0) {
      this.numberOfChecked = this.listOfDisplayData.filter(
        (item) => this.mapOfCheckedId[item.id]
      ).length;
      this.isAllDisplayDataChecked = this.listOfDisplayData.every(
        (item) => this.mapOfCheckedId[item.id]
      );
    }
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
  _checkAllRows(value: boolean): void {
    this.listOfDisplayData.forEach(
      (item) => (this.mapOfCheckedId[item.id] = value)
    );
    this.refreshStatus();
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  _showFilter(): void {
    this.isVisibleFilter = false;
    const tablefilter = this.tablefiltrParams.show;
    tablefilter.showlistName = this.filterCheckboxes.find(
      (element) => element.label === "List Number"
    ).checked;
    tablefilter.showstatus = this.filterCheckboxes.find(
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
  onSearch() {
    if (this.searchParam) {
      this.listOfData = this.listOfAllData.filter(
        (element) =>
          (element.listName &&
            element.listName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.listOfData = this.listOfAllData;
    }
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.show;
    switch (fliterNum) {
      case 1:
        tablefilter.showlistName = false;
        this.filterSelected["listName"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "List Number") {
            element.checked = false;
          }
        });
        break;
      case 2:
        tablefilter.showstatus = false;
        this.filterSelected["status"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Status") {
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
    const tablefilter = this.tablefiltrParams.show;
    const tablefiltrData = this.tablefiltrParams.data;
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    tablefilter.showlistName
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter1++;
          tablefiltrData.listName.push(self.listOfAllData[key].listName);
          if (counter1 === self.listOfAllData.length) {
            tablefiltrData.listName = tablefiltrData.listName.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.showstatus
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter2++;
          tablefiltrData.status.push(self.listOfAllData[key].status);
          if (counter2 === self.listOfAllData.length) {
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
  _defineRoles() {
    return ["MLA", "parliamentaryPartySecretary", "assistant"];
  }
  isMLA() {
    if (
      this.auth.getCurrentUser().authorities.includes(this._defineRoles()[10])
    ) {
      return false;
    }
    return this.auth
      .getCurrentUser()
      .authorities.includes(this._defineRoles()[0]);
  }
  _setFilterValue() {
    this.tablefiltrParams.show = {
      showlistName: false,
      showstatus: false,
    };
    this.tablefiltrParams.data = {
      listName: [],
      status: [],
    };
    this.filterCheckboxes = [
      { label: "List Number", checked: false, colchecked: true },
      { label: "Status", checked: false, colchecked: true },
    ];
    this.filterSelected = {
      listName: null,
      status: null,
    };
  }
  _findRole() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return "speaker";
    }
    return this.auth.getCurrentUser().authorities[0];
  }
}
