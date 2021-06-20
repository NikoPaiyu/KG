import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "../../../../auth/shared/services/auth.service";
import { UserData } from "../../../../auth/shared/models";
import { QuestionRBSService } from "../../shared/question-rbs.service";

@Component({
  selector: "app-question-ballot-list",
  templateUrl: "./question-ballot-list.component.html",
  styleUrls: ["./question-ballot-list.component.scss"],
})
export class QuestionBallotListComponent implements OnInit {
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
  buttonList: any = [];
  currentUser: UserData;
  action: string = "";
  pageTitle: string = "";
  assemblySession: object = [];
  constructor(
    private question: QuestionService,
    private router: Router,
    private authService: AuthService,
    private rbsService: QuestionRBSService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this._setFilterValue();
  }

  ngOnInit() {
    this.getAssemblySession();
    this.loadRBSPermissions();
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly)
        this._redirectToPage();
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
      this.redirectToList();
    }
  }
  loadRBSPermissions() {
    if (this.currentUser.userId) {
      this.rbsService
        .getQuestionPermissions(this.currentUser.userId)
        .subscribe(() => {
          this.buttonList = this.rbsService.getrbsPermissionForBallot();
        });
    }
  }

  redirectToList() {
    if (
      this.router.url === "/business-dashboard/question/question-ballot-approve"
    ) {
      this.getBallotlist();
    } else if (
      this.router.url === "/business-dashboard/question/question-senddept"
    ) {
      this.getApprovedQuestionSet();
    }
  }
  getApprovedQuestionSet() {
    this.ballotList = this.allBallotList = [];
    this.question
      .getApprovedQuestionSet(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          this._rebuildData(res);
        }
      });
  }
  getBallotlist() {
    this.ballotList = this.allBallotList = [];
    this.question
      .getBallotSet(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) {
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
    ];
    this.filterSelected = {
      date: null,
      status: null,
    };
    this.filters = {
      showdate: false,
      showstatus: false,
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
        self.filterDates.push(self.ballotList[key].date);
        if (counter1 == self.ballotList.length) {
          self.filterDates = self.filterDates.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
  }
  viewBallot(date, status) {
    this.router.navigate([
      "business-dashboard/question/question-ballot-view",
      date,
      this.action
    ], {
      state: {
        data : status
      }
    });
  }
  _redirectToPage() {
    this.pageTitle = "Balloting";
    if (
      this.router.url === "/business-dashboard/question/question-ballot-approve"
    ) {
      this.action = "apv";
      this.pageTitle = "Setting Of Questions";
    } else if (
      this.router.url === "/business-dashboard/question/question-settolob"
    ) {
      this.pageTitle = "Set to LOB";
      this.action = "lob";
    } else if (
      this.router.url === "/business-dashboard/question/question-senddept"
    ) {
      this.pageTitle = "Send to Department";
      this.action = "dept";
    }
  }
  _rebuildData(res) {
    this.ballotList = this.allBallotList = res;
  }
}
