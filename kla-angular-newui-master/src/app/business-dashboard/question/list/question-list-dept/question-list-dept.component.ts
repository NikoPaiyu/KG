import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { QuestionList } from "../../shared/model/question";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-question-list-dept",
  templateUrl: "./question-list-dept.component.html",
  styleUrls: ["./question-list-dept.component.scss"],
})
export class QuestionListDeptComponent implements OnInit {
  isChecked = true;
  isAllDisplayDataChecked = false;
  noticeStatus = true;
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
  type;
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
    this.filterSelected["isQuestion"] = this._defineFromRouterUrl();
    if (this.statusParam === "SHORT_NOTICE" || this.statusParam === "NORMAL") {
      this.noticeStatus = false;
    }
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
  getQuestionsByStatus(status) {
    this.question
      .getQuestionByStatus(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        status,
        this._IsAs() || this._IsMinister()
          ? this.auth.getCurrentUser().userId
          : null,
        this.type ? this.type : "",
        this._IsMinister() ? "QUESTION" : null
      )
      .subscribe((res: any) => {
        this.sortbyAssemblyAndSessionId(res);
      });
  }
  getAllPublishedQuestions() {
    let body = {
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
    };
    this.question.getAllPublishedQuestions(body).subscribe((res: any) => {
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  getAllPendingWithdrawal() {
    this.question
      .getAllPendingWithdrawal(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.role,
        this.filterSelected["isQuestion"],
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        //this.filterSelected["status"] = this.statusParam;
        this.sortbyAssemblyAndSessionId(res);
      });
  }
  getAllPendingCorrectionrequest() {
    this.question
      .getAllPendingCorrectionrequest(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.role,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        // this.filterSelected["status"] = "CHANGE_IN_REPLY_REQUEST";
        this.sortbyAssemblyAndSessionId(res);
      });
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
      let stages = ["QUESTION","ANSWERED","TAKEN"];
      if (stages.includes(CurrentStage)) {
          return true;
      }
      return false;
  }
  getChangeReplyQuestions() {
    this.question
      .getRequestForChangeReply(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        this.sortbyAssemblyAndSessionId(res);
      });
  }
  getNoticesListByOwner() {
    let body = {
      memberId: this.auth.getCurrentUser().userId,
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      // primaryFlag : this.primaryFlag,
      type: null,
      status: this.statusParam,
      submittedBy: "",
    };
    this.question.getNoticesListByMlaPpoQsa(body).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  getlistViewByAnswersection() {
    this.question
      .getlistViewByAnswersection(this.auth.getCurrentUser().userId)
      .subscribe((res: any) => {
        this.sortbyAssemblyAndSessionId(res);
      });
  }
  getlistViewByQuestionsection() {
    this.question
      .getlistViewByQuestionsection(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.role,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        this.listOfDisplayData = this.listOfAllData = res;
        if (this.statusParam) {
          if (
            this.statusParam === "SHORT_NOTICE" ||
            this.statusParam === "NORMAL"
          ) {
            this.filterSelected["type"] = this.statusParam;
          } else {
            this.filterSelected["status"] = this.statusParam;
          }
        }
        this._applyFilterForAssembly(res);
      });
  }
  getlistViewByPpo() {
    this.question
      .getlistViewByPpo(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.statusParam,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        this.listOfDisplayData = this.listOfAllData = res;
        this._applyFilterForAssembly(res);
      });
  }
  sortbyAssemblyAndSessionId(res) {
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
    this.listOfDisplayData = this.listOfAllData = this.listOfData = [];
    if (!this._redirectBasedOnStatus()) {
      if (
        this.auth.getCurrentUser().authorities.includes(this._defineRoles()[10])
      ) {
        this.role = this._defineRoles()[10];
        this.getlistViewByQuestionsection();
      } else if (
        this.auth.getCurrentUser().authorities.includes(this._defineRoles()[1])
      ) {
        this.getlistViewByPpo();
      } else if (
        this.auth
          .getCurrentUser()
          .authorities.includes(this._defineRoles()[2]) &&
        this.statusParam === "SAVED"
      ) {
        this.getNoticesListByOwner();
      } else if (
        this.auth.getCurrentUser().authorities.includes(this._defineRoles()[11])
      ) {
        this.getlistViewByAnswersection();
      } else {
        this.getlistViewByQuestionsection();
      }
    }
  }
  viewQuestion(list: QuestionList) {
    this.statusParam = this.statusParam ? this.statusParam : "";
    this._setLocalStorage();
    if (list.status === "SAVED") {
      this.router.navigate([
        "business-dashboard/question/question-edit",
        list.id,
        this.statusParam,
      ]);
    } else if (this.auth.getCurrentUser().authorities.includes("Department")) {
      this.router.navigate([
        "business-dashboard/question/question-answer",
        list.id,
      ]);
    } else if (this.primaryFlag) {
      this.router.navigate([
        "business-dashboard/question/question-view",
        list.id,
        this.statusParam,
        this.primaryFlag,
      ]);
    } else if (this._IsMinister() && this.statusParam === "CORRECTION") {
      this.router.navigate([
        "business-dashboard/question/question-correctionview",
        list.id,
        this.statusParam,
      ]);
    } else {
      this.router.navigate([
        "business-dashboard/question/question-view",
        list.id,
        this.statusParam,
      ]);
    }
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
    tablefilter.regdatedisable = this.filterCheckboxes.find(
      (element) => element.label === "Created Date"
    ).checked;
    if (!this._IsQuestion()) {
    tablefilter.prioritydisable = this.filterCheckboxes.find(
      (element) => element.label === "Priority"
    ).checked;
    }
    tablefilter.statusdisable = this.filterCheckboxes.find(
      (element) => element.label === "Status"
    ).checked;
    if (this._IsQs()) {
      tablefilter.TMdisable = this.filterCheckboxes.find(
        (element) => element.label === "TM"
      ).checked;
      tablefilter.TDdisable = this.filterCheckboxes.find(
        (element) => element.label === "TD"
      ).checked;
      tablefilter.returneddisable = this.filterCheckboxes.find(
        (element) => element.label === "Returned"
      ).checked;
    }
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
        (element.clubbingDetails &&
          element.clubbingDetails.find(
            (element) => (element.noticeNumber && element.noticeNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()
              )))) ||
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
              .includes(this.searchParam.toLowerCase())) ||
          (element.submittedUserRole &&
            element.submittedUserRole
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } 
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.disable;
    switch (fliterNum) {
      case 2:
        tablefilter.categorydisable = false;
        this.filterSelected["category"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Category") {
            element.checked = false;
          }
        });
        break;
      case 3:
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
      case 4:
        tablefilter.subjectdisable = false;
        this.filterSelected["subjectName"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Subject") {
            element.checked = false;
          }
        });
        break;
      case 5:
        tablefilter.questiondatedisable = false;
        this.filterSelected["questionDate"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Question Date") {
            element.checked = false;
          }
        });
        break;
      case 6:
        tablefilter.regdatedisable = false;
        this.filterSelected["registrationDate"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Created Date") {
            element.checked = false;
          }
        });
        break;
      case 7:
        tablefilter.prioritydisable = false;
        this.filterSelected["priority"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Priority") {
            element.checked = false;
          }
        });
        break;
      case 8:
        tablefilter.statusdisable = false;
        this.filterSelected["status"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Status") {
            element.checked = false;
          }
        });
        break;
      case 9:
        tablefilter.TMdisable = false;
        this.filterSelected["tmstatus"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "TM") {
            element.checked = false;
          }
        });
        break;
      case 10:
        tablefilter.TDdisable = false;
        this.filterSelected["tdstatus"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "TD") {
            element.checked = false;
          }
        });
        break;
        case 11:
          tablefilter.returneddisable = false;
          this.filterSelected["isReturned"] = null;
          this.filterCheckboxes.forEach((element) => {
            if (element.label == "Returned") {
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
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    let counter4 = 0;
    let counter5 = 0;
    let counter6 = 0;
    let counter7 = 0;
    let counter8 = 0;
    let counter9 = 0;
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
    tablefilter.regdatedisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter5++;
          tablefiltrData.regdate.push(self.listOfAllData[key].registrationDate);
          if (counter5 == self.listOfAllData.length) {
            tablefiltrData.regdate = tablefiltrData.regdate.filter(
              (v, i, a) => a.indexOf(v) === i
            );
            tablefiltrData.regdate.sort();
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
    tablefilter.noticenumberdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
          counter9++;
          const clubbedMemberDetails = self.listOfAllData[key].clubbingDetails;
          clubbedMemberDetails.forEach(function (key) {
            tablefiltrData.noticeNumbers.push(key.noticeNumber);
          });
          if (counter1 === self.listOfAllData.length) {
            tablefiltrData.noticeNumbers = tablefiltrData.noticeNumbers.filter(
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
    this.inputSearch();
  }
  applyFilter(element: any, filter: any): boolean {
    element.Qstatus = element.status.replace(/_/g, " ");
    for (const field in filter) {
      if (filter[field]) {
        if (field === "noticeNumber") {
          element.clubbingDetails.forEach(function (clubbed) {
            if (
              !clubbed[field] ||
              clubbed[field].toLowerCase() !== filter[field].toLowerCase()
            ) {
              return false;
            } else if (typeof filter[field] === "number") {
              if (clubbed[field] !== filter[field]) {
                return false;
              }
            }
          });
        } else if (field === "heading") {
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
        } else if (field === "tmstatus") {
          if (element[field].toString() == filter[field].toString()) {
          } else {
            return false;
          }
        } else if (field === "tdstatus") {
          if (element[field].toString() == filter[field].toString()) {
          } else {
            return false;
          }
        }else if (field === "isReturned") {
          if (element[field] && element[field].toString() == filter[field].toString()) {
            return true;
          } else {
            return false;
          }
        } else if (field === "type") {
          if (
            !element[field] ||
            element[field].toLowerCase() !== filter[field].toLowerCase()
          ) {
            return false;
          }
        } else if (field === "submittedUserRole") {
          if (filter[field] !== "All") {
            if (
              !element[field] ||
              element[field].toLowerCase() !== filter[field].toLowerCase()
            ) {
              return false;
            }
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
  _redirectBasedOnStatus() {
    if (this._IsQs()) {
      if (this.router.url === "/business-dashboard/question/snq-list") {
        this.getApprovedShortNoticeQuestion();
        return true;
      }
      if (this.statusParam) {
        if (this.statusParam === "PULL") {
          this.getAllNoticesForPull();
          return true;
        } else if (this.statusParam === "TRACKALL") {
          this.getAllNoticesForTrack();
          return true;
        } else if (this.statusParam === "CORRECTION") {
          this.getCorrectionRequestAfterSabha();
          return true;
        } else if (this.statusParam === "CORRECTION_AFTER") {
          this.pendingCorrectionRequestAfterSabha();
          return true;
        } else if (this.statusParam === "CORRECTION_REQUEST") {
          this.getAllPendingCorrectionrequest();
          return true;
        } else if (
          this.statusParam === "CLUBBING_REMOVE" ||
          this.statusParam === "CLUBBING_REMOVE_QUESTION"
        ) {
          this.getlistofClubbedMemberWithdraw();
          return true;
        } else if (this.statusParam === "PENDING_FOR_WITHDRAWAL") {
          this.getAllPendingWithdrawal();
          return true;
        } else if (this.statusParam === "IsChange") {
          this.isChanged = true;
          this.getChangeReplyQuestions();
          return true;
        } else if (
          this.statusParam !== "SAVED" &&
          this.statusParam !== "SHORT_NOTICE" &&
          this.statusParam !== "NORMAL"
        ) {
          if (this.statusParam === "SUBMITTED") {
            this.getlistViewByQuestionsection();
            return true;
          } else if (this.statusParam === "WITHDRAWN_NOTICE") {
            this.getWithdrawnNotices();
            return true;
          } else if (this.statusParam === "WITHDRAWN_QUESTION") {
            this.getWithdrawnQuestion();
            return true;
          } else if (this.statusParam === "ALL_ANSWERED") {
            this.getAllAnsweredQuestion();
            return true;
          } else if (this.statusParam === "CLAIMED") {
            this.getClaimedByNotices();
            return true;
          }  else if (this.statusParam === "PUBLISHED") {
            this.getAllPublishedQuestions();
            return true;
          }else {
            this.getQuestionsByStatus(this.statusParam);
            return true;
          }
        }
      }
    }
    if (this._IsAs() && this.statusParam) {
      if (this.statusParam === "WAITING_FOR_ANSWER") {
        this.getlistViewByAnswersection();
      } else if (this.statusParam === "ALL_ANSWERED") {
        this.getAllAnsweredQuestion();
        return true;
      } else if (this.statusParam === "SNQ_ANSWER") {
        this.getAllSNQAnsweredQuestion();
        return true;
      } else if (this.statusParam === "RETURNED") {
        this.getAllNoticesReturned();
        return true;
      } else if (this.statusParam === "FOR_CORRECTION") {
        this.getAllForCorrection();
        return true;
      } else {
        this.getQuestionsByStatus(this.statusParam);
      }
      return true;
    }
    if (this._IsMinister()) {
      if (this.statusParam === "CORRECTION") {
        this.getCorrectionRequestAfterSabha();
        return true;
      } else if (this.statusParam === "SNQ_ANSWER") {
        this.type = "SHORT_NOTICE";
      } else {
        this.type = "NORMAL";
      }
      this.getQuestionsByStatus("");
      return true;
    }
    return false;
  }
  getClaimedByNotices() {
    let body = {
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      role: this.role,
      userId: this.auth.getCurrentUser().userId
    };
    this.question.getClaimedByNotices(body).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  getApprovedShortNoticeQuestion() {
    let body = {
      assemblyId: this.assemblySession["assembly"].currentassembly,
      sessionId: this.assemblySession["session"].currentsession,
      stage: "QUESTION",
      type: "SHORT_NOTICE",
    };
    this.question.getApprovedShortNoticeQuestion(body).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  getWithdrawnNotices() {
    this.question
      .getWithdrawnNotices(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }
  getWithdrawnQuestion() {
    this.question
      .getWithdrawnQuestion(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }
  getAllAnsweredQuestion() {
    this.question
      .getAllAnsweredQuestion(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this._IsAs() ? this.auth.getCurrentUser().userId : null
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }
  getAllSNQAnsweredQuestion() {
    this.question
      .getAllSNQAnsweredQuestion(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }
  _IsQs() {
    if (
      this.auth.getCurrentUser().authorities.includes(this._defineRoles()[10])
    ) {
      this.role = this._defineRoles()[10];
      return true;
    } else if (
      !this.auth
        .getCurrentUser()
        .authorities.includes(this._defineRoles()[0]) &&
      !this.auth
        .getCurrentUser()
        .authorities.includes(this._defineRoles()[1]) &&
      !this.auth.getCurrentUser().authorities.includes(this._defineRoles()[11])
    ) {
      return true;
    }
    return false;
  }
  _IsAs() {
    return this.auth
      .getCurrentUser()
      .authorities.includes(this._defineRoles()[11]);
  }
  _IsMinister() {
    return this.auth
      .getCurrentUser()
      .authorities.includes(this._defineRoles()[12]);
  }
  _redirectToList() {
    this.listOfDisplayData = this.listOfAllData = this.listOfData = [];
    this._redirectBasedOnRouter();
    if (!this._redirectBasedOnStatus()) {
      if (
        this.auth.getCurrentUser().authorities.includes(this._defineRoles()[10])
      ) {
        this.role = this._defineRoles()[10];
        this.getlistViewByQuestionsection();
      } else if (
        this.auth.getCurrentUser().authorities.includes(this._defineRoles()[1])
      ) {
        this.getlistViewByPpo();
      } else if (
        this.auth
          .getCurrentUser()
          .authorities.includes(this._defineRoles()[2]) &&
        this.statusParam === "SAVED"
      ) {
        this.getNoticesListByOwner();
      } else if (
        this.auth.getCurrentUser().authorities.includes(this._defineRoles()[11])
      ) {
        this.getlistViewByAnswersection();
      } else {
        this.getlistViewByQuestionsection();
      }
    }
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
  _redirectBasedOnRouter() {
    if (this.router.url === "/business-dashboard/question/apprv-list") {
      this.statusParam = "APPROVED";
      this.type = "NORMAL";
    } else if (this.router.url === "/business-dashboard/question/withdr-list") {
      this.statusParam = "WITHDRAWN_NOTICE";
    } else if (
      this.router.url === "/business-dashboard/question/withdr-list-qus"
    ) {
      this.statusParam = "WITHDRAWN_QUESTION";
    } else if (
      this.router.url === "/business-dashboard/question/disallw-list"
    ) {
      this.statusParam = "DISALLOWED";
    }  else if (this.router.url === "/business-dashboard/question/answd-list") {
      this.statusParam = "ALL_ANSWERED";
    } else if (this.router.url === "/business-dashboard/question/tkn-list") {
      this.statusParam = "FOR_CORRECTION";
    } else if (this.router.url === "/business-dashboard/question/ac-list") {
      this.statusParam = "CHANGE_IN_REPLY_APPROVED";
    } else if (this.router.url === "/business-dashboard/question/svd-list") {
      this.statusParam = "SAVED";
    } else if (this.router.url === "/business-dashboard/question/pull-list") {
      this.statusParam = "PULL";
    } else if (this.router.url === "/business-dashboard/question/all-list") {
      this.statusParam = "TRACKALL";
    } else if (
      this.router.url === "/business-dashboard/question/correctn-list"
    ) {
      this.statusParam = "CORRECTION";
    } else if (
      this.router.url === "/business-dashboard/question/ac-aftr-list"
    ) {
      this.statusParam = "REQUEST_FOR_CORRECTION_OF_ANSWER_APPROVED";
    } else if (
      this.router.url === "/business-dashboard/question/list-snq-ans"
    ) {
      this.statusParam = "SNQ_ANSWER";
    } else if (
      this.router.url === "/business-dashboard/question/returned-list"
    ) {
      this.statusParam = "RETURNED";
    } else if (this.router.url === "/business-dashboard/question/snq-list") {
      this.statusParam = "SNQ_LIST";
    }else if (this.router.url === "/business-dashboard/question/published-list") {
      this.statusParam = "PUBLISHED";
    }
  }
  _defineFromRouterUrl() {
    if (
      this.router.url.includes("/business-dashboard/question/list-dept-qus")
    ) {
      return true;
    }
    if (
      this.router.url.includes("/business-dashboard/question/list-dept-ntc")
    ) {
      return false;
    }
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
    this.tablefiltrParams.disable = {
      categorydisable: true,
      questionheadingdisable: false,
      subjectdisable: false,
      questiondatedisable: true,
      regdatedisable: false,
      prioritydisable: false,
      statusdisable: false,
      noticenumberdisable: false,
      TMdisable: false,
      TDdisable: false,
      returneddisable: false,
    };
    this.tablefiltrParams.data = {
      noticeNumbers: [],
      category: [],
      questionheading: [],
      submittedBy: [],
      subject: [],
      questiondate: [],
      regdate: [],
      priority: [],
      status: [],
      minister: [],
      TM: [
        { label: "Transferred", value: true },
        { label: "Not Transferred", value: false },
      ],
      TD: [
        { label: "Transferred", value: true },
        { label: "Not Transferred", value: false },
      ],
      returned: [
        { label: "Returned", value: true }
      ],
    };
    this.filterCheckboxes = [
      { label: "Question Heading", checked: false },
      { label: "Subject", checked: false },
      { label: "Created Date", checked: false },
      { label: "Status", checked: false },
    ];
    this.filterSelected = {
      assembly: null,
      session: null,
      noticeNumber: null,
      category: null,
      heading: null,
      subjectName: null,
      questionDate: null,
      registrationDate: null,
      priority: null,
      status: null,
      type: null,
      submittedUserRole: null,
      isQuestion: false,
      tmstatus: false,
      tdstatus: false,
      isReturned: false,
    };
    if (!this._IsQuestion()) {
      let find = this.filterCheckboxes[
        this.filterCheckboxes.findIndex((x) => x.label === "Question Heading")
      ];
      find.label = "Notice Heading";
      this.filterCheckboxes.push({ label: "Priority", checked: false });
    }
    if (this._IsQs()) {
      this.filterCheckboxes.push({ label: "TM", checked: false });
      this.filterCheckboxes.push({ label: "TD", checked: false });
      this.filterCheckboxes.push({ label: "Returned", checked: false });
    }
  }
  _IsQuestion() {
    if (this._IsQs()) {
      let routeStatus = ['CORRECTION_REQUEST','CORRECTION_AFTER' ]
      if (this.router.url === "/business-dashboard/question/svd-list") {
        return false;
      }
      if (
        this.router.url.includes("/business-dashboard/question/list-dept-qus")
      ) {
        return true;
      }
      if (this.router.url === "/business-dashboard/question/withdr-list-qus") {
        return true;
      }
      if (this.router.url === "/business-dashboard/question/snq-list") {
        return true;
      }
      if (routeStatus.includes(this.statusParam)) {
        return true;
      }
    }
    if (this.router.url === "/business-dashboard/question/answd-list") {
      return true;
    }
    if (this._IsAs() || this._IsMinister()) {
      return true;
    }

    return false;
  }
  _IslistNotice() {
    if (this.router.url === "/business-dashboard/question/svd-list") {
      return true;
    }
    return false;
  }

  getAllNoticesForPull() {
    this.question
      .getAllNoticesForPull(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.role
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }

  getAllNoticesForTrack() {
    this.question
      .getAllNoticesForTrack(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.role
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }

  getAllNoticesReturned() {
    this.question
      .getAllNoticesReturned(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.role
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }
  getCorrectionRequestAfterSabha() {
    this.question
      .getCorrectionRequestAfterSabha(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }
  pendingCorrectionRequestAfterSabha() {
    this.question
      .pendingCorrectionRequestAfterSabha(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.role,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
  }
  getAllForCorrection() {
    let type = "NORMAL";
    this.question
      .getAllForCorrection(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        type,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        if (res) this.renderDisplayData(res);
      });
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
      this.filterSelected["isQuestion"] = this._defineFromRouterUrl();
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
  isShortNoticeList() {
    if (this.router.url === "/business-dashboard/question/snq-list" ||
        this.router.url === "/business-dashboard/question/list-snq-ans") {
      return true;
    }
    return false;
  }

  isDepartment() {
    if (this.auth.getCurrentUser().correspondenceCode && this.auth.getCurrentUser().correspondenceCode.type === 'DEPARTMENT') {
      return true;
    } else {
      return false;
    }
  }
}
