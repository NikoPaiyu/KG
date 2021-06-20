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
import { DraftListPreviewComponent } from "../../shared/component/draft-list-preview/draft-list-preview.component";
import { NzModalService } from "ng-zorro-antd";
import { forkJoin } from "rxjs";
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-approved-assurance-list",
  templateUrl: "./approved-assurance-list.component.html",
  styleUrls: ["./approved-assurance-list.component.scss"],
})
export class ApprovedAssuranceListComponent implements OnInit {
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
  assemblySession: object = [];
  @ViewChild("inputElement", { static: false }) inputElement: ElementRef;
  buttonList: any;
  constructor(
    private router: Router,
    private question: QuestionService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private modalService: NzModalService
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
        this.assemblySession['session'].currentsession = session.slice(-1).pop().id;
      }
    }
    if(this.assemblySession['session'].currentsession) {
      this.getApprovedDraftList();
    }
  }
  getApprovedDraftList() {
    this.question
      .getapprovedDraftList(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        this.listOfDisplayData = this.listOfAllData = res;
        this.sortbyAssemblyAndSessionId(res);
      });
  }
  sortbyAssemblyAndSessionId(res) {
    //this._filterWithAssembly(res);
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
  viewAssurance(list) {
    this.router.navigate([
      "business-dashboard/question/assurance-view",
      list.id,
    ]);
  }
  createList() {}
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
    tablefilter.showassuranceNo = this.filterCheckboxes.find(
      (element) => element.label === "Draft Assurance No"
    ).checked;
    tablefilter.showtitle = this.filterCheckboxes.find(
      (element) => element.label === "Title"
    ).checked;
    tablefilter.showministerSubjectName = this.filterCheckboxes.find(
      (element) => element.label === "Department"
    ).checked;
    tablefilter.showsource = this.filterCheckboxes.find(
      (element) => element.label === "Source"
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
          (element.assuranceNo &&
            element.assuranceNo
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.ministerSubjectName &&
            element.ministerSubjectName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.source &&
            element.source
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
        tablefilter.showassuranceNo = false;
        this.filterSelected["assuranceNo"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Draft Assurance No") {
            element.checked = false;
          }
        });
        break;
      case 2:
        tablefilter.showtitle = false;
        this.filterSelected["title"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Title") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.showministerSubjectName = false;
        this.filterSelected["ministerSubjectName"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Department") {
            element.checked = false;
          }
        });
        break;
      case 4:
        tablefilter.showsource = false;
        this.filterSelected["source"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Source") {
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
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;
    let counter6 = 0;
    tablefilter.showassuranceNo
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter1++;
          tablefiltrData.assuranceNo.push(self.listOfAllData[key].assuranceNo);
          if (counter1 === self.listOfAllData.length) {
            tablefiltrData.assuranceNo = tablefiltrData.assuranceNo.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.showtitle
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter2++;
          tablefiltrData.title.push(self.listOfAllData[key].title);
          if (counter2 == self.listOfAllData.length) {
            tablefiltrData.title = tablefiltrData.title.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.showministerSubjectName
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter3++;
          tablefiltrData.ministerSubjectName.push(
            self.listOfAllData[key].ministerSubjectName
          );
          if (counter3 === self.listOfAllData.length) {
            tablefiltrData.ministerSubjectName = tablefiltrData.ministerSubjectName.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.showsource
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter4++;
          tablefiltrData.source.push(self.listOfAllData[key].source);
          if (counter4 === self.listOfAllData.length) {
            tablefiltrData.source = tablefiltrData.source.filter(
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
        if (field === "assuranceNo") {
          if (element[field] != filter[field]) {
            return false;
          }
        } else {
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
      showassuranceNo: false,
      showtitle: false,
      showministerSubjectName: false,
      showsource: false,
    };
    this.tablefiltrParams.data = {
      assuranceNo: [],
      title: [],
      ministerSubjectName: [],
      source: [],
    };
    this.filterCheckboxes = [
      { label: "Draft Assurance No", checked: false, colchecked: true },
      { label: "Title", checked: false, colchecked: true },
      { label: "Department", checked: false, colchecked: true },
      { label: "Source", checked: false, colchecked: true },
    ];
    this.filterSelected = {
      assuranceNo: null,
      title: null,
      ministerSubjectName: null,
      source: null,
    };
  }
  printPreview() {
    this.modalService.create({
      nzContent: DraftListPreviewComponent,
      nzWidth: "800",
      nzFooter: null,
      nzComponentParams: {
        previewData: this.listOfData,
        assembly: this.convertAssembly(),
        session: this.convertSession(),
      },
    });
  }
  convertSession() {
    let sessionid = this.assemblySession["session"].currentsession;
    return this.assemblySession["session"].find((item) => item.id === sessionid)
      .sessionId;
  }
  convertAssembly() {
    let assemblyId = this.assemblySession["assembly"].currentassembly;
    return this.assemblySession["assembly"].find(
      (item) => item.id === assemblyId
    ).assemblyId;
  }
}
