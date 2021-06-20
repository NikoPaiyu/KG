import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { QuestionList } from "../../shared/model/question";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-question-clubb-withdw",
  templateUrl: "./question-clubb-withdw.component.html",
  styleUrls: ["./question-clubb-withdw.component.scss"],
})
export class QuestionClubbWithdwComponent implements OnInit {
  isChecked = true;
  isAllDisplayDataChecked = false;
  tablefiltrParams: any = { disable: {}, data: {} };
  isVisibleFilter = false;
  listOfData = [];
  listOfDisplayData = [];
  listOfAllData = [];
  numberOfChecked = 0;
  sortName: string | null = null;
  sortValue: string | null = null;
  mapOfCheckedId: { [key: string]: boolean } = {};
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  role: string;
  isChanged = false;
  statusParam: any;
  primaryFlag = false;
  sortbyId = false;
  assemblySession: object = [];
  @ViewChild("inputElement", { static: false }) inputElement: ElementRef;
  buttonList: any;
  constructor(
    private router: Router,
    private question: QuestionService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private rbsService: QuestionRBSService,
    private notify: NotificationCustomService
  ) {
    this._setFilterValue();
  }
  ngOnInit() {
    this.role = this.auth.getCurrentUser().authorities[0];
    this.loadRBSPermissions();
    this.route.params.subscribe((params) => {
      this.getRouterPrams(params);
      this.getAssemblySession();
    });
  }
  getRouterPrams(params) {
    this.statusParam = params && params.status ? params.status : "";
    this.primaryFlag = params && params.isp ? params.isp : this.primaryFlag;
  }
  loadRBSPermissions() {
    if (this.auth.getCurrentUser().userId) {
      this.rbsService
        .getQuestionPermissions(this.auth.getCurrentUser().userId)
        .subscribe(() => {
          this.buttonList = this.rbsService.getButtonsInList(
            this.auth.getCurrentUser().authorities
          );
        });
    }
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly);
        this.assemblySession['session'].currentsession  = res.activeAssemblySession['sessionId'];
      }
      this._getLocalStorage();
      this._redirectToList();
    });
  }
  findSessionListByAssembly(selAssembly) {
    this.resetdataOnchnage();
    if (this.assemblySession) {
      if (this.assemblySession['sessionByAssembly'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['sessionByAssembly'].find(
          (element) => element.id === selAssembly).session;
        this.assemblySession['session'] = session;
        // this.assemblySession['session'].currentsession = session.slice(-1).pop().id
      }
    }
    if(this.assemblySession['session'].currentsession) {
      this.loadQuestionByAssemblySession();
    }
  }

resetdataOnchnage() {
    this.assemblySession['session'] = [];
    this.assemblySession['session'].currentsession = null;
    this.assemblySession['session'].currentsessionLabel = null;
    this.listOfDisplayData = this.listOfAllData = this.listOfData = [];
  }
  getlistofClubbedMemberWithdraw() {
    let arr = [];
    this.question
      .getlistofClubbedMemberWithdraw(
        this.role,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        arr = res;
        if (arr) {
          if (this.statusParam === "CLUBBING_REMOVE_QUESTION") {
            arr = arr.filter(
              (element) => element && this.isConvertedToQuestion(element.stage)
            );
          } else if (this.statusParam === "CLUBBING_REMOVE") {
            arr = arr.filter((element) => element && element.stage === "NOTICE");
          }
          this.sortbyAssemblyAndSessionId(arr);
        }
      });
  }
  isConvertedToQuestion(CurrentStage) {
    let stages = ["QUESTION", "ANSWERED", "TAKEN"];
    if (stages.includes(CurrentStage)) {
      return true;
    }
    return false;
  }
  sortbyAssemblyAndSessionId(res) {
    this.listOfAllData = res;
    this.listOfAllData = res.filter(
      (el) =>
        el.assemblyId === this.assemblySession["assembly"].currentassembly &&
        el.sessionId === this.assemblySession["session"].currentsession
    );
    this.listOfDisplayData = this.listOfAllData;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.onSearchUser();
    this.sortbyId = true;
  }
  renderDisplayData(res) {
    this.listOfDisplayData = this.listOfAllData = res;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.sortbyId = true;
  }
  loadQuestionByAssemblySession() {
    this.getlistofClubbedMemberWithdraw();
  }
  viewQuestion(list: QuestionList) {
    this.statusParam = this.statusParam ? this.statusParam : "";
    this._setLocalStorage();
    this.router.navigate([
      "business-dashboard/question/question-clubview",
      list.questionId,
      this.statusParam,
      list.memberId,
    ]);
  }
  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }
  refreshStatus(): void {
    this.numberOfChecked = this.listOfDisplayData.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(
      (item) => this.mapOfCheckedId[item.id]
    );
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
    const tablefilter = this.tablefiltrParams.disable;
    tablefilter.questionheadingdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "Question Heading" ||
        element.label === "Notice Heading"
    ).checked;
    tablefilter.subjectdisable = this.filterCheckboxes.find(
      (element) => element.label === "Subject"
    ).checked;
    tablefilter.prioritydisable = this.filterCheckboxes.find(
      (element) => element.label === "Priority"
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
          (element.noticeNumber &&
            element.noticeNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.heading &&
            element.heading
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.priority &&
            element.priority
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.heading &&
            element.heading
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.subjectName &&
            element.subjectName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.questionDate &&
            element.questionDate
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.registrationDate &&
            element.registrationDate
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.category &&
            element.category.toLowerCase() ===
            this.searchParam.toLowerCase()) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    }
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.disable;
    switch (fliterNum) {
      case 1:
        tablefilter.questionheadingdisable = false;
        this.filterSelected["heading"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (
            element.label === "Question Heading" ||
            element.label === "Notice Heading"
          ) {
            element.checked = false;
          }
        });
        break;
      case 2:
        tablefilter.subjectdisable = false;
        this.filterSelected["subjectName"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Subject") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.prioritydisable = false;
        this.filterSelected["priority"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Priority") {
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
    const tablefilter = this.tablefiltrParams.disable;
    const tablefiltrData = this.tablefiltrParams.data;
    const self = this;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter6 = 0;
    let counter7 = 0;
    let counter8 = 0;
    tablefilter.questionheadingdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter2++;
        tablefiltrData.questionheading.push(self.listOfAllData[key].heading);
        if (counter2 == self.listOfAllData.length) {
          tablefiltrData.questionheading = tablefiltrData.questionheading.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.subjectdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter3++;
        tablefiltrData.subject.push(self.listOfAllData[key].subjectName);
        if (counter3 == self.listOfAllData.length) {
          tablefiltrData.subject = tablefiltrData.subject.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.questiondatedisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter4++;
        tablefiltrData.questiondate.push(
          self.listOfAllData[key].questionDate
        );
        if (counter4 == self.listOfAllData.length) {
          tablefiltrData.questiondate = tablefiltrData.questiondate.filter(
            (v, i, a) => a.indexOf(v) === i
          );
          tablefiltrData.questiondate.sort();
        }
      })
      : "";
    tablefilter.prioritydisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter6++;
        tablefiltrData.priority.push(self.listOfAllData[key].priority);
        if (counter6 == self.listOfAllData.length) {
          tablefiltrData.priority = tablefiltrData.priority.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.statusdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter7++;
        tablefiltrData.status.push(self.listOfAllData[key].status);
        if (counter7 == self.listOfAllData.length) {
          tablefiltrData.status = tablefiltrData.status.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.categorydisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter8++;
        tablefiltrData.category.push(self.listOfAllData[key].category);
        if (counter8 == self.listOfAllData.length) {
          tablefiltrData.category = tablefiltrData.category.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
  }
  searchCol(filter: any) {
    if (!filter) {
      this.listOfData = this.listOfAllData;
    } else if (this.listOfAllData && this.listOfAllData.length > 0) {
      this.listOfData = this.listOfAllData.filter((item: any) =>
        this.applyFilter(item, filter)
      );
    }
  }
  applyFilter(element: any, filter: any): boolean {
    element.Qstatus = element.status.replace(/_/g, " ");
    for (const field in filter) {
      if (filter[field]) {
        if (field === "heading") {
          if (typeof filter[field] === "string") {
            if (
              !element[field] ||
              element[field].toLowerCase() !== filter[field].toLowerCase()
            ) {
              return false;
            }
          } else if (typeof filter[field] === "number") {
            if (!element[field] || element[field] !== filter[field]) {
              return false;
            }
          }
        } else if (field === "subjectName") {
          if (typeof filter[field] === "string") {
            if (
              !element[field] ||
              element[field].toLowerCase() !== filter[field].toLowerCase()
            ) {
              return false;
            }
          } else if (typeof filter[field] === "number") {
            if (element[field] !== filter[field]) {
              return false;
            }
          }
        } else if (field === "category") {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else if (field === "type") {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
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
  _redirectToList() {
    this.getlistofClubbedMemberWithdraw();
  }
  _defineRoles() {
    return [
      "MLA",
      "parliamentaryPartySecretary",
      "assistant",
      "sectionOfficer",
      "underSecretary",
      "deputySecretary",
      "jointSecretary",
      "specialSecretary",
      "additionalSecretary",
      "secretary",
      "speaker",
      "Department",
      "minister",
    ];
  }
  _setFilterValue() {
    this.tablefiltrParams.disable = {
      categorydisable: true,
      questionheadingdisable: false,
      subjectdisable: false,
      questiondatedisable: true,
      prioritydisable: false,
      statusdisable: false
    };
    this.tablefiltrParams.data = {
      category: [],
      questionheading: [],
      subject: [],
      questiondate: [],
      regdate: [],
      priority: [],
      status: []
    };
    this.filterCheckboxes = [
      { label: "Question Heading", checked: false },
      { label: "Subject", checked: false },
      { label: "Created Date", checked: false },
      { label: "Status", checked: false },
    ];
    this.filterSelected = {
      category: null,
      heading: null,
      subjectName: null,
      questionDate: null,
      registrationDate: null,
      priority: null,
      status: null,
      type: null
    };
    if (!this._IsQuestion()) {
      let find = this.filterCheckboxes[
        this.filterCheckboxes.findIndex((x) => x.label === "Question Heading")
      ];
      find.label = "Notice Heading";
      this.filterCheckboxes.push({ label: "Priority", checked: false });
    }
  }
  _IsQuestion() {
    if (this.statusParam === "CLUBBING_REMOVE_QUESTION") {
      return true;
    }
    return false;
  }
  _setLocalStorage() {
    this.tablefiltrParams.data.assembly = this.assemblySession["assembly"].currentassembly;
    this.tablefiltrParams.data.session = this.assemblySession["session"].currentsession;
    localStorage.setItem("filtrParams", JSON.stringify(this.tablefiltrParams));
    localStorage.setItem("filterSelected", JSON.stringify(this.filterSelected));
    localStorage.setItem("searchParam", this.searchParam);
  }
  _getLocalStorage() {
    let hasFilter = localStorage.getItem("hasFilter");
    if (hasFilter !== 'true') {
      this.clearFilter();
      return;
    }
    let tablefiltrParams = localStorage.getItem("filtrParams");
    let filterSelected = localStorage.getItem("filterSelected");
    let searchParam = localStorage.getItem("searchParam");
    if (searchParam) {
      this.searchParam = searchParam;
    }
    if (tablefiltrParams && filterSelected) {
      tablefiltrParams = JSON.parse(tablefiltrParams);
      filterSelected = JSON.parse(filterSelected);
      if (typeof tablefiltrParams === 'object' && typeof filterSelected === 'object') {
        this.tablefiltrParams = tablefiltrParams;
        this.filterSelected = filterSelected;
        this.assemblySession["assembly"].currentassembly = tablefiltrParams['data']['assembly']
        this.assemblySession["session"].currentsession = tablefiltrParams['data']['session']
      }
    }
    localStorage.setItem("hasFilter", "false");
  }
}
