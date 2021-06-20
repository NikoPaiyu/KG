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
import { QuestionList } from "../../shared/model/question";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { forkJoin } from "rxjs";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";

@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-assurance-list",
  templateUrl: "./assurance-list.component.html",
  styleUrls: ["./assurance-list.component.scss"],
})
export class AssuranceListComponent implements OnInit {
  @Input() withassurance;
  @Input() status;
  isChecked = true;
  isAllDisplayDataChecked = false;
  tablefiltrParams: any = { show: {}, data: {} };
  isVisibleFilter = false;
  listOfDisplayData = [];
  listOfAllData = [];
  listOfData: any = [];
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
  withAssurance = false;
  @ViewChild("inputElement", { static: false }) inputElement: ElementRef;
  buttonList: any;
  constructor(
    private router: Router,
    private question: QuestionService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private notify: NotificationCustomService,
    public rbsService: QuestionRBSService
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
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly);
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
      this.loadQuestionByAssemblySession();
    }
  }
  LoadList() {
    if (this.status) {
      if (this.withassurance === true) {
        this.getAssuredQuestionList(true);
        return;
      } else if (this.withassurance === false) {
        this.getAssuredQuestionList(false);
        return;
      }
    }
    if (this.status === "SUBMITTED") {
      this.getQnWithAssuranceList();
      return;
    }
  }
  getstatus() {
    if (this.status == "SAVED") {
      return ["SAVED"];
    }
    if (this.status == "APPROVED" && this.withassurance === false) {
      return ["APPROVED"];
    }
    return ["APPROVED", "LIST_TAKEN"];
  }
  getQnWithAssuranceList() {
    let body = {
      role: this._findRole(),
      userId: this.auth.getCurrentUser().userId,
    };
    this.question.getAllPendingAssurance(body).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  getAssuredQuestionList(status) {
    this.question
      .getassuredQuestions(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        status,
        this.getstatus()
      )
      .subscribe((res: any) => {
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
  loadQuestionByAssemblySession() {
    this.LoadList();
  }
  viewAssurance(list) {
    if (list.assuranceStatus === "SAVED") {
      this.router.navigate([
        "business-dashboard/question/mark-assurance",
        list.id,
      ]);
      return;
    }
    this.router.navigate([
      "business-dashboard/question/assurance-view",
      list.id,
    ]);
  }
  createAssuranceList() {
    let body = {
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
    };
    this.question.createAssuranceList(body).subscribe((res: any) => {
      this.notify.showSuccess("Created List", "");
    });
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
    tablefilter.showQNo = this.filterCheckboxes.find(
      (element) => element.label === "Question Number"
    ).checked;
    tablefilter.showheading = this.filterCheckboxes.find(
      (element) => element.label === "Question Heading"
    ).checked;
    tablefilter.showdate = this.filterCheckboxes.find(
      (element) => element.label === "Question Date"
    ).checked;
    tablefilter.showmember = this.filterCheckboxes.find(
      (element) => element.label === "Member"
    ).checked;
    tablefilter.showstatus = this.filterCheckboxes.find(
      (element) => element.label === "Status"
    ).checked;
    tablefilter.shownoAssurance = this.filterCheckboxes.find(
      (element) => element.label === "No of Assurances"
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
    if (this.searchParam) {
      this.listOfData = this.listOfAllData.filter(
        (element) =>
          (element.heading &&
            element.heading
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.questionDate &&
            element.questionDate
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.primaryMeberName &&
            element.primaryMeberName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.assuranceStatus &&
            element.assuranceStatus
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
        tablefilter.showQNo = false;
        this.filterSelected["questionNumber"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Question Number") {
            element.checked = false;
          }
        });
        break;
      case 2:
        tablefilter.showheading = false;
        this.filterSelected["heading"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Question Heading") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.showdate = false;
        this.filterSelected["questionDate"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Question Date") {
            element.checked = false;
          }
        });
        break;
      case 4:
        tablefilter.showmember = false;
        this.filterSelected["primaryMeberName"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Member") {
            element.checked = false;
          }
        });
        break;
      case 5:
        tablefilter.shownoAssurance = false;
        this.filterSelected["numberOfAssurance"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "No of Assurances") {
            element.checked = false;
          }
        });
        break;
      case 6:
        tablefilter.showstatus = false;
        this.filterSelected["assuranceStatus"] = null;
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
    const tablefilter = this.tablefiltrParams.show;
    const tablefiltrData = this.tablefiltrParams.data;
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;
    let counter6 = 0;
    tablefilter.showQNo
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter1++;
          tablefiltrData.questionNumber.push(
            self.listOfAllData[key].questionNumber
          );
          if (counter1 === self.listOfAllData.length) {
            tablefiltrData.questionNumber = tablefiltrData.questionNumber.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.showheading
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter2++;
          tablefiltrData.heading.push(self.listOfAllData[key].heading);
          if (counter2 == self.listOfAllData.length) {
            tablefiltrData.heading = tablefiltrData.heading.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.showdate
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter3++;
          tablefiltrData.questionDate.push(
            self.listOfAllData[key].questionDate
          );
          if (counter3 === self.listOfAllData.length) {
            tablefiltrData.questionDate = tablefiltrData.questionDate.filter(
              (v, i, a) => a.indexOf(v) === i
            );
            tablefiltrData.questionDate.sort();
          }
        })
      : "";
    tablefilter.showmember
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter4++;
          tablefiltrData.primaryMeberName.push(
            self.listOfAllData[key].primaryMeberName
          );
          if (counter4 === self.listOfAllData.length) {
            tablefiltrData.primaryMeberName = tablefiltrData.primaryMeberName.filter(
              (v, i, a) => a.indexOf(v) === i
            );
          }
        })
      : "";
    tablefilter.shownoAssurance
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter5++;
          tablefiltrData.numberOfAssurance.push(
            self.listOfAllData[key].numberOfAssurance
          );
          if (counter5 === self.listOfAllData.length) {
            tablefiltrData.numberOfAssurance = tablefiltrData.numberOfAssurance.filter(
              (v, i, a) => a.indexOf(v) === i
            );
            tablefiltrData.numberOfAssurance.sort();
          }
        })
      : "";
    tablefilter.showstatus
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter6++;
          tablefiltrData.assuranceStatus.push(
            self.listOfAllData[key].assuranceStatus
          );
          if (counter6 === self.listOfAllData.length) {
            tablefiltrData.assuranceStatus = tablefiltrData.assuranceStatus.filter(
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
        if (field === "questionNumber" || field === "numberOfAssurance") {
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
      showQNo: false,
      showheading: false,
      showdate: false,
      showmember: false,
      showstatus: false,
      shownoAssurance: false,
    };
    this.tablefiltrParams.data = {
      questionNumber: [],
      heading: [],
      questionDate: [],
      primaryMeberName: [],
      numberOfAssurance: [],
      assuranceStatus: [],
    };
    this.filterCheckboxes = [
      { label: "Question Number", checked: false, colchecked: true },
      { label: "Question Heading", checked: false, colchecked: true },
      { label: "Question Date", checked: false, colchecked: true },
      { label: "Member", checked: false, colchecked: true },
      { label: "No of Assurances", checked: false, colchecked: true },
      { label: "Status", checked: false, colchecked: true },
    ];
    this.filterSelected = {
      questionNumber: null,
      heading: null,
      questionDate: null,
      primaryMeberName: null,
      numberOfAssurance: null,
      assuranceStatus: null,
    };
  }
  _setcolFilterValue() {
    if (this.filterCheckboxes.length > 0) {
      this.filterCheckboxes.forEach((element) => {
        element.colchecked = true;
      });
    }
  }
  _findRole() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return "speaker";
    }
    return this.auth.getCurrentUser().authorities[0];
  }
  _canShowCreateList() {
    if (this.withassurance && this.listOfData.length > 0) {
      if (this.status !== "SAVED") {
        return true;
      }
    }
    return false;
  }
}
