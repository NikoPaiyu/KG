import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../../../auth/shared/services/auth.service";
import { UserData } from "../../../../auth/shared/models";
import { NzModalService } from "ng-zorro-antd/modal";
import { NotificationCustomService } from "../../../../shared/services/notification.service";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { forkJoin } from 'rxjs';
import { BookletPreviewComponent } from '../../shared/component/booklet-preview/booklet-preview.component';

@Component({
  selector: "app-question-ballot-view",
  templateUrl: "./question-ballot-view.component.html",
  styleUrls: ["./question-ballot-view.component.scss"],
})
export class QuestionBallotViewComponent implements OnInit {
  previewData = {};
  configurableParms = {
    minTitleChar: 0,
    maxTitleChar: 100,
    minClauseWord: 0,
    maxReasonChar: 255,
  };
  assembly;
  session;
  searchParam = "";
  ballotList: any = [];
  allBallotList: any = [];
  questionDate = "";
  buttonList: any = [];
  ballotId: number;
  currentUser: UserData;
  showSetTolob = false;
  isBallotApproved = true;
  action: string = "";
  assemblySession: object = [];
  shownotice = false;
  showVersion = false;
  questionVersion;
  selectedVersion = null;
  currentVersion = null;
  editable = false;
  clauseNo = ["A", "B", "C", "D", "E", "F", "G", "H"];
  versionsCombo = [];
  ClubbedMembers = { show: false, data: [] };
  listStatus = '';
  constructor(
    private question: QuestionService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private modalService: NzModalService,
    private notify: NotificationCustomService,
    private rbsService: QuestionRBSService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.setRouterData();
  }

  ngOnInit() {
    this.loadRBSPermissions();
    this.getAssemblySession();
    this.route.params.subscribe((params) => {
      this.action = params["action"] ? params["action"] : "";
      if (params["date"]) {
        this.questionDate = params["date"];
        // this.buttonList.AddToLOB
        //   ? this.getquestionsForTheDay()
        // :
        this.allotedQuestionsForTheDay();
      }
    });
  }
  loadRBSPermissions() {
    this.rbsService
      .getQuestionPermissions(this.currentUser.userId)
      .subscribe(() => {
        this.buttonList = this.rbsService.getrbsPermissionForBallot();
      });
  }
  getquestionsForTheDay() {
    this.question
      .getquestionsForTheDay(this.questionDate)
      .subscribe((res: any) => {
        if (res && res.lines) {
          this.ballotId = res.id;
          this.assembly = res.assemblyId;
          this.session = res.sessionId;
          this.isBallotApproved = (res.status === "FINAL" || res.status === "SENT") ? true : false;
          this._setBallotResultResult(res.lines, res.status);
        }
      });
  }
  allotedQuestionsForTheDay() {
    this.question
      .allotedQuestionsForTheDay(this.questionDate)
      .subscribe((res: any) => {
        if (res && res.lines) {
          this.ballotId = res.id;
          this.assembly = res.assemblyId;
          this.session = res.sessionId;
          this.isBallotApproved = (res.status === "FINAL" || res.status === "SENT") ? true : false;
          this._setBallotResultResult(res.lines, res.status);
        }
      });
  }
  _setBallotResultResult(ballotRes, status) {
    const ballotData = [];
    ballotRes.forEach((value, index) => {
      value.heading = "";
      value.takentoLOB = false;
      if (value.questionId && value.question) {
        value.heading = value.question.heading;
        value.takentoLOB = value.question.status == "TAKEN" ? true : false;
        value.cansettoLOB = status === "FINAL" ? true : false;
        this.showSetTolob = status === "FINAL" ? true : false;
        ballotData.push(value);
      } else {
        status === "INTERIM" ? ballotData.push(value) : "";
      }
    });
    ballotData.sort((a, b) => (a.ballotingOrder > b.ballotingOrder ? 1 : -1));
    ballotData.forEach((value, index) => {
      value.slNo = index + 1;
    });
    this.ballotList = this.allBallotList = ballotData;
    console.log(this.ballotList);
  }

  sort(sort: { key: string; value: string }): void {
    const data = this.ballotList.filter((item) => item);
    if (sort.key && sort.value) {
      this.ballotList = data.sort((a, b) =>
        sort.value === "ascend"
          ? this._sortQuestionAsc(a, b, sort)
            ? 1
            : -1
          : this._sortQuestionDesc(a, b, sort)
            ? 1
            : -1
      );
    } else {
      this.ballotList = data;
    }
  }

  _sortQuestionAsc(a, b, sort) {
    if (a[sort.key] && b[sort.key]) {
      return (
        (typeof a[sort.key!] === "number"
          ? a[sort.key!]
          : a[sort.key!].toLowerCase()) >
        (typeof b[sort.key!] === "number"
          ? b[sort.key!]
          : b[sort.key!].toLowerCase())
      );
    }
  }
  _sortQuestionDesc(a, b, sort) {
    if (a[sort.key] && b[sort.key]) {
      return (
        (typeof b[sort.key!] === "number"
          ? b[sort.key!]
          : b[sort.key!].toLowerCase()) >
        (typeof a[sort.key!] === "number"
          ? a[sort.key!]
          : a[sort.key!].toLowerCase())
      );
    }
  }
  onSearch() {
    this.ballotList = this.allBallotList;
    if (this.searchParam) {
      this.ballotList = this.allBallotList.filter(
        (element) =>
          element.memberName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.slNo.toString().includes(this.searchParam) ||
          element.heading.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    } else {
      this.ballotList = this.allBallotList;
    }
  }
  cancelBallot() {
    this.question.cancelSettingUp(this.questionDate).subscribe((res: any) => {
      this.notify.showSuccess("Success", "Success");
      this.onBack();
      this.ballotList = [];
    });
  }
  approveBallot() {
    if (this.ballotId) {
      this.question.approveBallot(this.ballotId).subscribe((res: any) => {
        this.notify.showSuccess("Success", "Success");
        this.onBack();
      });
    }
  }
  sendToDept() {
    if (this.ballotId) {
      this.question.sendToDept(this.ballotId).subscribe((res: any) => {
        this.notify.showSuccess("Success", "Success");
        this.onBack();
      });
    }
  }
  _confrmLOB(index, question) {
    if (question.cansettoLOB) {
      this.modalService.confirm({
        nzClassName: "pdng",
        nzContent: "Do you want to add this question to LOB?",
        nzOkText: "OK",
        nzCancelText: "Cancel",
        nzOnOk: () => this._setQuestionsForLOB(question),
        nzOnCancel: () => this._removeSelection(question),
      });
    }
  }
  _setQuestionsForLOB(question) {
    this.question.setToLob(question.questionId).subscribe((res: any) => {
      this.notify.showSuccess("Success", "Question added to LOB succesfully");
      question.takentoLOB = true;
    });
  }
  _removeSelection(question) {
    question.takentoLOB = false;
  }
  onBack() {
    if (this.action === "apv") {
      this.router.navigate([
        "/business-dashboard/question/question-ballot-approve",
      ]);
    } else if (this.action === "lob") {
      this.router.navigate(["/business-dashboard/question/question-settolob"]);
    } else if (this.action === "dept") {
      this.router.navigate(["/business-dashboard/question/question-senddept"]);
    } else {
      this.router.navigate([
        "/business-dashboard/question/question-ballot-list",
      ]);
    }
  }
  _desidePageTitle() {
    if (this.action === "apv") {
      if (!this.isBallotApproved) { this.shownotice = true; }
      return "Setting Of Question";
    } else if (this.action === "lob") {
      return "Set to LOB";
    } else if (this.action === "dept") {
      return "Send to Department";
    } else {
      return "Balloting for " + this._formatDate();
    }
  }
  _showClubbedMembers(clubbedMembers) {
    this.ClubbedMembers.show = true;
    this.ClubbedMembers.data = clubbedMembers;
  }
  _formatDate() {
    let dateArr = [];
    dateArr = this.questionDate.split("-");
    return dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
  }

  getPreviewData() {
    this.previewData = {};
    this.question
      .getStarredPreviewData(this.questionDate)
      .subscribe((res: any) => {
        this.previewData = res ? res : {};
        this.createPreviewModal();
      });
  }

  createPreviewModal() {
    this.modalService.create({
      nzContent: BookletPreviewComponent,
      nzWidth: '800',
      nzFooter: null,
      nzComponentParams: {
        previewData: this.previewData,
        assembly: this.assemblySession["assembly"].find(element => element.id == this.assembly).assemblyId
        ,
        session: this.assemblySession["session"].find(element => element.id == this.session).sessionId

      }
    });
  }

  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
      }
    });
  }

  showVersionModal(id) {
    this.getCurrentVersionDetails(id);
    this.editable = false;
    this.showVersion = true;
  }
  getCurrentVersionDetails(id) {
    if (id) {
      this.question.getVersionsList(id).subscribe((res: any) => {
        this.versionsCombo = res.versionDtails;
        this.versionsCombo.forEach((element) => {
          if (element.owner.roles.length > 1) {
            element.owner.roles.forEach((ele) => {
              if (ele.roleName == "speaker") {
                element.ROLE = "Speaker";
              }
            });
          } else {
            element.ROLE = element.owner.roles[0].roleName;
          }
        });
        this.questionVersion = res.current.question;
        this.selectedVersion = res.current.id;
        this.currentVersion = res.current.id;
        if (this.questionVersion.category === "UNSTARRED") {
          this.questionVersion.priority = null;
        }
        if (
          this.questionVersion.assemblyId &&
          this.questionVersion.sessionId &&
          this.assemblySession
        ) {
          this.questionVersion.assemblyId = this.assemblySession[
            "assembly"
          ].find(
            (item) => item.id === this.questionVersion.assemblyId
          ).assemblyId;
          this.questionVersion.sessionId = this.assemblySession["session"].find(
            (item) => item.id === this.questionVersion.sessionId
          ).sessionId;
        }
      });
    }
  }
  getVersionDetailsById(versionId) {
    if (this.currentVersion != versionId) {
      this.editable = false;
    }
    this.question.getVersionById(versionId).subscribe((res) => {
      this.questionVersion = {};
      this.questionVersion = res.question;
      if (
        this.questionVersion.assemblyId &&
        this.questionVersion.sessionId &&
        this.assemblySession
      ) {
        this.questionVersion.assemblyId = this.assemblySession["assembly"].find(
          (item) => item.id === this.questionVersion.assemblyId
        ).assemblyId;
        this.questionVersion.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.questionVersion.sessionId
        ).sessionId;
      }
    });
  }
  cancelVersion() {
    this.showVersion = false;
    this.editable = false;
    this.questionVersion = {};
  }

  onEditNotice(questionVersion) {
    this.editable = true;
  }

  onSaveEditedNotice(questionVersion) {
    if (this._isFormValid(questionVersion)) {
      let data = {
        "questionId": questionVersion.id,
        "clauses": this._keepClauseOrder(questionVersion.clauses),
        "heading": questionVersion.heading,
        "editedBy": this.authService.getCurrentUser().userId
      }
      this.question.saveFromSettingUp(data).subscribe(res => {
        this.notify.showSuccess("Success", "Updated.");
        this.editable = false;
        this.allotedQuestionsForTheDay();
        this.cancelVersion();
      })
    }

  }

  onCancelEditNotice() {
    this.getVersionDetailsById(this.selectedVersion);
    this.editable = false;
  }

  _isFormValid(questionVersion) {
    if (this._isAllClauseValid(questionVersion)) {
      return true;
    }
    return false;
  }

  _isAllClauseValid(questionVersion) {
    let counter = 0;
    if (!this._validateCharLimitForHeading(questionVersion)) {
      return false;
    }
    if (questionVersion.clauses) {
      let clauselegth = questionVersion.clauses.length;
      for (const i in questionVersion.clauses) {
        counter++;
        if (!this._hasMinClauseWordCount(questionVersion.clauses[i].clause, i)) {
          return false;
        }
      }
      return true;
    }
  }
  _hasMinClauseWordCount(clause, index) {
    clause = clause.replace(/(\r\n|\n|\r)/gm, " ");
    clause = clause.replace(/(^\s*)|(\s*$)/gi, "");
    clause = clause.replace(/[ ]{2,}/gi, " ");
    const count = clause.split(" ").length;
    if (count < this.configurableParms.minClauseWord) {
      this.notify.showWarning(
        "Minimum word count for clause is " +
        this.configurableParms.minClauseWord,
        "" + `(Clause ${this.clauseNo[index]})`
      );
      return false;
    }
    return true;
  }

  _validateCharLimitForHeading(questionVersion) {
    let title = questionVersion.heading.trim();
    if (title.length < this.configurableParms.minTitleChar) {
      this.notify.showWarning(
        "Warning",
        "Minimum character limit for heading is " +
        this.configurableParms.minTitleChar
      );
      return false;
    } else if (title.length > this.configurableParms.maxTitleChar) {
      this.notify.showWarning(
        "Warning",
        "Maximum character limit " +
        this.configurableParms.maxTitleChar +
        " will exceed"
      );
      return false;
    }
    return true;
  }

  _trimData(text) {
    if (text) {
      return text.trim();
    }
  }
  _keepClauseOrder(clauses) {
    let clauseOrder = 0;
    if (clauses) {
      clauses.forEach(async (value) => {
        clauseOrder++;
        value.clauseOrder = clauseOrder;
        const lastclause = this._trimData(value.clause);
        const lastChar = lastclause.charAt(lastclause.length - 1);
        if (clauses.length === clauseOrder) {
          if (lastChar !== "?") {
            if (lastChar === ";") {
              value.clause = value.clause.substring(0, value.clause.length - 1);
            }
            value.clause = value.clause + "?";
          }
        } else if (lastChar !== ";") {
          if (lastChar === "?") {
            value.clause = value.clause.substring(0, value.clause.length - 1);
          }
          value.clause = value.clause + ";";
        }
      });
      return clauses;
    }
  }
  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    )
      this.listStatus = this.router.getCurrentNavigation().extras.state.data;
  }
}
