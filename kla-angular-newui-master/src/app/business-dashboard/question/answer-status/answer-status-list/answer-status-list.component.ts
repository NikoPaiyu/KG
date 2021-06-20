import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "../../../../auth/shared/services/auth.service";
import { UserData } from "../../../../auth/shared/models";
import { QuestionRBSService } from "../../shared/question-rbs.service";

@Component({
  selector: 'app-answer-status-list',
  templateUrl: './answer-status-list.component.html',
  styleUrls: ['./answer-status-list.component.scss']
})
export class AnswerStatusListComponent implements OnInit {
  role = null;
  checked = true;
  showFilter = false;
  clearfilter;
  searchParam: string = "";
  ballotList: any = [];
  allBallotList: any = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  filters: object;
  filterDates: any = [];
  statementNos: any = [];
  buttonList: any = [];
  currentUser: UserData;
  action: string = "";
  assemblySession: object = [];
  approvedList = false;

  constructor(
    private question: QuestionService,
    private router: Router,
    private auth: AuthService,
    private rbsService: QuestionRBSService
  ) {
    this.role = this.auth.getCurrentUser().authorities[0];
    this.currentUser = this.auth.getCurrentUser();
    this._setFilterValue();
  }

  ngOnInit() {
    this.getAssemblySession();
    this.loadRBSPermissions();
    if (
      this.auth.getCurrentUser().authorities.includes(this._defineRoles()[10])
    ) {
      this.role = this._defineRoles()[10];
    }
    if (this.router.url.includes("approved-answer-status-list")) {
      this.approvedList = true;
    }
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
          this.redirectToList();
        }
    });
  }
  loadRBSPermissions() {
    if (this.auth.getCurrentUser().userId) {
      this.rbsService
        .getQuestionPermissions(this.auth.getCurrentUser().userId)
        .subscribe(() => {
          this.buttonList = this.rbsService.getButtonsInList(this.auth.getCurrentUser().authorities);
        });
    }
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
      this.redirectToList();
    }
  }
  redirectToList() {
    if (this.role == 'Department' || this.router.url.includes("approved-answer-status-list")) {
      this.getAnswerStatuslistForTS(this.assemblySession["assembly"].currentassembly, this.assemblySession["session"].currentsession);
    } else {
      this.getAnswerStatuslist();
    }
  }

  getAnswerStatuslist() {
    this.ballotList = this.allBallotList = [];
    this.question
      .getPendingAnswerStatusList(this.role
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          res = res.filter(el => el.assembyId == this.assemblySession["assembly"].currentassembly &&
            el.sessionId === this.assemblySession["session"].currentsession);
          this._rebuildData(res);
        }
      });
  }

  getAnswerStatuslistForTS(assemblyId, sessionId) {
    this.ballotList = this.allBallotList = [];
    this.question
      .getApprovedAnswerStatusList(assemblyId, sessionId)
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          res = res.filter(el => el.assembyId == this.assemblySession["assembly"].currentassembly &&
            el.sessionId === this.assemblySession["session"].currentsession);
          this._rebuildData(res);
        }
      });
  }
  _showFilter(status) {
    this.showFilter = status;
  }
  _setFilterValue() {
    this.filterCheckboxes = [
      { label: "Date", checked: false },
      { label: "Status", checked: false },
      { label: "Statement No", checked: false },
    ];
    this.filterSelected = {
      date: null,
      status: null,
      statementNo: null
    };
    this.filters = {
      showdate: false,
      showstatus: false,
      showStatementNo: false
    };
  }
  confrmFilter(): void {
    this.showFilter = false;
    this.filters["showdate"] = this.filterCheckboxes.find(
      (element) => element.label === "Date"
    ).checked;
    this.filters["showstatus"] = this.filterCheckboxes.find(
      (element) => element.label === "Status"
    ).checked;
    this.filters["showStatementNo"] = this.filterCheckboxes.find(
      (element) => element.label === "Statement No"
    ).checked;
    this._loadSelectedfilterData();
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.ballotList.filter((item) => item);
    if (sort.key && sort.value) {
      this.ballotList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.ballotList = data;
    }
  }
  searchCol(filter: any) {
    if (!filter) {
      this.ballotList = this.allBallotList;
    } else
      this.ballotList = this.allBallotList.filter((item: any) =>
        this.applyFilter(item, filter)
      );
  }
  applyFilter(element: any, filter: any) {
    for (const field in filter) {
      if (filter[field]) {
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
      }
    }
    return true;
  }
  onCheckBoxChange(box) {
    box.checked = !box.checked;
  }
  clearFilter() {
    this._setFilterValue();
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  onSearch() {
    this.ballotList = this.allBallotList;
    if (this.searchParam)
      this.ballotList = this.allBallotList.filter(
        (element) =>
          element.date.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          element.status.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    else this.ballotList = this.allBallotList;
  }
  disableFilter(filterNo) {
    switch (filterNo) {
      case 1:
        this.filters["showdate"] = false;
        this.filterSelected["date"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Date") {
            element.checked = false;
          }
        });
        break;
      case 2:
        this.filters["showstatus"] = false;
        this.filterSelected["status"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Status") {
            element.checked = false;
          }
        });
        break;
      case 3:
        this.filters["showStatementNo"] = false;
        this.filterSelected["statementNo"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Statement No") {
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
    let self = this;
    let counter1 = 0;
    this.filters["showdate"]
      ? Object.keys(self.ballotList).forEach(function (key) {
        counter1++;
        if (!self.filterDates.find(element => element === self.ballotList[key].date))
          self.filterDates.push(self.ballotList[key].date);
        if (counter1 == self.ballotList.length) {
          self.filterDates = self.filterDates.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    this.filters["showStatementNo"]
      ? Object.keys(self.ballotList).forEach(function (key) {
        counter1++;
        self.statementNos.push(self.ballotList[key].id);
        if (counter1 == self.ballotList.length) {
          self.statementNos = self.statementNos.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
  }
  viewBallot(list) {
    if (list.status === 'SAVED') {
      this.router.navigate([
        "business-dashboard/question/submit-answer-status-list",
        list.id
      ]);
    }
    else {
      this.router.navigate([
        "business-dashboard/question/process-answer-status-list",
        list.id
      ]);
    }

  }
  _rebuildData(res) {
    res.forEach(element => {
      element.date = this.question.formatDateDDMMYYYY(new Date(Date.parse(element.createDateTime)));
      element.statementNo = element.id
    });
    this.ballotList = this.allBallotList = res;
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
    ];
  }
}
