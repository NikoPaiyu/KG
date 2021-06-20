import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "../../../../auth/shared/services/auth.service";
import { UserData } from "../../../../auth/shared/models";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { NotificationCustomService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-list-delay-statement-list',
  templateUrl: './list-delay-statement-list.component.html',
  styleUrls: ['./list-delay-statement-list.component.scss']
})
export class ListDelayStatementListComponent implements OnInit {
  view = true;
  showPreview = false;
  previewData = ""
  role = null;
  checked = true;
  showFilter = false;
  clearfilter;
  searchParam: string = "";
  ballotList: any = [];
  allBallotList: any = [];
  filterCheckboxes: any = [];
  columns: any = {
    listNo: true,
    date: true,
    status: true,
    approvedDate: false,
    layingDate: false,
    actions: false,
    preview: false,
    setToLob: false
  }
  filterSelected: object;
  filters: object;
  filterDates: any = [];
  listNos: any = [];
  layingDates: any = [];
  buttonList: any = [];
  currentUser: UserData;
  action: string = "";
  assemblySession: object = [];
  setDelay = false;
  approvedList = false;
  listForAction = false;
  constructor(
    private question: QuestionService,
    private router: Router,
    private auth: AuthService,
    private rbsService: QuestionRBSService,
    private notify: NotificationCustomService
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
    if (
      this.router.url.includes("set-delay-statement-list")) {
      this.filterCheckboxes.push({ label: "Laying Date", checked: false });
      this.columns.layingDate = true;
      this.columns.actions = true;
      this.columns.preview = true;
      this.columns.setToLob = true;
      this.view = false;
      this.setDelay = true;
      this.getApprovedAnswerStatuslist();
    }
    else if (
      this.router.url.includes("approved-delay-statement-list")) {
      this.filterCheckboxes.push({ label: "Laying Date", checked: false });
      this.columns.approvedDate = true;
      this.columns.layingDate = true;
      this.columns.actions = true;
      this.columns.preview = true;
      this.columns.setToLob = false;
      this.view = false;
      this.approvedList = true;
      this.getApprovedAnswerStatuslist();
    } else {
       this.listForAction = true;
      this.getAnswerStatuslist();
    }
  }

  getAnswerStatuslist() {
    this.ballotList = this.allBallotList = [];
    this.question
      .getPendingDelayStatementList(this.role
      )
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          res = res.filter(el => el.assemblyId == this.assemblySession["assembly"].currentassembly &&
            el.sessionId === this.assemblySession["session"].currentsession);
          this._rebuildData(res);
        }
      });
  }

  getApprovedAnswerStatuslist() {
    this.ballotList = this.allBallotList = [];
    this.question
      .getApprovedDelayStatementList(this.assemblySession["assembly"].currentassembly, this.assemblySession["session"].currentsession)
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          res = res.filter(el => el.assemblyId == this.assemblySession["assembly"].currentassembly &&
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
      { label: "List No", checked: false }

    ];
    this.filterSelected = {
      date: null,
      status: null,
      listNo: null,
      layingDate: null

    };
    this.filters = {
      showdate: false,
      showstatus: false,
      showListNo: false,
      showLayingDate: false
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
    this.filters["showListNo"] = this.filterCheckboxes.find(
      (element) => element.label === "List No"
    ).checked;
    let layDate = this.filterCheckboxes.find(
      (element) => element.label === "Laying Date");
    if (layDate)
      this.filters["showLayingDate"] = layDate.checked;
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
          element.status.toLowerCase().includes(this.searchParam.toLowerCase()) ||
          element.id.toString().toLowerCase().includes(this.searchParam.toLowerCase())
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
        this.filters["showListNo"] = false;
        this.filterSelected["listNo"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "List No") {
            element.checked = false;
          }
        });
      case 4:
        this.filters["showLayingDate"] = false;
        this.filterSelected["layingDate"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Laying Date") {
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
    let counter2 = 0;
    let counter3 = 0;
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
    this.filters["showListNo"]
      ? Object.keys(self.ballotList).forEach(function (key) {
        counter2++;
        self.listNos.push(self.ballotList[key].id);
        if (counter2 == self.ballotList.length) {
          self.listNos = self.listNos.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    this.filters["showLayingDate"]
      ? Object.keys(self.ballotList).forEach(function (key) {
        counter3++;
        if (self.ballotList[key].layingDate)
          self.layingDates.push(self.ballotList[key].layingDate);
        if (counter3 == self.ballotList.length) {
          self.layingDates = self.layingDates.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
  }
  viewBallot(list) {
    if (this.view) {
      if (list.status === 'SAVED') {
        this.router.navigate([
          "business-dashboard/question/submit-delay-statement-list",
          list.id
        ]);
      }
      else {
        this.router.navigate([
          "business-dashboard/question/process-delay-statement-list",
          list.id
        ]);
      }
    }
  }
  _rebuildData(res) {
    res.forEach(element => {
      element.date = this.question.formatDateDDMMYYYY(new Date(Date.parse(element.createDateTime)));
      element.listNo = element.id
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

  showPreviewModal(id) {
    this.question.getDelayStatementPreviewHtml(id).subscribe((res: any) => {
      if ((res)) {
        this.previewData = res;
        let bodyControl = document.getElementsByTagName("body")[0];
        bodyControl.classList.add("questionbooklet");
        this.showPreview = true;
      }
    })

  }
  cancelPreview() {
    let bodyControl = document.getElementsByTagName("body")[0];
    bodyControl.classList.remove("questionbooklet");
    this.showPreview = false;
    this.previewData = "";
  }

  setToLOB(id) {
    alert("Functionality Not Implemented..");
    // this.question.setDelayStatementListToLob(id).subscribe(res => {
    //   if (res) {
    //     this.notify.showSuccess("Success", "Added to LOB.");
    //     this.getAnswerStatuslist();
    //   }
    // })
  }
}
